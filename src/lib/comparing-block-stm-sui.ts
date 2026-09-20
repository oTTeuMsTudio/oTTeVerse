import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "They solve the same problem — run many Move transactions at once without breaking a serial story — from opposite ends. **Aptos discovers conflicts after the fact inside a totally ordered block. Sui encodes conflicts in the data model so many txs never enter that block at all.**",
];

export const sections: DefinitionSection[] = [
  {
    id: "contrast",
    title: "One-line contrast",
    blocks: [
      {
        type: "table",
        table: {
          headers: ["Aspect", "Aptos + Block-STM", "Sui"],
          rows: [
            [
              "When is independence known?",
              "During / after execution",
              "Before execution (object list + ownership)",
            ],
            [
              "What is ordered?",
              "Every user tx, by BFT",
              "Only txs that touch shared objects",
            ],
            [
              "Conflict tool",
              "Optimistic STM + re-execute",
              "Causal / versioned objects; owned path skips consensus",
            ],
            [
              "Developer writes",
              "Ordinary borrow_global Move",
              "Object IDs in, ownership as types",
            ],
          ],
        },
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    blocks: [
      {
        type: "code",
        text: `APTOS
  mempool → BFT orders a block T0 < T1 < … Tn
            ↓
        Block-STM workers
        MVMemory + validate + abort/re-exec
            ↓
        commit write sets (per-tx versions)

SUI
  tx names objects + owners
    ├─ only owned / immutable → certify (fast path) → execute
    └─ any shared object      → Mysticeti order versions → execute in causal order`,
      },
      {
        type: "paragraph",
        text: "Aptos: consensus first, parallel execution second.",
      },
      {
        type: "paragraph",
        text: "Sui: classify first; consensus is optional.",
      },
    ],
  },
  {
    id: "state-model",
    title: "State model (this is the real difference)",
    blocks: [
      {
        type: "paragraph",
        text: "**Aptos** is still Diem-shaped: an address holds resources (and modules). Anyone who can name an address can `borrow_global` it. Aptos Objects (AIP-10) group resources at an object address, but the VM still uses global storage. Parallelism cannot be complete until the interpreter has touched keys.",
      },
      {
        type: "paragraph",
        text: "**Sui** deleted global storage. Every asset is an object: `id`, `version`, `owner`. A tx must pass the objects it will use. Ownership classes:",
      },
      {
        type: "bullets",
        items: [
          "**Address-owned** — one writer; fast path",
          "**Immutable** — many readers, no version bump",
          "**Shared** — many writers; Mysticeti assigns versions; mutating the same shared object serializes",
        ],
      },
      {
        type: "paragraph",
        text: "Reads of a shared object at version *v* do not conflict with the writer that produces *v* + 1. Only two **mutating** accesses of the same shared object form an execution edge.",
      },
      {
        type: "paragraph",
        text: "That is why Sui looks like deterministic PCC and Aptos looks like OCC. The VM APIs forced the schedulers.",
      },
    ],
  },
  {
    id: "how-each-runs",
    title: "How each runs a block of work",
    blocks: [
      {
        type: "paragraph",
        text: "**Aptos Block-STM**",
      },
      {
        type: "steps",
        items: [
          { title: "Block is already totally ordered." },
          {
            title:
              "Every tx starts in *E* (execute). *V* (validate) is empty.",
          },
          {
            title:
              "Workers run Move against MVMemory (`read` = last writer with index < `me`).",
          },
          { title: "Validate read sets in order-priority." },
          {
            title:
              "Fail → `ESTIMATE`, bump incarnation, pull `validation_idx` backward, re-execute.",
          },
          {
            title: "Done when cursors pass *n* and no in-flight work.",
          },
          {
            title: "Commit is equivalent to serial T₀ … Tₙ₋₁.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Cost when you guess wrong: extra VM runs + suffix re-validation. Benefit: no access lists; composable `borrow_global`.",
      },
      {
        type: "paragraph",
        text: "**Sui execution**",
      },
      {
        type: "steps",
        items: [
          { title: "Client lists object refs (id + version)." },
          {
            title:
              "If all owned by the sender (or immutable): Byzantine consistent broadcast / Mysticeti-FPC; execute as soon as certificates exist. No global slot vs every other player.",
          },
          {
            title:
              "If any object is shared: consensus picks a version for that object; txs that write it form a queue on that object's version chain. Unrelated objects still run in parallel.",
          },
          {
            title:
              "No speculative abort on the owned path. Shared-object execution is scheduled from the declared graph, not from a post-hoc read set.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Cost when you guess wrong: you cannot “discover” an extra object mid-tx; it had to be an input. Benefit: no wasted incarnations on the common path; owned transfers do not wait on a DEX.",
      },
    ],
  },
  {
    id: "latency",
    title: "Latency and contention",
    blocks: [
      {
        type: "table",
        table: {
          headers: ["Workload", "Block-STM", "Sui"],
          rows: [
            [
              "A transfers NFT, B transfers different NFT",
              "Parallel inside one block; still wait for block finality",
              "Two fast-path certs; no shared queue",
            ],
            [
              "10k users hit one AMM pool",
              "Many aborts on pool resource; STM serializes the hot key",
              "All txs name the pool; consensus orders pool versions; other objects unaffected",
            ],
            [
              "Read-only of a shared catalog",
              "Still a read in the STM read set (can abort if someone wrote it earlier in the block)",
              "Shared read at pinned version; no conflict with later writer",
            ],
            [
              "Nested bag of items",
              "Dynamic borrow_global / table keys — STM infers",
              "Must pass or wrap objects; composition is ownership, not global lookup",
            ],
            [
              "Composability (call unknown module that touches extra accounts)",
              "Natural",
              "Awkward; extra objects must be in the tx",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "Sui’s win is **not** “higher peak TPS in a lab block.” It is **removing owned traffic from consensus and from STM abort storms.** Aptos’s win is **one ordered pipeline** that still parallelizes messy, account-shaped DeFi without asking the wallet for an object list.",
      },
    ],
  },
  {
    id: "consensus",
    title: "Consensus coupling",
    blocks: [
      {
        type: "paragraph",
        text: "Aptos: every user tx is in a BFT block. Execution can pipeline after ordering (and Aptos block times are tens of ms), but you cannot finalize a coin transfer before the block that contains it. Block-STM only speeds *that* block.",
      },
      {
        type: "paragraph",
        text: "Sui: ownership is a consensus-level type.",
      },
      {
        type: "bullets",
        items: [
          "Owned → fast path (Mysticeti-FPC / certified execution)",
          "Shared → Mysticeti-C assigns object versions, then execute",
        ],
      },
      {
        type: "paragraph",
        text: "Execution and consensus share the object graph. Block-STM does not; it is an execution-layer engine you could bolt onto any ordered log (which is why Sei/Polygon/Starknet reused the idea).",
      },
    ],
  },
  {
    id: "move-dialect",
    title: "Move dialect",
    blocks: [
      {
        type: "paragraph",
        text: "Same ancestry, different bytecode contract:",
      },
      {
        type: "bullets",
        items: [
          "Aptos: `move_to`, `borrow_global`, `signer`, sequence numbers / orderless nonces, multi-agent, tables, Objects as an add-on.",
          "Sui: no global ops; `UID` + `key`; `entry` takes objects; packages are objects; `init` on publish.",
        ],
      },
      {
        type: "paragraph",
        text: "Safety story is shared (abilities, no implicit copy of assets). Scheduling story is not.",
      },
    ],
  },
  {
    id: "failure-modes",
    title: "Failure modes",
    blocks: [
      {
        type: "table",
        table: {
          headers: ["Failure", "Aptos", "Sui"],
          rows: [
            [
              "Wrong access list",
              "N/A",
              "Tx rejected or cannot touch the object",
            ],
            [
              "Hidden dependency",
              "Re-execute until read set matches serial order",
              "Cannot happen if inputs are complete",
            ],
            [
              "Hot object",
              "CPU burned on incarnations + validation waves",
              "Queue on that object's versions; latency grows, CPU does not thrash as much",
            ],
            [
              "Opacity / dirty reads",
              "VM aborts speculative inconsistency; scheduler retries",
              "Owned path never speculates against a concurrent writer",
            ],
          ],
        },
      },
    ],
  },
  {
    id: "game-economy",
    title: "For a game / metaverse economy",
    blocks: [
      {
        type: "paragraph",
        text: "This is why the earlier architecture leaned Sui-shaped, with STM as a fallback:",
      },
      {
        type: "bullets",
        items: [
          "Inventories, equipment, land deeds, character objects → **owned**. Sui-style fast path matches “I equipped a sword.”",
          "A single world auction house or raid boss HP → **shared**. Both chains serialize; Sui does it with object versions, Aptos with STM on one resource.",
          "A contract that walks “whatever is in this account” → Aptos is easier.",
          "A contract that is a tree of items → Sui is easier.",
        ],
      },
      {
        type: "paragraph",
        text: "A hybrid (what NEMO-style research points at) is: **Sui objects for classification + Block-STM only on the shared-object subset.** Owned txs greedy-commit; shared txs get MVMemory and a scheduler.",
      },
    ],
  },
  {
    id: "which-to-copy",
    title: "Which to copy",
    blocks: [
      {
        type: "paragraph",
        text: "Choose **Block-STM** if you want:",
      },
      {
        type: "bullets",
        items: [
          "global storage / account model",
          "wallets that do not list keys",
          "an execution crate you can drop on any BFT log",
          "DeFi-shaped composability",
        ],
      },
      {
        type: "paragraph",
        text: "Choose **Sui’s model** if you want:",
      },
      {
        type: "bullets",
        items: [
          "assets as first-class objects",
          "owned transfers that do not wait on the rest of the chain",
          "deterministic parallelism without abort storms",
          "game-shaped state",
        ],
      },
      {
        type: "paragraph",
        text: "They are not two implementations of the same scheduler. Block-STM is an **optimistic engine over a total order.** Sui is a **causally scheduled object machine that only total-orders the shared subset.** For a Rust game L1, the data model choice matters more than which STM paper you cite.",
      },
    ],
  },
];
