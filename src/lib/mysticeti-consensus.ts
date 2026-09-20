import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "Mysticeti is Sui’s production BFT protocol: an **uncertified block DAG** that commits in **three message rounds** in the good case, with a **fast path woven into the same DAG** for owned-object txs. It replaced Narwhal + Bullshark on Sui mainnet (July 2024) and was tightened again as **Mysticeti v2**.",
];

export const sections: DefinitionSection[] = [
  {
    id: "what-it-replaced",
    title: "What it replaced",
    blocks: [
      {
        type: "paragraph",
        text: "Narwhal built a **certified DAG**: each block needed a quorum certificate before it was a first-class vertex. That gave availability and equivocation resistance, but:",
      },
      {
        type: "bullets",
        items: [
          "~3 extra rounds of signing **per block** just to certify",
          "`O(n)` signature work per block",
          "Bullshark then ran a slower commit rule on that certified graph",
        ],
      },
      {
        type: "paragraph",
        text: "Result on Sui: shared-object commits around **~1.9 s**, high validator CPU. Mysticeti’s bet: **drop explicit certificates** and read the same properties off **DAG patterns**. Reported mainnet drop: ~1.9 s → **~400 ms** consensus, with much less CPU.",
      },
    ],
  },
  {
    id: "model",
    title: "Model",
    blocks: [
      {
        type: "bullets",
        items: [
          "`n = 3f + 1` validators, `f` Byzantine",
          "Time is **rounds**, not slots of a single leader",
          "Every honest validator proposes a block each round",
          "A block carries: epoch, round, author, timestamp, `≥ 2f + 1` **ancestor refs**, transactions, commit votes",
        ],
      },
      {
        type: "paragraph",
        text: "Progress rule: advance to round `r` after seeing a quorum of round `r − 1` blocks (threshold logical clock). The DAG is the clock and the vote store at once.",
      },
      {
        type: "code",
        text: `round r+2   B0 B1 B2 B3     ← later leaders / voters
              ↘ ↓ ↙
round r+1   A0 A1 A2 A3
              ↘ ↓ ↙
round r     L0 L1 L2 L3     ← several anchors/leaders`,
      },
      {
        type: "paragraph",
        text: "Many proposers per round ⇒ bandwidth from all links, not one leader’s NIC. Censorship resistance is structural: your tx can sit in any honest block.",
      },
    ],
  },
  {
    id: "uncertified-dag",
    title: "Uncertified DAG",
    blocks: [
      {
        type: "paragraph",
        text: "A block is **one author signature**, then gossiped. No QC per vertex.",
      },
      {
        type: "paragraph",
        text: "Quorum support is inferred:",
      },
      {
        type: "bullets",
        items: [
          "**Certificate pattern:** `2f + 1` later blocks in the causal future **support** (link to) a proposal",
          "**Skip pattern:** `2f + 1` later blocks **do not support** it",
        ],
      },
      {
        type: "paragraph",
        text: "Those patterns *are* the certificates. Safety still requires that two conflicting commits cannot both collect `2f + 1` honest support; availability of committed data follows from the fact that committed anchors sit in the causal history of later honest blocks (plus a synchronizer — Beluga — when the network is ugly).",
      },
      {
        type: "paragraph",
        text: "CPU win: one sign/verify per **block**, not per block plus `n` cert signatures, and not per transaction.",
      },
    ],
  },
  {
    id: "commit-rule",
    title: "Commit rule (Mysticeti-C)",
    blocks: [
      {
        type: "paragraph",
        text: "Each round designates **one or more anchors** (leaders). The commit rule walks the DAG and either **commits** or **skips** each anchor.",
      },
      {
        type: "bullets",
        items: [
          "**Direct commit:** enough support appears within the 3-round window so the anchor is decided immediately.",
          "**Indirect commit:** a later directly committed anchor (round `≥ R + 3`) has certificates pointing at an earlier undecided anchor; that earlier one commits in the later anchor’s shadow.",
        ],
      },
      {
        type: "paragraph",
        text: "Once an anchor commits, every still-uncommitted block in its causal history is linearized into the **commit sequence**. That sequence is the total order used for **shared objects**.",
      },
      {
        type: "paragraph",
        text: "Design goals vs Bullshark:",
      },
      {
        type: "bullets",
        items: [
          "Commit **every round**, not every other round",
          "**Several leaders per round** so a crashed leader does not stall the pipeline (no classic head-of-line)",
          "Steady-state latency = **3 message delays**, the PBFT / HotStuff good-case lower bound for BFT agreement",
        ],
      },
      {
        type: "paragraph",
        text: "Paper / lab numbers (not mainnet SLA): ~0.5 s commit at ~200k TPS; 10-node tests held **300k TPS** before 1 s latency. Production consensus latency is advertised in the **~300–400 ms** range depending on version and region.",
      },
      {
        type: "paragraph",
        text: "After a commit, Sui still **schedules execution by shared-object version**, and can **cancel txs** after consensus if a commit is too fat — consensus throughput and execution capacity are deliberately decoupled.",
      },
    ],
  },
  {
    id: "fast-path",
    title: "Fast path (Mysticeti-FPC)",
    blocks: [
      {
        type: "paragraph",
        text: "Owned-object txs do not need a global order versus the whole chain. They need: **no conflicting mutate of the same owned object**, and availability.",
      },
      {
        type: "paragraph",
        text: "FPC **does not run a second protocol**. Votes are woven into DAG blocks:",
      },
      {
        type: "bullets",
        items: [
          "A validator includes a fast-path tx in a block only if it does not conflict with txs it already voted for",
          "Other validators’ later blocks that link that history are implicit votes",
          "`2f + 1` votes ⇒ the tx is **certified** and can **execute at the end of round 2** (one round sooner than full C commit)",
        ],
      },
      {
        type: "paragraph",
        text: "Checkpoints later include certified fast-path txs that appear in the causal history of C commits, so the two paths reconverge for state snapshots. Signature cost stays per-block, unlike FastPay/Zef-style per-tx certs.",
      },
      {
        type: "paragraph",
        text: "That is the consensus half of “Sui owned objects skip full consensus.”",
      },
    ],
  },
  {
    id: "mysticeti-v2",
    title: "Mysticeti v2",
    blocks: [
      {
        type: "paragraph",
        text: "v1 still had a **pre-consensus validation / Quorum Driver** path: blast tx to many validators, collect signatures, then enter the DAG. v2 folds validation into the DAG:",
      },
      {
        type: "bullets",
        items: [
          "**Accept is implicit** (you appear as an ancestor)",
          "**Reject is explicit** (only then extra votes)",
          "Certification of a tx is evaluated when needed, across multiple rounds so a tx submitted via a slow validator can still finalize",
          "**Transaction Driver** replaces Quorum Driver: send to **one** well-chosen validator; that node inserts into consensus and returns certified effects; retry elsewhere on failure",
        ],
      },
      {
        type: "paragraph",
        text: "Reported fullnode latency cuts on the order of **25–35%** depending on region. Conceptually v2 applies the **leader commit rule to transactions concurrently** with block commit/skip.",
      },
    ],
  },
  {
    id: "sui-execution",
    title: "How this hooks to Sui execution",
    blocks: [
      {
        type: "code",
        text: `owned-only tx → FPC / v2 implicit cert → execute immediately
                                        (object versions already unique by owner)

shared-object tx → C commit linearizes block
                   → consensus assigns shared object versions
                   → execute txs that write obj @ v then @ v+1 in order
                   → different objects still parallel`,
      },
      {
        type: "paragraph",
        text: "Mysticeti does **not** replace Block-STM. It **produces the order (and sometimes skips ordering)**. Execution is a separate, object-version scheduler. Aptos: BFT block then STM. Sui: DAG decides **whether** a total order is required, then a much simpler executor.",
      },
    ],
  },
  {
    id: "properties",
    title: "Properties and caveats",
    blocks: [
      {
        type: "paragraph",
        text: "**Strengths**",
      },
      {
        type: "bullets",
        items: [
          "Good-case latency at the 3-round bound",
          "All-to-all proposing → throughput and censorship resistance",
          "Crash of one leader masked by other anchors",
          "Fast path and consensus share one message fabric",
          "Cheap crypto relative to certified DAGs",
        ],
      },
      {
        type: "paragraph",
        text: "**Limits**",
      },
      {
        type: "bullets",
        items: [
          "**Liveness is sensitive to round-jumping.** If honest nodes skip rounds arbitrarily, there is a published counterexample where nothing ever commits. Mechanized proofs (IEEE S&P 2026) restore liveness with a restriction on jumping. Implementations must not “optimistically” leap rounds.",
          "**Ordering is not MEV-proof.** Parallel proposers and post-commit fee sort still leave insertion / delay / bias surface; that is an active research critique, not a solved feature.",
          "Shared-object hotspots still queue; consensus being fast does not make one AMM object infinitely parallel.",
          "Uncertified blocks need a real **block sync** path when links drop (Beluga).",
        ],
      },
    ],
  },
  {
    id: "vs-aptos",
    title: "Compared with Aptos consensus (for the earlier thread)",
    blocks: [
      {
        type: "table",
        table: {
          headers: ["Aspect", "Mysticeti (Sui)", "AptosBFT + Block-STM"],
          rows: [
            [
              "Structure",
              "Uncertified multi-leader DAG",
              "Pipelined leader BFT + ordered blocks",
            ],
            [
              "What is agreed",
              "Anchor commits + object versions / fast-path certs",
              "A total order of all user txs",
            ],
            [
              "Fast path",
              "First-class (FPC / v2)",
              "None at consensus; STM only speeds execution",
            ],
            [
              "Latency bound",
              "3 rounds (C), ~2 for owned (FPC)",
              "Quorum votes on blocks; then execute",
            ],
            [
              "Execution coupling",
              "Object graph",
              "STM over the whole block",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "Mysticeti is the reason Sui can say “owned transfer does not wait on the DEX.” Block-STM is the reason Aptos can say “write normal Move, we will sort it out in the block.” They sit at different layers: Mysticeti is specifically the **ordering substrate for an object-centric chain**.",
      },
    ],
  },
];
