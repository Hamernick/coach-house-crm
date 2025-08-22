import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const now = new Date().toISOString();

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select("id")
    .eq("status", "scheduled")
    .lte("scheduled_at", now);

  if (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (campaigns && campaigns.length > 0) {
    const ids = campaigns.map((c: { id: string }) => c.id);
    const { error: updateError } = await supabase
      .from("campaigns")
      .update({ status: "sending", updated_at: now })
      .in("id", ids);
    if (updateError) {
      console.error(updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  console.log(`scheduler processed ${campaigns ? campaigns.length : 0} campaigns`);

  return new Response(
    JSON.stringify({ updated: campaigns ? campaigns.length : 0 }),
    { headers: { "Content-Type": "application/json" } }
  );
});
