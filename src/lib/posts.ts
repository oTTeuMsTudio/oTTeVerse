import { lead, stripMarkup } from "@/lib/definition";

export type Post = {
  slug: string;
  href: string;
  title: string;
  date: string;
  dateLabel: string;
  description: string;
};

export const featuredPost: Post = {
  slug: "modern-rust-blockchain-for-games-and-digital-economies",
  href: "/blog/modern-rust-blockchain-for-games-and-digital-economies",
  title: "Modern Rust Blockchain for Games and Digital Economies",
  date: "2026-09-19",
  dateLabel: "19 September 2026",
  description: stripMarkup(lead[0]),
};

export const parallelPost: Post = {
  slug: "parallel-execution-for-game-blockchains",
  href: "/blog/parallel-execution-for-game-blockchains",
  title: "Parallel Execution for Game Blockchains",
  date: "2026-09-19",
  dateLabel: "19 September 2026",
  description:
    "How a Rust game chain runs thousands of inventory transactions in parallel using Sealevel, object ownership, and Block-STM.",
};

export const posts: Post[] = [featuredPost, parallelPost];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
