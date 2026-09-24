import type { Metadata } from "next";
import Link from "next/link";
import { NftStore } from "@/components/nft-store";

const heading = "Game NFTs";
const summary =
  "A database of land, items, and wearables from oTTeVerse games. Search the catalog, open a game, and collect an object.";

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
    <main id="main" className="flex-1 bg-[#04111d] text-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
          Database
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {heading}
          </h1>
          <p className="rounded-full border border-[#1f2937] bg-[#0d1721] px-3 py-1 text-xs font-semibold tracking-wide text-[#d5e2ee]">
            OTTE
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#d5e2ee]">
          {summary} Each listing is one object: a single owner, a version, and
          a capability set — the same model as the tutorial.
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
