import type { Metadata } from "next";
import Image from "next/image";
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
    <main id="main" className="flex-1 bg-white text-foreground">
      <div
        className="h-36 bg-[#04111d] bg-cover bg-center sm:h-52"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(4,17,29,0.15), rgba(4,17,29,0.35)), url(/ue58-bg.jpg)",
        }}
        role="img"
        aria-label="oTTeVerse game world"
      />
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end gap-4">
          <Image
            src="/logotip.jpg"
            alt=""
            width={88}
            height={88}
            className="-mt-10 size-[88px] rounded-2xl border-4 border-white object-cover shadow-[0_0_8px_rgba(4,17,29,0.12)]"
          />
          <div className="min-w-0 pt-3 pb-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {heading}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
              {summary}
            </p>
          </div>
        </div>
        <p className="mt-4">
          <Link
            href="/blog/what-are-modern-nfts-and-how-to-use-them"
            className="text-sm font-semibold text-button hover:text-button-hover"
          >
            The Future of NFTs — Market Insights & Use Cases
          </Link>
        </p>
        <Suspense
          fallback={<p className="mt-8 text-sm text-muted">Loading the catalog…</p>}
        >
          <NftStore />
        </Suspense>
      </div>
    </main>
  );
}
