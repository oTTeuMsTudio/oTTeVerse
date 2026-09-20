import Image from "next/image";
import Link from "next/link";
import {
  blockStmSuiPost,
  featuredPost,
  moveVmPost,
  mvccPost,
  parallelPost,
  schedulerPost,
} from "@/lib/posts";

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
        <Link
          href={featuredPost.href}
          className="block w-full rounded-md bg-button px-5 py-3 text-center text-sm font-semibold text-white hover:bg-button-hover sm:inline-block sm:w-auto"
        >
          {featuredPost.title}
        </Link>
        <Link
          href={parallelPost.href}
          className="block w-full rounded-md bg-button px-5 py-3 text-center text-sm font-semibold text-white hover:bg-button-hover sm:inline-block sm:w-auto"
        >
          {parallelPost.title}
        </Link>
        <Link
          href={mvccPost.href}
          className="block w-full rounded-md bg-button px-5 py-3 text-center text-sm font-semibold text-white hover:bg-button-hover sm:inline-block sm:w-auto"
        >
          {mvccPost.title}
        </Link>
        <Link
          href={schedulerPost.href}
          className="block w-full rounded-md bg-button px-5 py-3 text-center text-sm font-semibold text-white hover:bg-button-hover sm:inline-block sm:w-auto"
        >
          {schedulerPost.title}
        </Link>
        <Link
          href={moveVmPost.href}
          className="block w-full rounded-md bg-button px-5 py-3 text-center text-sm font-semibold text-white hover:bg-button-hover sm:inline-block sm:w-auto"
        >
          {moveVmPost.title}
        </Link>
        <Link
          href={blockStmSuiPost.href}
          className="block w-full rounded-md bg-button px-5 py-3 text-center text-sm font-semibold text-white hover:bg-button-hover sm:inline-block sm:w-auto"
        >
          {blockStmSuiPost.title}
        </Link>
      </div>
    </section>
  );
}
