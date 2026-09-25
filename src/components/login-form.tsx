"use client";

import { useState, type FormEvent } from "react";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!isEmail(value)) {
      setMessage("Enter a valid email address.");
      return;
    }
    setMessage("Account sign-in is not open yet.");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8" noValidate>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-foreground"
      >
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setMessage(null);
        }}
        className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-3 text-sm text-foreground outline-none focus:border-button focus:shadow-[0_0_0_3px_rgba(32,129,226,0.18)]"
      />
      <button
        type="submit"
        className="mt-4 h-12 w-full rounded-xl bg-button px-5 text-sm font-semibold text-white hover:bg-button-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button"
      >
        Log in
      </button>
      {message ? (
        <p className="mt-3 text-sm text-foreground" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
