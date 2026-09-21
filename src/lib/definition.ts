export type DefinitionTable = {
  headers: string[];
  rows: string[][];
};

export type ArticleStep = {
  title: string;
  bullets?: string[];
};

export type CalloutTone = "info" | "tip" | "warn" | "rust" | "ue";

export type ArticleTocItem = {
  href: string;
  label: string;
};

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "code"; text: string; label?: string }
  | { type: "table"; table: DefinitionTable }
  | { type: "steps"; items: ArticleStep[] }
  | { type: "callout"; tone: CalloutTone; title: string; text: string }
  | { type: "toc"; items: ArticleTocItem[] }
  | { type: "subheading"; text: string };

export type DefinitionSection = {
  id: string;
  title: string;
  lead?: string;
  bullets?: string[];
  body?: string;
  table?: DefinitionTable;
  crates?: { name: string; role?: string }[];
  blocks?: ArticleBlock[];
};

export type ArchitectureLayer = {
  title?: string;
  detail?: string;
  edge?: string;
  columns?: { title: string; detail: string }[];
};

export const documentTitle = "What oTTeVerse is building";
export const documentKicker = "Definition";

export const lead = [
  "A modern Rust blockchain for games and metaverse economies should treat **assets as first-class objects**, keep **gameplay off the hot path**, and settle **ownership + value** on a high-throughput L1. The design below is a synthesis of what works in production (object-centric models like Sui, parallel execution like Solana/Aptos, hybrid on/off-chain game loops) rather than a clone of any one chain.",
];

export function stripMarkup(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/`/g, "")
    .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1$2");
}

export const sections: DefinitionSection[] = [
  {
    id: "goals",
    title: "Design goals",
    bullets: [
      "Sub-second finality for simple asset moves (equip, trade, craft).",
      "Tens to hundreds of thousands of TPS when transactions do not contend on the same objects.",
      "Near-zero fees for in-game micro-actions.",
      "True ownership of items, land, characters, and currencies that can move across titles.",
      "Gameplay that still feels like a game (60+ FPS, physics, AI) — not a wallet confirmation every click.",
      "One language for protocol and contracts: **Rust**.",
    ],
    body: "Gameplay stays off-chain or in a WASM coprocessor; the chain is the **ledger of record** for the digital economy.",
  },
  {
    id: "stack",
    title: "Layered architecture",
  },
  {
    id: "objects",
    title: "1. Object-centric state (the important part for games)",
    lead: "Do **not** store everything as “account + balance.” Treat every asset as an **object** with:",
    bullets: [
      "globally unique ID",
      "owner (address, another object, or shared)",
      "type + version",
      "capabilities (transfer, mutate, wrap)",
    ],
    body: "Examples: a sword object owned by a character object owned by a player. Independent objects execute in parallel with no global lock. Shared objects (a marketplace pool, a raid boss) go through consensus. This matches how games already think about inventories.",
  },
  {
    id: "consensus",
    title: "2. Consensus and execution (Rust node)",
    bullets: [
      "**Fast path**: single-owner object txs skip full ordering; certify and commit in ~100–400 ms.",
      "**Slow path**: shared objects use a DAG mempool (Narwhal-style) + BFT (Bullshark / Mysticeti-class) so data dissemination is not the bottleneck.",
      "**Parallel execution**: scheduler uses declared object IDs (explicit, like Solana accounts) plus ownership so non-overlapping txs run concurrently. Optimistic STM (Block-STM style) as fallback for shared state.",
      "**Finality**: deterministic, no long reorgs — required if items have real value.",
    ],
    body: "The validator, networking, and execution engine are a Rust workspace (Tokio, QUIC, blst/ed25519, custom object DB). No EVM unless you add it as an optional sidecar.",
  },
  {
    id: "contracts",
    title: "3. Smart contracts in Rust",
    lead: "Two complementary runtimes:",
    table: {
      headers: ["Runtime", "Use", "Why"],
      rows: [
        [
          "On-chain WASM",
          "Economy: mint, trade, royalties, staking, land deeds",
          "Sandboxed, portable, Rust → wasm32",
        ],
        [
          "Native / BPF-like programs",
          "Ultra-hot paths (order books, tick engines)",
          "Solana-style performance",
        ],
        [
          "Off-chain WASM coprocessor",
          "Combat resolution, physics, matchmaking, RNG with commit-reveal",
          "Near-native speed; only hashes / outcomes land on-chain",
        ],
      ],
    },
    body: "Contracts should express **object types and capabilities**, not raw storage slots. That keeps asset composition (bag of items, nested NFTs) cheap and safe.",
  },
  {
    id: "loop",
    title: "4. Hybrid game loop (non-negotiable)",
    table: {
      headers: ["Lives on-chain", "Lives off-chain / coprocessor"],
      rows: [
        ["Ownership, balances, marketplace fills", "Input, rendering, physics"],
        ["Crafting recipes that mint/burn assets", "Frame-by-frame combat"],
        ["Land deeds, rent, royalties", "Chat, presence, pathfinding"],
        ["Tournament prizes, escrow", "Anti-cheat sensors (attest results)"],
      ],
    },
    body: "Backend / sequencer cluster runs the same Rust WASM game handlers, posts periodic checkpoints or fraud/validity proofs. Players never wait on a block for a jump.",
  },
  {
    id: "economy",
    title: "5. Digital economy primitives (protocol-level)",
    lead: "Build these as native object types, not ad-hoc contracts:",
    bullets: [
      "**FT + NFT + dynamic NFT** (stats that mutate without reminting).",
      "**Composability**: objects own objects (character owns loadout owns gems).",
      "**Royalties / creator cuts** enforced at transfer.",
      "**Escrow + atomic swap** for P2P and studio marketplaces.",
      "**Fee market**: priority fees + storage rent so abandoned items do not bloat state.",
      "**In-game currency** as a first-class coin object, optionally bridged.",
      "**Identity**: passkeys / zkLogin so a new player is not forced through seed phrases on day one.",
    ],
    body: "Media (meshes, textures) stays off-chain; the object stores a content hash + URI.",
  },
  {
    id: "data",
    title: "6. Data, indexers, and studio APIs",
    bullets: [
      "Object DB + Merkle / verkle snapshots for light clients and rollbacks.",
      "Dedicated **game indexer** (Rust): inventory views, activity feeds, leaderboards, “what changed since last frame.”",
      "Event bus (WebSocket / gRPC) so engines subscribe to *their* objects only.",
      "Oracles only where needed (fiat ramps, external randomness with VRF).",
    ],
  },
  {
    id: "interop",
    title: "7. Modularity and interoperability",
    lead: "Keep consensus, execution, and DA separable so you can later:",
    bullets: [
      "run an app-specific rollup for one title,",
      "use an external DA layer for cheap media commitments,",
      "bridge assets to Ethereum / Solana without rewriting the object model.",
    ],
    body: "Bridges should move **objects**, not just wrapped ERC-721s.",
  },
  {
    id: "security",
    title: "8. Security model for valuable items",
    lead: "Games with real money attract duplication and admin keys. Protocol-level rules:",
    bullets: [
      "No silent mint: supply changes are typed object operations.",
      "Shared objects have explicit shared-vs-owned modes.",
      "Admin / “studio” keys are time-locked or DAO-gated for economy parameters.",
      "Deterministic WASM + attested coprocessor outputs; never trust a single game server for mint.",
      "Rate limits and storage rent against spam inventories.",
    ],
  },
  {
    id: "crates",
    title: "Suggested Rust crate map (implementation sketch)",
    crates: [
      { name: "node", role: "validator binary" },
      { name: "consensus", role: "DAG + BFT" },
      { name: "execution", role: "object store + scheduler" },
      { name: "vm-wasm", role: "contract runtime" },
      { name: "objects", role: "NFT/FT/land types" },
      { name: "p2p", role: "QUIC gossip" },
      { name: "rpc / indexer" },
      { name: "sdk", role: "Rust + FFI for engines" },
      { name: "coprocessor", role: "optional verifiable game runtime" },
    ],
    body: "Contracts: #[object] macros, capability types, tests against an in-memory object store (same pattern as Anchor / Sui Move tests, but Rust).",
  },
  {
    id: "not",
    title: "What not to do",
    bullets: [
      "Put every combat tick on L1.",
      "Use a global account model as the only state shape.",
      "Make players pay Ethereum-mainnet fees for a potion.",
      "Hide the studio as an unbounded mint authority.",
      "Invent a new contract language when Rust + WASM already exists.",
    ],
    body: "This stack is “modern” because it matches how games actually work: **many independent objects moving at once**, a thin settlement layer for the economy, and Rust from node to contract to (optionally) game logic. Sui-style objects plus Solana-class parallelism plus a WASM coprocessor is the combination that currently fits metaverse digital economies best.",
  },
];

export const architectureLayers: ArchitectureLayer[] = [
  {
    title: "Game clients (Unity / Unreal / Bevy / web WASM)",
    detail: "Wallets, marketplaces, social, studios",
    edge: "SDKs, indexers, RPC, events",
  },
  {
    title: "Application layer",
    detail:
      "Marketplaces • royalties • crafting • land • identity\nNative NFT / FT standards • escrow • tournaments",
  },
  {
    title: "Execution + VM",
    detail:
      "Object store • parallel scheduler • WASM (Rust contracts)\nOptional game coprocessor (off-chain WASM, attested)",
  },
  {
    columns: [
      { title: "Consensus", detail: "DAG + BFT\nfast path" },
      { title: "Data availability", detail: "object snapshots\nerasure coding" },
      { title: "Networking", detail: "gossip + turbine\nQUIC" },
    ],
  },
  {
    title: "Storage",
    detail: "Hot: object DB (Rocks/Sled/custom)    Cold: DA / IPFS hashes",
  },
];
