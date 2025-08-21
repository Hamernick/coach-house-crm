# Emailer Package

Email templating utilities built around a [BullMQ](https://docs.bullmq.io/)
queue. Messages are rendered per recipient on the server using the block based
templating utilities in `@/lib/email/render` and are sent via
[Nodemailer](https://nodemailer.com/).

### Usage

```ts
import { enqueueEmail, startEmailWorker } from "@/packages/emailer";

// Start a worker somewhere in your application bootstrap
startEmailWorker();

await enqueueEmail({
  to: "user@example.com",
  subject: "Hello",
  blocks: [{ id: "greeting", type: "paragraph", content: "Hi {{name}}" }],
  variables: {
    name: "Ada",
    unsubscribe_url: "https://example.com/unsub",
  },
});
```

The `unsubscribe_url` variable is required and the rendered HTML must contain
its value; otherwise an error is thrown.

Queued messages are processed asynchronously by a BullMQ worker. If no
`SMTP_URL` environment variable is provided, a JSON transport is used for
development/testing.

Optional metrics hooks can be registered with `registerEmailMetrics` for
instrumentation.
