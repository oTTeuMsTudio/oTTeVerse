import Image from "next/image";
import Link from "next/link";
import { featuredPost } from "@/lib/posts";

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
      <div className="mt-6">
        <Link
          href={featuredPost.href}
          className="block w-full rounded-md bg-foreground px-5 py-3 text-center text-sm font-semibold text-white hover:bg-cyan sm:inline-block sm:w-auto"
        >
          {featuredPost.title}
        </Link>
      </div>
    </section>
  );
}
