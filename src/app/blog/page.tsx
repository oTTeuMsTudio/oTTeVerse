import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on the oTTeVerse Rust blockchain for games and digital economies.",
  openGraph: {
    title: "Blog",
    description:
      "Articles on the oTTeVerse Rust blockchain for games and digital economies.",
  },
  twitter: {
    title: "Blog",
    description:
      "Articles on the oTTeVerse Rust blockchain for games and digital economies.",
  },
};

export default function BlogPage() {
  return (
    <main id="main" className="bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <p className="text-sm font-semibold text-button">Learn</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Blog
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          Articles on the oTTeVerse Rust blockchain for games and digital
          economies.
        </p>
        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="h-full rounded-xl border border-line bg-white p-5 hover:shadow-[0_0_8px_rgba(4,17,29,0.18)]">
                {post.kicker ? (
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-button uppercase">
                    {post.kicker}
                  </p>
                ) : null}
                <h2
                  className={`text-lg font-semibold tracking-tight ${post.kicker ? "mt-1" : ""}`}
                >
                  <Link
                    href={post.href}
                    className="text-foreground hover:text-button"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted">
                  <time dateTime={post.date}>{post.dateLabel}</time>
                </p>
                <p className="mt-3 text-sm leading-6 text-[#353840]">
                  {post.description}
                </p>
                <p className="mt-4">
                  <Link
                    href={post.href}
                    className="text-sm font-semibold text-button hover:text-button-hover"
                  >
                    Read post
                  </Link>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
