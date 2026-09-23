import type { Metadata } from "next";
import Link from "next/link";
import { NftStore } from "@/components/nft-store";

const heading = "NFTs";
const summary =
  "Land, items, and wearables as objects you can collect, equip, and trade.";

export const metadata: Metadata = {
  title: heading,
  description: summary,
  openGraph: {
    title: heading,
    description: summary,
  },
  twitter: {
    title: heading,
    description: summary,
  },
};

export default function NftsPage() {
  return (
    <main id="main">
      <div className="w-full px-5 py-10 pb-20">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
          Store
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {heading}
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-foreground">
          {summary} Each card is one object: a single owner, a version, and a
          capability set — the same model as the tutorial.
        </p>
        <p className="mt-3">
          <Link
            href="/blog/what-are-modern-nfts-and-how-to-use-them"
            className="text-sm font-semibold text-cyan underline-offset-4 hover:underline"
          >
            The Future of NFTs — Market Insights & Use Cases
          </Link>
        </p>
        <NftStore />
      </div>
    </main>
  );
}
