import { AuthCard } from "@/components/auth-card";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <AuthCard
      className={className}
      title="Login to your account"
      description="Enter your email below to login to your account"
      fields={[
        {
          id: "email",
          label: "Email",
          type: "email",
          placeholder: "m@example.com",
        },
        {
          id: "password",
          label: "Password",
          type: "password",
          link: {
            href: "#",
            text: "Forgot your password?",
          },
        },
      ]}
      submitLabel="Login"
      googleLabel="Login with Google"
      footer={
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      }
      {...props}
    />
  );
}

