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
    <form onSubmit={onSubmit} className="mt-8 max-w-sm" noValidate>
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
        className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-cyan"
      />
      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-button px-5 py-2.5 text-sm font-semibold text-white hover:bg-button-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"
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
