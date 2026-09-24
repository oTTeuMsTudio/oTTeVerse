import { lead, stripMarkup } from "@/lib/definition";

export type Post = {
  slug: string;
  href: string;
  title: string;
  date: string;
  dateLabel: string;
  description: string;
  kicker?: string;
};

export const web3GamingPost: Post = {
  slug: "the-web3-gaming-landscape-reset",
  href: "/blog/the-web3-gaming-landscape-reset",
  title:
    "The Web3 Gaming Landscape Reset: From Play-to-Earn to Play-and-Own",
  date: "2026-09-24",
  dateLabel: "24 September 2026",
  description:
    "Web3 games left hyper-speculative Play-to-Earn after most early titles collapsed under token inflation. Gameplay comes first. NFTs record what players own, and casual players never have to touch a wallet just to play.",
};

export const ue58Post: Post = {
  slug: "how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy",
  href: "/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy",
  title:
    "How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy",
  date: "2026-09-21",
  dateLabel: "21 September 2026",
  description:
    "Unreal Engine 5.8 runs the game. A blockchain written in Rust keeps the record of who owns the sword, the land, and the shop listing. This tutorial connects them, step by step.",
  kicker: "Tutorial",
};

export const modernNftsPost: Post = {
  slug: "what-are-modern-nfts-and-how-to-use-them",
  href: "/blog/what-are-modern-nfts-and-how-to-use-them",
  title: "The Future of NFTs — Market Insights & Use Cases",
  date: "2026-09-22",
  dateLabel: "22 September 2026",
  description:
    "NFTs are becoming things you can own, wear, and sell: a sword, a plot of land, a jacket. This post explains that market in plain words, then shows how to collect one, give it away, equip it, and list it.",
  kicker: "Tutorial",
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

export const mvccPost: Post = {
  slug: "implementing-mvcc-in-rust-for-parallel-game-blockchain-execution",
  href: "/blog/implementing-mvcc-in-rust-for-parallel-game-blockchain-execution",
  title: "Implementing MVCC in Rust for Parallel Game Blockchain Execution",
  date: "2026-09-19",
  dateLabel: "19 September 2026",
  description:
    "How a Rust game-chain block executor versions state by transaction index with Block-STM MVCC so workers execute in parallel without blocking.",
};

export const schedulerPost: Post = {
  slug: "aptos-block-stm-scheduler",
  href: "/blog/aptos-block-stm-scheduler",
  title: "Aptos Block-STM Scheduler",
  date: "2026-09-20",
  dateLabel: "20 September 2026",
  description:
    "How Aptos Block-STM schedules execute and validate work with atomic cursors, per-txn status, and waves instead of a giant priority queue.",
};

export const moveVmPost: Post = {
  slug: "investigating-the-move-vm-execution-model",
  href: "/blog/investigating-the-move-vm-execution-model",
  title: "Investigating the Move VM Execution Model",
  date: "2026-09-20",
  dateLabel: "20 September 2026",
  description:
    "How Move VM runs verified stack bytecode behind a data view so Aptos Block-STM can collect read/write sets and parallelize sequential-looking Move.",
};

export const blockStmSuiPost: Post = {
  slug: "comparing-aptos-block-stm-with-sui",
  href: "/blog/comparing-aptos-block-stm-with-sui",
  title: "Comparing Aptos Block-STM with Sui",
  date: "2026-09-20",
  dateLabel: "20 September 2026",
  description:
    "Aptos discovers conflicts after the fact inside a totally ordered block. Sui encodes conflicts in the data model so many transactions never enter that block at all.",
};

export const mysticetiPost: Post = {
  slug: "examining-the-mysticeti-consensus-protocol",
  href: "/blog/examining-the-mysticeti-consensus-protocol",
  title: "Examining the Mysticeti Consensus Protocol",
  date: "2026-09-20",
  dateLabel: "20 September 2026",
  description:
    "Sui’s uncertified block DAG commits in three message rounds in the good case, with a fast path woven into the same DAG for owned-object transactions.",
};

export const belugaPost: Post = {
  slug: "explaining-the-beluga-synchronizer-mechanism",
  href: "/blog/explaining-the-beluga-synchronizer-mechanism",
  title: "Explaining the Beluga Synchronizer Mechanism",
  date: "2026-09-20",
  dateLabel: "20 September 2026",
  description:
    "The block dissemination layer under Mysticeti: how validators get DAG bytes when happy-path gossip fails, without turning missing hashes into a denial-of-service.",
};

export const posts: Post[] = [
  web3GamingPost,
  ue58Post,
  modernNftsPost,
  featuredPost,
  parallelPost,
  mvccPost,
  schedulerPost,
  moveVmPost,
  blockStmSuiPost,
  mysticetiPost,
  belugaPost,
];

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}
