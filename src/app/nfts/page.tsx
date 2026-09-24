import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
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
    <main id="main" className="relative flex-1 text-white">
      <div className="ue58-page-bg" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          Database
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] md:text-4xl">
            {heading}
          </h1>
          <p className="rounded-full border border-[#1f2937] bg-[#0d1721] px-3 py-1 text-xs font-semibold tracking-wide text-[#d5e2ee]">
            OTTE
          </p>
        </div>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#d5e2ee] drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          {summary} Each listing is one object: a single owner, a version, and
          a capability set — the same model as the tutorial.
        </p>
        <p className="mt-3">
          <Link
            href="/blog/what-are-modern-nfts-and-how-to-use-them"
            className="text-sm font-semibold text-cyan underline-offset-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] hover:underline"
          >
            The Future of NFTs — Market Insights & Use Cases
          </Link>
        </p>
        <Suspense
          fallback={
            <p className="mt-8 text-sm text-[#d5e2ee]">Loading the catalog…</p>
          }
        >
          <NftStore />
        </Suspense>
      </div>
    </main>
  );
}
