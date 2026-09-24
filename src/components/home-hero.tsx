import Link from "next/link";
import { posts } from "@/lib/posts";

export function HomeHero() {
  return (
    <section className="relative z-10 flex flex-1 flex-col">
      <div className="home-stage-bg" aria-hidden="true">
        <video
          className="home-bg-video"
          autoPlay
          muted
          loop
          playsInline
          poster="/home-bg-poster.jpg"
          preload="auto"
        >
          <source src="/home-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 py-10 pb-20">
        <h1 className="text-center text-3xl font-semibold tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] md:text-4xl">
          Welcome to oTTeVerse
        </h1>
        <div className="home-banner-lockup mx-auto mt-8 w-full text-center">
          <p className="text-[clamp(2.75rem,8vw,4.75rem)] leading-[0.92] font-extrabold tracking-[-0.045em] text-[#defc7a]">
            oTTeVerse
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-balance text-[clamp(1.05rem,2.4vw,1.55rem)] leading-snug font-bold text-[#e8ff8c]">
            Build Your Digital Economy in The Metaverse
          </p>
        </div>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:items-start">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={post.href}
              className="block w-full min-w-0 break-words rounded-md bg-button px-5 py-3 text-center text-sm font-semibold text-white hover:bg-button-hover sm:inline-block sm:w-auto"
            >
              {post.kicker ? (
                <span className="mb-1 block text-[10px] font-semibold tracking-[0.16em] uppercase text-white/80">
                  {post.kicker}
                </span>
              ) : null}
              {post.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
