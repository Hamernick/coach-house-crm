# Emailer Package

Email templating utilities built around a simple queue. Messages are rendered
per recipient on the server using the block based templating utilities in
`@/lib/email/render` and are sent via [Nodemailer](https://nodemailer.com/).

### Usage

```ts
import { enqueueEmail } from "@/packages/emailer";

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

The queue currently sends immediately using Nodemailer's transport. If no
`SMTP_URL` environment variable is provided, a JSON transport is used for
development/testing.

Metrics collection hooks remain TODO.
