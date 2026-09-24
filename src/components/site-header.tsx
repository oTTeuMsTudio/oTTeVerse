import Image from "next/image";
import Link from "next/link";
import { ConnectWallet } from "@/components/connect-wallet";
import { LogInButton } from "@/components/log-in-button";
import { SiteMenu } from "@/components/site-menu";

export function SiteHeader() {
  return (
    <header className="ue58-menu sticky top-0 z-20 border-b-2 border-cyan">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-3 sm:gap-4 sm:px-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
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
          <span className="hidden truncate text-[15px] font-semibold tracking-tight sm:inline">
            oTTeVerse
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <SiteMenu />
          <ConnectWallet />
          <LogInButton />
        </div>
      </div>
    </header>
  );
}
