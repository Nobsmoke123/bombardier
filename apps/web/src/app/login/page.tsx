import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in."
      lede="Pick up the queue, the outreach, and the interviews — without another tab you will forget."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="text-ink underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
