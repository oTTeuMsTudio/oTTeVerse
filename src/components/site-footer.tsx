import Image from "next/image";
import Link from "next/link";

const columns = [
  {
    title: "Marketplace",
    links: [
      { href: "/", label: "Home" },
      { href: "/nfts", label: "Explore" },
      { href: "/nfts?category=Land", label: "Land" },
      { href: "/nfts?category=Item", label: "Items" },
      { href: "/nfts?category=Wearable", label: "Wearables" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/blog", label: "Blog" },
      {
        href: "/blog/the-web3-gaming-landscape-reset",
        label: "Web3 gaming reset",
      },
      {
        href: "/blog/what-are-modern-nfts-and-how-to-use-them",
        label: "NFT market insights",
      },
    ],
  },
  {
    title: "Account",
    links: [{ href: "/login", label: "Log in" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative z-20 mt-auto border-t border-line bg-[#fbfdff]">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-4 py-12 sm:px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
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
              className="size-9 rounded-xl object-cover"
            />
            <span className="text-lg font-semibold tracking-tight">
              oTTeVerse
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
            Build Your Digital Economy in The Metaverse
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-foreground">
              {column.title}
            </h2>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line px-4 py-4 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-[1440px] text-xs text-muted">
          © 2026 oTTeVerse
        </p>
      </div>
    </footer>
  );
}
