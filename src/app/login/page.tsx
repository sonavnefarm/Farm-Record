import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
      <h1 className="mb-1 text-lg font-semibold tracking-tight text-[var(--color-text)]">
        Farm Manager
      </h1>
      <p className="mb-6 text-sm text-[var(--color-text-muted)]">
        Sign in to manage your farm.
      </p>
      <LoginForm />
    </div>
  );
}
