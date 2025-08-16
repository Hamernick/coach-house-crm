"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowser } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/login-form"; // Placeholder for the custom login form

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/dashboard";
  const supabase = createSupabaseBrowser();

  async function magic(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}${redirect}` },
    });
    setBusy(false);
    if (error) return alert(error.message);
    alert("Check your email for the magic link.");
  }

  async function github() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}${redirect}` },
    });
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-4">Log in</h1>
      <LoginForm
        email={email}
        setEmail={setEmail}
        busy={busy}
        setBusy={setBusy}
        router={router}
        redirect={redirect}
        supabase={supabase}
      />
      <div className="mt-6">
        <Button variant="secondary" onClick={github}>
          Continue with GitHub
        </Button>
      </div>
    </div>
  );
}
