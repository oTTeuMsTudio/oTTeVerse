import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/login", label: "Log in" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-cyan bg-white">
      <div className="flex w-full flex-col gap-8 px-5 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-foreground"
            aria-label="oTTeVerse home"
          >
            <Image
              src="/logotip.jpg"
              alt=""
              width={36}
              height={36}
              className="size-9 rounded-md object-cover"
            />
            <span className="text-[15px] font-semibold tracking-tight">
              oTTeVerse
            </span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            Build Your Digital Economy in The Metaverse
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-line px-5 py-4">
        <p className="text-xs text-muted">© 2026 oTTeVerse</p>
      </div>
    </footer>
  );
}
