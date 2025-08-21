"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/utils";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const supabase = createSupabaseBrowser();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/login` },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <AuthCard
        className={className}
        title="Check your email"
        description="We sent you a confirmation link."
        {...props}
      >
        <Button className="w-full" onClick={() => router.push("/login")}>Back to login</Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      className={className}
      title="Create an account"
      description="Enter your email below to create your account"
      fields={[
        {
          id: "email",
          label: "Email",
          name: "email",
          type: "email",
          placeholder: "m@example.com",
        },
        {
          id: "password",
          label: "Password",
          name: "password",
          type: "password",
        },
        {
          id: "confirm",
          label: "Confirm password",
          name: "confirm",
          type: "password",
        },
      ]}
      onSubmit={onSubmit}
      submitLabel="Create account"
      googleLabel="Sign up with Google"
      footer={
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4">
            Log in
          </a>
        </div>
      }
      error={error}
      {...props}
    />
  );
}

