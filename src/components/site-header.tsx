import Image from "next/image";
import Link from "next/link";
import { ConnectWallet } from "@/components/connect-wallet";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-cyan bg-white">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-foreground"
          aria-label="oTTeVerse home"
        >
          <Image
            src="/logotip.jpg"
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-md object-cover"
            priority
          />
          <span className="truncate text-[15px] font-semibold tracking-tight">
            oTTeVerse
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <nav aria-label="Primary">
            <Link
              href="/blog"
              className="shrink-0 text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              Blog
            </Link>
          </nav>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
