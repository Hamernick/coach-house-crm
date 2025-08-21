import nodemailer from "nodemailer";
import { renderEmail, type EmailBlock } from "@/lib/email/render";
import { env } from "@/lib/env";

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

export async function enqueueEmail(payload: QueuePayload): Promise<void> {
  const { to, subject, blocks, variables } = payload;
  if (!variables.unsubscribe_url) {
    throw new Error("unsubscribe_url is required");
  }
  const html = renderWithVariables(blocks, variables);
  if (!html.includes(variables.unsubscribe_url)) {
    throw new Error("Rendered HTML must include unsubscribe_url");
  }

  const transporter = nodemailer.createTransport(env.SMTP_URL);

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  console.log("Enqueue email", { to, subject });
  // TODO: record metrics
}
