import Link from "next/link";
import { GameBanner, GameMark, NftArtwork } from "@/components/nft-artwork";
import {
  catalogStats,
  formatOtte,
  gameById,
  nftCategories,
  nftGames,
  nftListings,
} from "@/lib/nft-catalog";
import { posts } from "@/lib/posts";

const featured = nftListings.slice(0, 8);

export function HomeHero() {
  return (
    <div className="bg-white">
      <section className="relative min-h-[420px] overflow-hidden bg-[#04111d] sm:min-h-[560px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/home-bg-poster.jpg)" }}
          aria-hidden="true"
        />
        <video
          className="os-hero-media"
          autoPlay
          muted
          loop
          playsInline
          poster="/home-bg-poster.jpg"
          preload="auto"
          aria-hidden="true"
        >
          <source src="/home-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-[#04111d]/85 via-[#04111d]/45 to-[#04111d]/15" />
        <div className="relative z-10 mx-auto flex min-h-[420px] w-full max-w-[1440px] flex-col justify-end px-4 py-10 sm:min-h-[560px] sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-white/80">Featured</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              oTTeVerse
            </h1>
            <p className="mt-3 text-base leading-7 text-white/90 sm:text-lg">
              Build Your Digital Economy in The Metaverse
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/nfts"
                className="inline-flex h-12 items-center rounded-xl bg-button px-5 text-sm font-semibold text-white hover:bg-button-hover"
              >
                Explore NFTs
              </Link>
              <Link
                href="/blog"
                className="inline-flex h-12 items-center rounded-xl border border-white/40 bg-white/10 px-5 text-sm font-semibold text-white hover:bg-white/20"
              >
                Read the blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Link
            href="/nfts"
            className="shrink-0 rounded-xl bg-button px-4 py-2 text-sm font-semibold text-white hover:bg-button-hover"
          >
            All
          </Link>
          {nftCategories.map((category) => (
            <Link
              key={category}
              href={`/nfts?category=${category}`}
              className="shrink-0 rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-[#f6f7f8]"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">
            Trending collections
          </h2>
          <Link
            href="/nfts"
            className="text-sm font-semibold text-button hover:text-button-hover"
          >
            View all
          </Link>
        </div>
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {nftGames.map((game) => {
            const stats = catalogStats(
              nftListings.filter((item) => item.gameId === game.id),
            );
            return (
              <li key={game.id} className="w-[260px] shrink-0">
                <Link
                  href={`/nfts?game=${game.id}`}
                  className="block overflow-hidden rounded-xl border border-line bg-white hover:shadow-[0_0_8px_rgba(4,17,29,0.18)]"
                >
                  <div className="relative h-24">
                    <GameBanner gameId={game.id} />
                    <div className="absolute -bottom-5 left-3 size-12 overflow-hidden rounded-xl border-2 border-white">
                      <GameMark gameId={game.id} />
                    </div>
                  </div>
                  <div className="px-3 pt-7 pb-3">
                    <p className="truncate text-sm font-semibold">{game.name}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="font-semibold tracking-wide text-muted uppercase">
                          Floor
                        </p>
                        <p className="mt-1 font-semibold tabular-nums">
                          {formatOtte(stats.floor)}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold tracking-wide text-muted uppercase">
                          Items
                        </p>
                        <p className="mt-1 font-semibold tabular-nums">
                          {stats.items}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 pt-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">Notable items</h2>
          <Link
            href="/nfts"
            className="text-sm font-semibold text-button hover:text-button-hover"
          >
            View all
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((item) => {
            const game = gameById.get(item.gameId);
            return (
              <li key={item.id}>
                <Link
                  href={`/nfts?q=${encodeURIComponent(item.name)}`}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white hover:shadow-[0_0_8px_rgba(4,17,29,0.18)]"
                >
                  <div className="aspect-square bg-[#f6f7f8]">
                    <NftArtwork id={item.id} />
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <p className="truncate text-xs text-muted">{game?.name}</p>
                    <h3 className="mt-1 truncate text-sm font-semibold">
                      {item.name}
                    </h3>
                    <div className="mt-3">
                      <p className="text-[10px] font-semibold tracking-wide text-muted uppercase">
                        Price
                      </p>
                      <p className="text-sm font-semibold tabular-nums">
                        {formatOtte(item.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">Learn</h2>
          <Link
            href="/blog"
            className="text-sm font-semibold text-button hover:text-button-hover"
          >
            View all
          </Link>
        </div>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {posts.slice(0, 4).map((post) => (
            <li key={post.slug}>
              <Link
                href={post.href}
                className="block h-full rounded-xl border border-line bg-white p-5 hover:shadow-[0_0_8px_rgba(4,17,29,0.18)]"
              >
                {post.kicker ? (
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-button uppercase">
                    {post.kicker}
                  </p>
                ) : null}
                <h3
                  className={`text-base font-semibold tracking-tight ${post.kicker ? "mt-1" : ""}`}
                >
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{post.dateLabel}</p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#353840]">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
