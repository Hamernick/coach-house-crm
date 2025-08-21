import nodemailer from "nodemailer";
import { Queue, Worker, QueueScheduler, type JobsOptions } from "bullmq";
import { renderEmail, type EmailBlock } from "@/lib/email/render";
import { env } from "@/lib/env";

/** Name of the BullMQ queue */
const QUEUE_NAME = "emails";

export interface QueuePayload {
  to: string;
  subject: string;
  /**
   * Email content represented as blocks that will be rendered on the server
   * for each recipient. Variables in the rendered HTML are of the form
   * `{{variable_name}}` and will be replaced using the values provided in
   * `variables`.
   */
  blocks: EmailBlock[];
  /**
   * Per-recipient variables used when rendering the email. An
   * `unsubscribe_url` value is required and will be enforced before sending.
   */
  variables: Record<string, string>;
}

/** Metrics hook interface allowing external instrumentation */
export interface MetricsHook {
  increment(metric: string, value?: number): void;
}

let metrics: MetricsHook | undefined;

/** Register a metrics hook for instrumentation */
export function registerEmailMetrics(hook: MetricsHook): void {
  metrics = hook;
}

function log(
  level: "info" | "error",
  event: string,
  meta: Record<string, unknown>
) {
  const payload = { event, ...meta };
  if (level === "error") {
    console.error(payload);
  } else {
    console.log(payload);
  }
}

function redisConnection() {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  const { hostname, port } = new URL(url);
  return { host: hostname, port: Number(port) };
}

let queue: Queue<QueuePayload> | undefined;
let scheduler: QueueScheduler | undefined;

function getQueue(): Queue<QueuePayload> {
  if (!queue) {
    const connection = redisConnection();
    queue = new Queue<QueuePayload>(QUEUE_NAME, { connection });
    scheduler = new QueueScheduler(QUEUE_NAME, { connection });
  }
  return queue;
}

export async function enqueueEmail(payload: QueuePayload): Promise<void> {
  const jobOptions: JobsOptions = {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  };
  await getQueue().add("send", payload, jobOptions);
  log("info", "email.enqueued", { to: payload.to, subject: payload.subject });
  metrics?.increment("email.enqueued");
}

let worker: Worker<QueuePayload> | undefined;

/** Start a worker to process queued emails */
export function startEmailWorker(): Worker<QueuePayload> {
  if (!worker) {
    const connection = redisConnection();
    worker = new Worker<QueuePayload>(
      QUEUE_NAME,
      async (job) => {
        const { to, subject, blocks, variables } = job.data;
        if (!variables.unsubscribe_url) {
          throw new Error("unsubscribe_url is required");
        }
        const html = renderWithVariables(blocks, variables);
        if (!html.includes(variables.unsubscribe_url)) {
          throw new Error("Rendered HTML must include unsubscribe_url");
        }

        const transporter = nodemailer.createTransport(
          process.env.SMTP_URL ? process.env.SMTP_URL : { jsonTransport: true }
        );

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || "no-reply@example.com",
          to,
          subject,
          html,
        });

        log("info", "email.sent", { jobId: job.id, to, subject });
        metrics?.increment("email.sent");
      },
      { connection }
    );

    worker.on("failed", (job, err) => {
      log("error", "email.failed", { jobId: job?.id, err: err.message });
      metrics?.increment("email.failed");
    });
  }

  return worker;
}

function renderWithVariables(
  blocks: EmailBlock[],
  variables: Record<string, string>
): string {
  let html = renderEmail(blocks);
  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`{{\s*${key}\s*}}`, "g");
    html = html.replace(pattern, value);
  }
  return html;
}