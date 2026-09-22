import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/nfts", label: "NFTs" },
  { href: "/login", label: "Log in" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-cyan bg-white">
      <div className="flex w-full flex-col items-center gap-6 px-5 py-10 text-center">
        <div className="flex flex-col items-center">
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
          <p className="mt-3 text-sm leading-6 text-muted">
            Build Your Digital Economy in The Metaverse
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-col items-center gap-2">
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
      <div className="border-t border-line px-5 py-4 text-center">
        <p className="text-xs text-muted">© 2026 oTTeVerse</p>
      </div>
    </footer>
  );
}
