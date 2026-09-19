import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b-2 border-cyan bg-white">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-foreground"
          aria-label="oTTeVerse home"
        >
          <Image
            src="/mark.png"
            alt=""
            width={40}
            height={40}
            className="size-10 object-contain"
            priority
          />
          <span className="truncate text-[15px] font-semibold tracking-tight">
            oTTeVerse
          </span>
        </Link>
        <a
          href="/otteverse-definition.pdf"
          className="shrink-0 text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
        >
          Download PDF
        </a>
      </div>
    </header>
  );
}
