import Link from "next/link";

export function ProfileIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="9.5" r="2.6" />
      <path d="M7.2 17.6a5.2 5.2 0 0 1 9.6 0" />
    </svg>
  );
}

export function LogInButton() {
  return (
    <Link
      href="/login"
      aria-label="Log in"
      className="inline-flex h-8 shrink-0 items-center gap-1.5 px-1.5 text-[12px] text-[#b8b6b4] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67c1f5]"
    >
      <ProfileIcon className="size-3.5" />
      <span className="hidden sm:inline">log in</span>
    </Link>
  );
}
