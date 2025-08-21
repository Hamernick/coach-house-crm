export interface QueuePayload {
  to: string;
  subject: string;
  html: string;
}

export async function enqueueEmail(payload: QueuePayload): Promise<void> {
  console.log("Enqueue email", payload);
  // TODO: record metrics
}
