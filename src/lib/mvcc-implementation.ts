import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "Classic database MVCC versions rows by commit timestamp so readers never block writers. A **block executor** versions by **transaction index in an already-ordered block**. That is the MVCC you implement for parallel game-chain execution.",
  "The serial story is: run T₀, T₁, …, Tₙ₋₁ in order against committed object state. MVCC lets workers run those txs at the same time while still answering every read with “the value the highest earlier writer produced.”",
];

export const sections: DefinitionSection[] = [
  {
    id: "version-identity",
    title: "Version identity",
    blocks: [
      {
        type: "paragraph",
        text: "A version is not “object v3.” It is:",
      },
      {
        type: "code",
        text: "Version = (txn_index, incarnation)",
      },
      {
        type: "bullets",
        items: [
          "`txn_index` — position in the block (the preset serial order).",
          "`incarnation` — how many times that tx has been speculatively executed. First try is 0; each abort increments it.",
        ],
      },
      {
        type: "paragraph",
        text: "Writes from incarnation *k* of Tᵢ **replace** writes from incarnation *k* − 1 of the same Tᵢ. Higher-index txs must never become visible to lower-index txs.",
      },
    ],
  },
  {
    id: "core-map",
    title: "Core map (Aptos-shaped)",
    blocks: [
      {
        type: "paragraph",
        text: "Production Block-STM is roughly:",
      },
      {
        type: "code",
        text: "DashMap<K, BTreeMap<TxnIndex, CachePadded<WriteCell<V>>>>",
      },
      {
        type: "bullets",
        items: [
          "Outer map: one entry per **location** (object id, or `(object_id, field)`).",
          "Inner ordered map: writers of that location, keyed by `txn_index`.",
          "Cell: incarnation + value, or a marker `ESTIMATE`.",
        ],
      },
      {
        type: "paragraph",
        text: "`DashMap` gives concurrent insert of new keys. The `BTreeMap` makes “latest writer with index < *j*” an *O*(log *W*) predecessor query. `CachePadded` reduces false sharing when many cores poke nearby cells.",
      },
      {
        type: "paragraph",
        text: "For a game chain, *K* is `ObjectId` (and optionally a field). *V* is the object blob or a cheap `Arc<[u8]>`.",
      },
    ],
  },
  {
    id: "types",
    title: "Types",
    blocks: [
      {
        type: "code",
        text: `type TxnIndex = u32;
type Incarnation = u32;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord)]
struct Version {
    txn: TxnIndex,
    inc: Incarnation,
}

enum WriteEntry<V> {
    Value { inc: Incarnation, data: V },
    Estimate { inc: Incarnation }, // previous incarnation aborted; wait
}

struct WriteCell<V> {
    entry: parking_lot::RwLock<WriteEntry<V>>,
}

struct MvStore<K, V> {
    data: dashmap::DashMap<K, BTreeMap<TxnIndex, WriteCell<V>>>,
    // last write-set per txn, so abort can convert cells to Estimate
    last_writes: Vec<parking_lot::Mutex<Vec<K>>>,
}

enum ReadResult<V> {
    FromMv { version: Version, value: V },
    FromStorage { value: V }, // committed state before this block
    Estimate,                 // must wait / reschedule
}`,
      },
      {
        type: "paragraph",
        text: "*V* should be `Arc`-like so a read copies a pointer, not a 4 KB NFT.",
      },
    ],
  },
  {
    id: "read-rule",
    title: "Read rule (READLAST)",
    blocks: [
      {
        type: "paragraph",
        text: "When Tⱼ reads key *k*:",
      },
      {
        type: "steps",
        items: [
          {
            title: "Look in Tⱼ’s **local write buffer** (read-your-writes).",
          },
          {
            title:
              "Else look in the MV map for the greatest `txn_index` *i* < *j* that wrote *k*.",
          },
          {
            title:
              "If that cell is `Value` with incarnation *c*, return `(i, c)` and the bytes.",
          },
          {
            title:
              "If it is `Estimate`, Tⱼ has a **known dependency** on Tᵢ — do not guess; yield to the scheduler.",
          },
          {
            title:
              "If nobody earlier in the block wrote *k*, read **committed storage** (pre-block object version).",
          },
        ],
      },
      {
        type: "paragraph",
        text: "That is the whole visibility invariant: Tⱼ never sees Tⱼ₊₁, and it sees the latest *finished* earlier writer.",
      },
      {
        type: "code",
        text: `impl<K: Hash + Eq + Clone, V: Clone> MvStore<K, V> {
    fn read(&self, key: &K, reader: TxnIndex, storage: &dyn Storage<K, V>) -> ReadResult<V> {
        let Some(shard) = self.data.get(key) else {
            return ReadResult::FromStorage { value: storage.get(key) };
        };
        let pred = shard.range(..reader).next_back();
        match pred {
            Some((&txn, cell)) => match &*cell.entry.read() {
                WriteEntry::Estimate { .. } => ReadResult::Estimate,
                WriteEntry::Value { inc, data } => ReadResult::FromMv {
                    version: Version { txn, inc: *inc },
                    value: data.clone(),
                },
            },
            None => ReadResult::FromStorage { value: storage.get(key) },
        }
    }
}`,
      },
    ],
  },
  {
    id: "write-rule",
    title: "Write rule",
    blocks: [
      {
        type: "paragraph",
        text: "A write does **not** overwrite committed state. It inserts `(txn_index → cell)` for that key.",
      },
      {
        type: "bullets",
        items: [
          "Same txn, new incarnation: overwrite the cell in place (same BTree key).",
          "First write from this txn: insert a new BTree entry.",
          "Record the key in `last_writes[txn]` for later abort/validate.",
        ],
      },
      {
        type: "paragraph",
        text: "Write–write is not a conflict in this design. Both versions sit in the tree. The next reader picks the right predecessor. That is why Block-STM “avoids write–write conflicts.”",
      },
      {
        type: "code",
        text: `fn write(&self, key: K, writer: TxnIndex, inc: Incarnation, value: V) {
    let mut shard = self.data.entry(key.clone()).or_default();
    shard
        .entry(writer)
        .and_modify(|cell| {
            *cell.entry.write() = WriteEntry::Value { inc, data: value.clone() };
        })
        .or_insert_with(|| WriteCell {
            entry: parking_lot::RwLock::new(WriteEntry::Value { inc, data: value }),
        });
    self.last_writes[writer as usize].lock().push(key);
}`,
      },
    ],
  },
  {
    id: "execute",
    title: "Execute an incarnation",
    blocks: [
      {
        type: "paragraph",
        text: "Each worker runs the contract against a **view** that intercepts load/store:",
      },
      {
        type: "code",
        text: `struct ExecView<'a, K, V> {
    txn: TxnIndex,
    inc: Incarnation,
    store: &'a MvStore<K, V>,
    storage: &'a dyn Storage<K, V>,
    local: HashMap<K, V>,
    reads: Vec<(K, ReadDescriptor<V>)>,
}

enum ReadDescriptor<V> {
    Storage,
    Mv(Version),
}`,
      },
      {
        type: "paragraph",
        text: "On load: check `local`, else `store.read`, push a descriptor. On store: put in `local` only until the incarnation finishes, then flush `local` into the MV map as the write-set.",
      },
      {
        type: "paragraph",
        text: "If any load returns `Estimate`, abort this attempt without publishing writes (or publish nothing new) and tell the scheduler “wait on txn *i*.”",
      },
    ],
  },
  {
    id: "validate",
    title: "Validate",
    blocks: [
      {
        type: "paragraph",
        text: "Validation is **not** “re-run the contract.” It is: for every key in the recorded read-set, read the MV map again and check the version is still the one you saw.",
      },
      {
        type: "code",
        text: `fn validate(
    &self,
    txn: TxnIndex,
    reads: &[(K, ReadDescriptor<V>)],
    storage: &dyn Storage<K, V>,
) -> bool {
    for (key, recorded) in reads {
        let now = self.read(key, txn, storage);
        match (recorded, now) {
            (ReadDescriptor::Storage, ReadResult::FromStorage { .. }) => {}
            (ReadDescriptor::Mv(v), ReadResult::FromMv { version, .. }) if version == *v => {}
            _ => return false, // an earlier txn wrote (or rewrote) this key
        }
    }
    true
}`,
      },
      {
        type: "paragraph",
        text: "If Tᵢ aborts and re-executes, every Tⱼ with *j* > *i* that read a key Tᵢ writes must be re-validated, even if those Tⱼ already validated once. Commit is only prefix-stable: you commit T₀..Tₖ when that prefix has all validated and no earlier txn can still abort.",
      },
    ],
  },
  {
    id: "abort-estimate",
    title: "Abort and ESTIMATE",
    blocks: [
      {
        type: "paragraph",
        text: "On failed validation:",
      },
      {
        type: "steps",
        items: [
          { title: "Increment incarnation." },
          { title: "Take `last_writes[txn]`." },
          {
            title: "For each key, set the cell to `Estimate` **instead of deleting it**.",
          },
          {
            title:
              "Re-execute. New writes overwrite `Estimate` with a real `Value`.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Why the marker: a later txn that already raced and read that key would otherwise see stale storage and look valid. `Estimate` means “someone before you in serial order is about to write here; wait.” That is Block-STM’s dependency hint and the main abort-reduction trick.",
      },
      {
        type: "code",
        text: `fn mark_estimate(&self, txn: TxnIndex, inc: Incarnation) {
    let keys = std::mem::take(&mut *self.last_writes[txn as usize].lock());
    for key in keys {
        if let Some(mut shard) = self.data.get_mut(&key) {
            if let Some(cell) = shard.get(&txn) {
                *cell.entry.write() = WriteEntry::Estimate { inc };
            }
        }
    }
}`,
      },
      {
        type: "paragraph",
        text: "Never leave a torn `Value` from a doomed incarnation visible.",
      },
    ],
  },
  {
    id: "commit-gc",
    title: "Commit and GC",
    blocks: [
      {
        type: "paragraph",
        text: "When the prefix T₀..Tₖ is final:",
      },
      {
        type: "bullets",
        items: [
          "Apply each tx’s last write-set to durable object storage **in order**.",
          "Drop MV entries with `txn_index` ≤ *k* (or drop the whole map when the block is done — Block-STM MV is **per-block, in-memory**).",
          "Object ids that were only estimated and never rewritten can be ignored.",
        ],
      },
      {
        type: "paragraph",
        text: "Persistent object MVCC (Postgres-style version chains on disk) is a different layer: that is your committed store’s snapshot story for RPC/indexers, not the parallel executor.",
      },
    ],
  },
  {
    id: "concurrency",
    title: "Concurrency in Rust without fighting the checker",
    blocks: [
      {
        type: "table",
        table: {
          headers: ["Problem", "Pattern"],
          rows: [
            [
              "Many cores, many keys",
              "DashMap shards; do not hold a shard guard across VM execution",
            ],
            [
              "Ordered predecessor",
              "BTreeMap inside the shard; keep write cardinality per key small",
            ],
            [
              "Cell updates",
              "parking_lot::RwLock or arc_swap on the value; Arc<V> so reads are cheap",
            ],
            ["False sharing", "CachePadded<WriteCell>"],
            [
              "Per-txn metadata",
              "Vec<Mutex<...>> indexed by txn, not a global map",
            ],
            [
              "Workers",
              "Rayon pool or a custom collaborative scheduler (exec vs validate queues)",
            ],
            [
              "Determinism",
              "no HashMap iteration in the VM; sort write-sets before apply",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "Do **not** use `unsafe` to alias object bytes. Publish new `Arc`s.",
      },
    ],
  },
  {
    id: "object-centric",
    title: "Object-centric wrinkle",
    blocks: [
      {
        type: "paragraph",
        text: "On a game chain a “location” is usually the whole object. That coarsens conflicts (two field updates collide) but keeps the predecessor query trivial and matches owned vs shared objects.",
      },
      {
        type: "paragraph",
        text: "Refinements:",
      },
      {
        type: "bullets",
        items: [
          "Split hot objects into fields (`(ObjectId, FieldId)`) for a marketplace pool.",
          "Owned-only txs can **skip MVCC**: greedy-commit into a private buffer, then splice into storage. No incarnation dance.",
          "Shared-object txs go through this map.",
        ],
      },
    ],
  },
  {
    id: "walkthrough",
    title: "Mental walkthrough",
    blocks: [
      {
        type: "paragraph",
        text: "Block: T₀ transfers sword A, T₁ transfers sword B, T₂ lists sword A on a shared market.",
      },
      {
        type: "steps",
        items: [
          {
            title:
              "T₀ and T₁ execute together. Reads miss the MV map, hit storage. Writes land at indices 0 and 1.",
          },
          {
            title: "T₂ reads A, predecessor is T₀’s new version. Lists it.",
          },
          {
            title:
              "Validation: T₀, T₁ match storage; T₂ still sees T₀’s version. Commit all three.",
          },
          {
            title:
              "If T₀ had aborted after T₂ ran, A’s cell becomes `Estimate`, T₂ validation fails, T₂ waits, then re-reads T₀’s new incarnation.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Same final state as serial T₀ → T₁ → T₂.",
      },
    ],
  },
  {
    id: "what-it-is-not",
    title: "What this MVCC is not",
    blocks: [
      {
        type: "bullets",
        items: [
          "Not snapshot isolation with random commit timestamps. Order is the block.",
          "Not “readers never retry.” Higher txs retry when a lower tx changes their read-set.",
          "Not durable history. GC after the block.",
          "Not a substitute for object ownership. MVCC is how you run the **shared / residual-conflict** slice; the fast path should never enter this map.",
        ],
      },
      {
        type: "paragraph",
        text: "Implement the map and the read/write/validate/estimate protocol first, with a single-threaded scheduler and tests that compare against a serial interpreter. Only then add the collaborative scheduler. Correctness of parallel execution lives almost entirely in this structure.",
      },
    ],
  },
];
