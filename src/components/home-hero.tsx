import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/posts";

export function HomeHero() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-10 pb-20">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Welcome to oTTeVerse
      </h1>
      <figure className="mt-6">
        <Image
          src="/banner.jpg"
          alt="oTTeVerse — Build Your Digital Economy in The Metaverse"
          width={1776}
          height={576}
          className="h-auto w-full rounded-md object-cover"
          sizes="(min-width: 768px) 768px, 100vw"
          priority
        />
      </figure>
      <div className="mt-6 flex flex-col items-stretch gap-3 sm:items-start">
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
    </section>
  );
}
