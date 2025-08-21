import { describe, expect, it } from "vitest";
import { enqueueEmail } from "@/packages/emailer";
import type { EmailBlock } from "@/lib/email/render";

const blocks: EmailBlock[] = [
  {
    id: "greeting",
    type: "paragraph",
    content: "Hello {{name}} <a href=\"{{unsubscribe_url}}\">Unsub</a>",
  },
];

describe("enqueueEmail", () => {
  it("throws when unsubscribe_url missing", async () => {
    await expect(
      enqueueEmail({
        to: "test@example.com",
        subject: "Test",
        blocks,
        variables: { name: "Ada" },
      })
    ).rejects.toThrow("unsubscribe_url");
  });

  it("sends when unsubscribe_url present", async () => {
    await enqueueEmail({
      to: "test@example.com",
      subject: "Test",
      blocks,
      variables: {
        name: "Ada",
        unsubscribe_url: "https://example.com/unsub",
      },
    });
  });
});

