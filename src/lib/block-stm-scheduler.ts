import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "The Block-STM scheduler is the piece that turns “run txs in parallel, then fix conflicts” into a correct, lock-light protocol. MVCC stores versions. The scheduler decides **who runs, who validates, who aborts, and when the block is done** — without a giant priority queue.",
];

export const sections: DefinitionSection[] = [
  {
    id: "constraint",
    title: "The constraint that forces this design",
    blocks: [
      {
        type: "paragraph",
        text: "Consensus already fixed an order T₀ ≺ T₁ ≺ ⋯ ≺ Tₙ₋₁. Commit must match that serial order.",
      },
      {
        type: "paragraph",
        text: "So:",
      },
      {
        type: "bullets",
        items: [
          "A successful validate of Tₖ is **not** a commit. Tⱼ for *j* < *k* can still abort and rewrite keys Tₖ read.",
          "You must keep re-validating higher txs until every prefix is stable.",
          "The same incarnation must never execute on two threads.",
          "Lower indices matter more: fixing T₂ unblocks the rest of the block.",
        ],
      },
      {
        type: "paragraph",
        text: "A static “thread *i* owns txn *i*” mapping fails. You need a **collaborative** pool that always prefers the lowest pending work.",
      },
    ],
  },
  {
    id: "two-kinds",
    title: "Two kinds of work",
    blocks: [
      {
        type: "paragraph",
        text: "Abstractly the scheduler is two ordered sets (no duplicates):",
      },
      {
        type: "table",
        table: {
          headers: ["Set", "Meaning", "Starts as"],
          rows: [
            ["E", "incarnations waiting to **execute**", "all txs, incarnation 0"],
            ["V", "incarnations waiting to **validate**", "empty"],
          ],
        },
      },
      {
        type: "paragraph",
        text: "Workers always take the **smallest index** in *E* ∪ *V*.",
      },
      {
        type: "paragraph",
        text: "**Execution task.** Run VM incarnation *i* of Tₖ against MVMemory.",
      },
      {
        type: "bullets",
        items: [
          "Read hits `ESTIMATE` → stop, put Tₖ back in *E* (dependency).",
          "Otherwise publish the write set.",
          "If this incarnation wrote a **new key** the previous incarnation did not, every T≥ₖ that is not already executing must be put in *V* (their reads may have changed).",
        ],
      },
      {
        type: "paragraph",
        text: "**Validation task.** Re-read Tₖ’s recorded read set. Compare versions.",
      },
      {
        type: "bullets",
        items: [
          "Pass → do nothing to state (still not committed).",
          "Fail → `try_abort`: mark write set `ESTIMATE`, bump incarnation, put Tₖ in *E*, put all T>ₖ not executing into *V*.",
        ],
      },
      {
        type: "paragraph",
        text: "Only the **first** abort of a given `(txn, incarnation)` wins; later validate threads racing on the same version no-op.",
      },
    ],
  },
  {
    id: "not-heaps",
    title: "Why not two priority queues",
    blocks: [
      {
        type: "paragraph",
        text: "Concurrent heaps do not scale. Block-STM exploits the fact that “priority” is the txn index, a dense integer in 0..*n*.",
      },
      {
        type: "paragraph",
        text: "Replace each ordered set with:",
      },
      {
        type: "bullets",
        items: [
          "an atomic cursor (`execution_idx` / `validation_idx`)",
          "a per-txn status word",
        ],
      },
      {
        type: "paragraph",
        text: "“Take the min ready element” becomes: `fetch_add` the cursor, look at that txn’s status, skip if not ready. When new work appears at a **lower** index, `fetch_min` the cursor back down. That is the whole concurrent set.",
      },
    ],
  },
  {
    id: "status",
    title: "Per-transaction status",
    blocks: [
      {
        type: "paragraph",
        text: "Classic V1 machine (paper / early Aptos):",
      },
      {
        type: "code",
        text: `ReadyToExecute(i) --try_incarnate--> Executing(i)
                                          |
                                    finish_execution
                                          v
                                     Executed(i)
                                          |
                                    validate fail
                                          v
                                     Aborting(i)
                                          |
                    ReadyToExecute(i) <-- finish_abort`,
      },
      {
        type: "paragraph",
        text: "Production Aptos also has `Suspended(i)` when execution hits a dependency (`ESTIMATE` / unresolved read) and `ExecutionHalted` if the block is torn down. `try_incarnate` is a mutex on that one status slot: only one thread can move Ready → Executing for incarnation *i*. Incarnation numbers never decrease, so a version is incarnated at most once.",
      },
    ],
  },
  {
    id: "counters",
    title: "The counters",
    blocks: [
      {
        type: "table",
        table: {
          headers: ["Counter", "Meaning"],
          rows: [
            ["execution_idx", "lower bound on txs that may still need execute"],
            ["validation_idx", "lower bound on txs that may still need validate"],
            [
              "decrease_cnt",
              "how often those cursors moved backward (for done-check)",
            ],
            ["num_active_tasks", "in-flight execute/validate (RAII bump)"],
            ["done_marker", "block finished"],
          ],
        },
      },
      {
        type: "paragraph",
        text: "`next_version_to_execute`:",
      },
      {
        type: "steps",
        items: [
          { title: "`idx = execution_idx.fetch_add(1)`" },
          {
            title:
              "if status is `Ready(i)` → `try_incarnate` → return `ExecutionTask(idx, i)`",
          },
          {
            title: "else skip (another thread owns it, or not ready)",
          },
        ],
      },
      {
        type: "paragraph",
        text: "`next_version_to_validate`:",
      },
      {
        type: "steps",
        items: [
          { title: "`idx = validation_idx.fetch_add(1)`" },
          {
            title:
              "if status is `Executed(i)` → return `ValidationTask(idx, i, wave)`",
          },
          { title: "else skip" },
        ],
      },
      {
        type: "paragraph",
        text: "`next_task` picks the smaller of the two cursors. If `validation_idx` < `execution_idx`, prefer validate. That keeps the prefix of the block “clean” so commit can advance.",
      },
      {
        type: "paragraph",
        text: "When work is created **behind** a cursor:",
      },
      {
        type: "code",
        text: `decrease_validation_idx(target) → validation_idx = min(validation_idx, target)
decrease_execution_idx(target)  → execution_idx  = min(execution_idx, target)
decrease_cnt++`,
      },
      {
        type: "paragraph",
        text: "Typical calls:",
      },
      {
        type: "table",
        table: {
          headers: ["Event", "Cursor move"],
          rows: [
            [
              "Tₖ aborted",
              "validation_idx ← min(., k+1), Tₖ → Ready, maybe execution_idx ← min(., k)",
            ],
            [
              "Tₖ wrote a new key",
              "validation_idx ← min(., k) so Tₖ and everyone after re-validate",
            ],
            ["dependency resolved", "execution_idx ← min(., waiter)"],
          ],
        },
      },
      {
        type: "paragraph",
        text: "Without the decrease, workers would only walk forward and miss the newly dirty prefix.",
      },
    ],
  },
  {
    id: "waves",
    title: "Waves (Aptos production)",
    blocks: [
      {
        type: "paragraph",
        text: "A raw `fetch_min` on `validation_idx` races with in-flight validators. Aptos packs **index + wave** in one `u64`: every time the cursor is pulled backward, `wave++`.",
      },
      {
        type: "paragraph",
        text: "Each txn tracks:",
      },
      {
        type: "bullets",
        items: [
          "`max_triggered_wave` — last wave that required it to be validated",
          "`required_wave` — wave stamped onto the validation task",
          "`maybe_max_validated_wave` — highest wave that already passed",
        ],
      },
      {
        type: "paragraph",
        text: "Commit of Tₖ is allowed only when its validated wave covers every trigger that could have invalidated it. That way a validate that started **before** an abort is not mistaken for a validate that ran **after** the abort.",
      },
      {
        type: "paragraph",
        text: "Think of a wave as a generation number on “the world might have changed below you.”",
      },
    ],
  },
  {
    id: "worker-loop",
    title: "Worker loop",
    blocks: [
      {
        type: "code",
        text: `loop:
    if done_marker: return
    task = scheduler.next_task()
    match task:
        Execution(k, inc):
            result = VM.execute(k, inc)           // reads MVMemory
            if NeedDependency(j):
                suspend k; when j finishes, Ready(k); decrease execution_idx
            else:
                publish writes
                scheduler.finish_execution(k, inc, wrote_new_keys?)
        Validation(k, inc, wave):
            ok = validate_read_set(k, inc)
            if !ok && scheduler.try_abort(k, inc):
                mark writes ESTIMATE
                scheduler.finish_abort(k, inc)  // Ready(inc+1), decrease idxs
        Retry:
            continue`,
      },
      {
        type: "paragraph",
        text: "`finish_execution` often returns `Retry` instead of a new task: the thread goes back to `next_task` so the global cursors stay fair. After abort, `finish_abort` may **hand the same thread** `ExecutionTask(k, inc+1)` immediately — re-execute the victim before wandering off to T₉₀₀. That is the “prioritize lower index” rule in code.",
      },
    ],
  },
  {
    id: "done",
    title: "When is the block done?",
    blocks: [
      {
        type: "paragraph",
        text: "Not “every txn validated once.” Done when:",
      },
      {
        type: "code",
        text: `min(execution_idx, validation_idx) ≥ n
∧ num_active_tasks = 0
∧ decrease_cnt is stable`,
      },
      {
        type: "paragraph",
        text: "The last clause stops a race: a thread snapshots the cursors as “past the end” while another thread is about to `fetch_min` them backward. If `decrease_cnt` moved, you are not done. Then `done_marker = true` and workers exit. A separate **commit pointer** walks 0..*n* once statuses are `Executed` and waves line up, applying the highest MVMemory cell per key to storage.",
      },
    ],
  },
  {
    id: "intuition",
    title: "Why this works (intuition)",
    blocks: [
      {
        type: "steps",
        items: [
          {
            title:
              "MVMemory + READLAST ⇒ Tₖ never sees writes from T>ₖ.",
          },
          {
            title:
              "Validate read set ⇒ if anything T<ₖ published after Tₖ ran, Tₖ aborts.",
          },
          {
            title:
              "`ESTIMATE` + decrease `validation_idx` ⇒ everyone above finds out.",
          },
          {
            title: "`try_incarnate` ⇒ one owner per version.",
          },
          {
            title: "Atomic cursors ⇒ cheap “min heap” over 0..*n*.",
          },
          {
            title:
              "Waves ⇒ stale in-flight validates cannot commit a dirty prefix.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "Safety: final state = serial execution of the block. Liveness: each abort increments an incarnation; the paper proves no deadlock (waits only follow index order / `ESTIMATE` of a lower txn) and no livelock under fair scheduling.",
      },
    ],
  },
  {
    id: "v1-v2",
    title: "V1 vs V2 (what you will see in aptos-core)",
    blocks: [
      {
        type: "table",
        table: {
          headers: ["Aspect", "Block-STM V1 (paper)", "Aptos Block-STM V2"],
          rows: [
            [
              "Validation",
              "Explicit tasks in V, waves of next_task",
              "Many validations are on-demand when a lower txn publishes",
            ],
            [
              "Modules",
              "Ordinary keys",
              "Separate cold validation worker for published Move modules (module cache cannot push-invalidate)",
            ],
            [
              "Suspend",
              "Abort + retry from scratch on ESTIMATE",
              "First-class Suspended + resume",
            ],
            [
              "Commit",
              "After global done",
              "Streaming commit of a clean prefix while the tail still executes",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "The counting scheduler is the same idea; V2 moves some validate work off the global queue so contended blocks do not drown in suffix validation tasks.",
      },
    ],
  },
  {
    id: "mental-picture",
    title: "Mental picture",
    blocks: [
      {
        type: "code",
        text: `execution_idx -------> [Ready][Exec][Exec][Ready][Executed] ...
validation_idx ---------------------------->

abort T2:
  writes(T2) := ESTIMATE
  T2.incarnation += 1
  T2.status = Ready
  validation_idx = min(validation_idx, 3)
  execution_idx  = min(execution_idx, 2)

workers flock back to T2, then re-validate T3..`,
      },
      {
        type: "paragraph",
        text: "The scheduler is not a thread-per-tx map and not a lock on the whole block. It is two atomic high-water marks plus a tiny status word per txn, engineered so that **the next thing that must be correct in serial order is the next thing a core picks up**.",
      },
    ],
  },
];
