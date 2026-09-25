import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { ProfileIcon } from "@/components/log-in-button";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your oTTeVerse account.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Log in",
    description: "Log in to your oTTeVerse account.",
  },
  twitter: {
    title: "Log in",
    description: "Log in to your oTTeVerse account.",
  },
};

export default function LoginPage() {
  return (
    <main id="main" className="bg-white">
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <div className="rounded-2xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(4,17,29,0.08)] sm:p-8">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-button text-white">
            <ProfileIcon className="size-6" />
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">
            Log in
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Sign in to your oTTeVerse account.
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
