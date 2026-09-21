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
    <main id="main">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 pb-20">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
          Blog
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Posts
        </h1>
        <ul className="mt-10 space-y-12">
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                {post.kicker ? (
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
                    {post.kicker}
                  </p>
                ) : null}
                <h2
                  className={`text-xl font-semibold tracking-tight ${post.kicker ? "mt-1" : ""}`}
                >
                  <Link
                    href={post.href}
                    className="text-foreground hover:text-cyan"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm text-muted">
                  <time dateTime={post.date}>{post.dateLabel}</time>
                </p>
                <p className="mt-3 text-base leading-7 text-foreground">
                  {post.description}
                </p>
                <p className="mt-4">
                  <Link
                    href={post.href}
                    className="text-sm font-semibold text-cyan underline-offset-4 hover:underline"
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
