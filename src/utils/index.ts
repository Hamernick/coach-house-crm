// Re-export only the browser client to avoid bundling server-side helpers
// in the client build. Import server helpers directly where needed.
export { createSupabaseBrowser } from "@/packages/db/client";

