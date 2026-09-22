"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    href: "/blog",
    label: "Blog",
    isCurrent: (pathname: string) =>
      pathname === "/blog" || pathname.startsWith("/blog/"),
  },
  {
    href: "/nfts",
    label: "NFTs",
    isCurrent: (pathname: string) =>
      pathname === "/nfts" || pathname.startsWith("/nfts/"),
  },
];

export function SiteMenu() {
  const pathname = usePathname();

  return (
    <nav aria-label="Menu" className="flex items-center gap-1.5 sm:gap-2">
      {items.map((item) => {
        const current = item.isCurrent(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={`rounded-md px-2 py-1.5 text-sm font-semibold text-white hover:bg-button-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan sm:px-3 ${
              current
                ? "bg-button-hover ring-2 ring-cyan ring-offset-2"
                : "bg-button"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
