"use client";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
