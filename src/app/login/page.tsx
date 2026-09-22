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
    <main id="main">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 pb-16">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-button text-white">
          <ProfileIcon className="size-6" />
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Log in
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Sign in to your oTTeVerse account.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
