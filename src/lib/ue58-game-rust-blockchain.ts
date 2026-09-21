import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "Unreal Engine 5.8 is where the game *feels* like a game: Iris replication, Mover, World Partition, Mesh Terrain. A modern **Rust blockchain** is where the **digital economy** lives — items, land, currency, royalties, and marketplaces as first-class objects. This tutorial takes a UE 5.8 project from a blank Games template to a client that mints, equips, and trades assets on an object-centric Rust L1, without putting combat ticks on-chain.",
];

export const sections: DefinitionSection[] = [
  {
    id: "what-you-ship",
    title: "What you will ship",
    blocks: [
      {
        type: "toc",
        items: [
          { href: "#what-you-ship", label: "What you will ship" },
          { href: "#split", label: "Keep gameplay off the chain" },
          { href: "#prereqs", label: "Prerequisites" },
          { href: "#architecture", label: "Architecture" },
          { href: "#ue-project", label: "Create the UE 5.8 project" },
          { href: "#plugins", label: "Enable Iris, HTTP, and WebSockets" },
          { href: "#rust-objects", label: "Define chain objects in Rust" },
          { href: "#rpc", label: "Expose a JSON-RPC surface" },
          { href: "#cpp-plugin", label: "Build the C++ chain client" },
          { href: "#wallet", label: "Wallet and player identity" },
          { href: "#inventory", label: "Bind inventory to object events" },
          { href: "#marketplace", label: "Shared-object marketplace" },
          { href: "#server", label: "Dedicated server and coprocessor" },
          { href: "#loop", label: "Local integration loop" },
          { href: "#checklist", label: "Ship checklist" },
        ],
      },
      {
        type: "paragraph",
        text: "The finished slice is a third-person action prototype whose **cosmetics and tradable loot** are real chain objects. A player opens a chest in UE, the dedicated server attests the outcome, the Rust node mints an item object, and every other client sees that sword in the owner’s inventory through the indexer — not through a studio database.",
      },
      {
        type: "callout",
        tone: "info",
        title: "The product, in one sentence",
        text: "UE 5.8 runs the 60 FPS loop. Rust settles **ownership and value**. The bridge is a signed JSON-RPC + WebSocket plugin, not a validator inside the game process.",
      },
    ],
  },
  {
    id: "split",
    title: "Keep gameplay off the chain",
    blocks: [
      {
        type: "paragraph",
        text: "A digital-economy game dies the moment a jump waits on a block. Put settlement on L1 and keep the frame on the engine. This is the same split as [Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies).",
      },
      {
        type: "table",
        table: {
          headers: ["Lives in UE 5.8", "Lives on the Rust L1"],
          rows: [
            [
              "Input, camera, animation, Chaos physics",
              "Item / land / currency objects",
            ],
            [
              "Iris replication of pawns and projectiles",
              "Ownership, versions, capabilities",
            ],
            [
              "Mover locomotion and prediction",
              "Marketplace fills and royalties",
            ],
            [
              "World Partition streaming, Mesh Terrain",
              "Land deeds and rent",
            ],
            [
              "Mutable cosmetics on the skeletal mesh",
              "Cosmetic object metadata + content hash",
            ],
            [
              "Matchmaking, chat, anti-cheat sensors",
              "Escrow, tournament prizes, attested results",
            ],
          ],
        },
      },
      {
        type: "callout",
        tone: "warn",
        title: "Do not put combat ticks on L1",
        text: "Each fire, dodge, and hit-react stays on the dedicated server. The chain sees **mint, burn, transfer, equip, list, fill** — typed object operations with sub-second finality on the fast path.",
      },
    ],
  },
  {
    id: "prereqs",
    title: "Prerequisites",
    blocks: [
      {
        type: "paragraph",
        text: "Install the toolchain before you touch the plugin. UE 5.8 is the last planned major Unreal Engine 5 release; Iris is production-ready in this version, which is why this tutorial targets it.",
      },
      {
        type: "steps",
        items: [
          {
            title: "**Unreal Engine 5.8** from the Epic Games Launcher or GitHub.",
            bullets: [
              "C++ Games template (third person is enough).",
              "Visual Studio 2022 with the Game Development with C++ workload on Windows.",
            ],
          },
          {
            title: "**Rust stable** (`rustup`) with `wasm32-unknown-unknown` for contracts.",
          },
          {
            title: "A local **object-centric node** from the oTTeVerse crate map: `node`, `execution`, `vm-wasm`, `objects`, `rpc`, `indexer`, `sdk`.",
          },
          {
            title: "A wallet that can sign secp256k1 or ed25519 payloads. MetaMask via EIP-1193 is enough for the first vertical slice.",
          },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Work in two terminals",
        text: "Keep the Rust node + indexer in one terminal and the Unreal Editor in the other. The game never compiles the chain. It speaks HTTP and WebSockets to `rpc`.",
      },
    ],
  },
  {
    id: "architecture",
    title: "Architecture",
    blocks: [
      {
        type: "paragraph",
        text: "Read this diagram top-down. Frames never cross the dotted line. Economy transactions always do.",
      },
      {
        type: "code",
        label: "hybrid loop",
        text: `UE 5.8 client
  Iris + Mover + Enhanced Input
  OtteChain plugin (HTTP / WebSocket)
              │
              │  signed JSON-RPC
              ▼
Gameplay dedicated server          Rust L1
  combat, loot tables                objects + WASM contracts
  attested chest outcomes            parallel scheduler
  20–60 Hz sim                       Mysticeti + Beluga
              │                              ▲
              └──── coprocessor result ──────┘
                     (hash + signature)

Indexer ──► inventory views, activity, “what changed”`,
      },
      {
        type: "paragraph",
        text: "Owned-object transfers (equip, send a sword) take the **fast path** and skip full shared-object ordering. A marketplace pool is a **shared object** and goes through consensus. That is the same object model as the rest of this blog: independent inventories run in parallel; hubs serialize.",
      },
      {
        type: "callout",
        tone: "rust",
        title: "Why Rust on the chain side",
        text: "One language for the validator, the object store, WASM contracts, the indexer, and the SDK. The UE plugin stays C++. The FFI boundary is JSON-RPC, so you can swap a local node for a hosted RPC without rebuilding the game.",
      },
    ],
  },
  {
    id: "ue-project",
    title: "1. Create the UE 5.8 project",
    blocks: [
      {
        type: "steps",
        items: [
          {
            title: "Launch the Epic Games Launcher and open **Unreal Engine 5.8**.",
          },
          {
            title: "New Project → Games → Third Person → C++. Name it `OtteRealm`. Enable starter content only if you want lighting to look finished in screenshots.",
          },
          {
            title: "In Project Settings → Packaging, set build configuration to **Development** while you iterate. Incremental cooking (beta in 5.8) plus Zenserver as the cooked output store is already the default — leave it on.",
          },
          {
            title: "Create a plugin: Edit → Plugins → New Plugin → **Blank** → `OtteChain`. This is the only C++ you add for the chain.",
          },
        ],
      },
      {
        type: "callout",
        tone: "ue",
        title: "5.8 features you actually use here",
        text: "**Iris** is production-ready for pawn replication. **Mover** can optionally replicate through Iris. **Mutable** is production-ready for composing cosmetics from chain metadata. Mesh Terrain and PCG are how you fill the world — they never touch the ledger.",
      },
    ],
  },
  {
    id: "plugins",
    title: "2. Enable Iris, HTTP, and WebSockets",
    blocks: [
      {
        type: "paragraph",
        text: "Iris replaces the old replication path for the multiplayer slice. HTTP and WebSockets are how the client talks to `rpc` and the indexer. None of these modules are the chain.",
      },
      {
        type: "subheading",
        text: "DefaultEngine.ini",
      },
      {
        type: "code",
        label: "Config/DefaultEngine.ini",
        text: `[/Script/Engine.Engine]
!NetDriverDefinitions=ClearArray
NetDriverDefinitions=(DefName="GameNetDriver",DriverClassName="/Script/Iris.IrisNetDriver",DriverClassNameFallback="/Script/OnlineSubsystemUtils.IpNetDriver")

[SystemSettings]
net.Iris.UseIrisReplication=1`,
      },
      {
        type: "subheading",
        text: "Plugin descriptor",
      },
      {
        type: "code",
        label: "Plugins/OtteChain/OtteChain.uplugin",
        text: `{
  "FileVersion": 3,
  "FriendlyName": "oTTeVerse Chain",
  "Version": 1,
  "VersionName": "1.0",
  "EnabledByDefault": true,
  "Modules": [
    {
      "Name": "OtteChain",
      "Type": "Runtime",
      "LoadingPhase": "Default"
    }
  ],
  "Plugins": [
    { "Name": "WebSockets", "Enabled": true }
  ]
}`,
      },
      {
        type: "subheading",
        text: "Build.cs modules",
      },
      {
        type: "code",
        label: "Plugins/OtteChain/Source/OtteChain/OtteChain.Build.cs",
        text: `PublicDependencyModuleNames.AddRange(new string[]
{
    "Core",
    "CoreUObject",
    "Engine",
    "HTTP",
    "Json",
    "JsonUtilities",
    "WebSockets"
});`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "Enhanced Input for the wallet prompt",
        text: "UE 5.8 unifies Enhanced Input with Common UI. Bind a `IA_OpenWallet` action to the pause menu so signing never fights the movement context. Do not pop a browser overlay during a dodge.",
      },
    ],
  },
  {
    id: "rust-objects",
    title: "3. Define chain objects in Rust",
    blocks: [
      {
        type: "paragraph",
        text: "Treat every tradable thing as an **object** with a globally unique ID, an owner, a version, and capabilities. A sword is not a row in a SQL inventory table. It is an object the scheduler can run in parallel with every other player’s sword.",
      },
      {
        type: "code",
        label: "crates/objects/src/item.rs",
        text: `use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ObjectId(pub [u8; 32]);

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum Owner {
    Address(Address),
    Object(ObjectId),
    Shared,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct GameItem {
    pub id: ObjectId,
    pub owner: Owner,
    pub version: u64,
    pub item_type: ItemType,
    pub stats: ItemStats,
    pub content_hash: [u8; 32],
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ItemStats {
    pub rarity: u8,
    pub power: u16,
    pub socket_count: u8,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum ItemType {
    Weapon,
    Armor,
    Cosmetic,
    LandDeed,
    Currency,
}`,
      },
      {
        type: "paragraph",
        text: "Media stays off-chain. `content_hash` points at a mesh, texture, or Mutable recipe in your CDN or IPFS. UE loads the asset by hash after the indexer says the player owns the object.",
      },
      {
        type: "code",
        label: "crates/objects/src/ops.rs",
        text: `pub enum EconomyOp {
    MintItem { to: Address, item_type: ItemType, stats: ItemStats, content_hash: [u8; 32] },
    Transfer { id: ObjectId, to: Address },
    Equip { item: ObjectId, character: ObjectId },
    Unequip { item: ObjectId },
    List { item: ObjectId, price: Coin },
    Fill { listing: ObjectId, buyer: Address },
    AttestLoot { chest: ObjectId, seed: [u8; 32], result_hash: [u8; 32] },
}`,
      },
      {
        type: "callout",
        tone: "rust",
        title: "Capabilities, not admin keys",
        text: "`MintItem` should require a `TreasuryCap` object the studio (or a time-locked DAO) holds. Players never get a silent mint. This matches the security model in the architecture post: supply changes are typed object operations.",
      },
    ],
  },
  {
    id: "rpc",
    title: "4. Expose a JSON-RPC surface",
    blocks: [
      {
        type: "paragraph",
        text: "The game client should not speak the validator wire protocol. Give it three calls and a subscription. Keep payloads small — object IDs and versions, not meshes.",
      },
      {
        type: "table",
        table: {
          headers: ["Method", "Who calls it", "What it returns"],
          rows: [
            [
              "otte_getOwnedObjects",
              "client on login / inventory open",
              "id, type, version, stats, content_hash",
            ],
            [
              "otte_submitTx",
              "client after a wallet signature",
              "digest + effects (created / mutated / deleted)",
            ],
            [
              "otte_getObject",
              "client when an actor spawns",
              "canonical object bytes",
            ],
            [
              "otte_subscribeOwner",
              "client WebSocket",
              "push when that address’s objects change",
            ],
          ],
        },
      },
      {
        type: "code",
        label: "crates/rpc/src/owned.rs",
        text: `#[derive(Serialize)]
pub struct OwnedObject {
    pub id: ObjectId,
    pub version: u64,
    pub item_type: ItemType,
    pub stats: ItemStats,
    pub content_hash: String,
    pub equipped_to: Option<ObjectId>,
}

pub async fn get_owned_objects(
    state: &RpcState,
    owner: Address,
) -> Result<Vec<OwnedObject>, RpcError> {
    state.indexer.objects_by_owner(owner).await
}`,
      },
      {
        type: "paragraph",
        text: "The indexer is a dedicated Rust crate. It materializes inventory views so the game never scans the object DB on the frame thread. See the architecture post’s “game indexer” note: *what changed since last frame* is an event, not a full rescan.",
      },
    ],
  },
  {
    id: "cpp-plugin",
    title: "5. Build the C++ chain client",
    blocks: [
      {
        type: "paragraph",
        text: "One `UOtteChainClient` subsystem owns HTTP for submits and a WebSocket for the owner subscription. Gameplay code never calls `FHttpModule` directly.",
      },
      {
        type: "code",
        label: "OtteChainClient.h",
        text: `UCLASS()
class OTTECHAIN_API UOtteChainClient : public UGameInstanceSubsystem
{
    GENERATED_BODY()

public:
    virtual void Initialize(FSubsystemCollectionBase& Collection) override;
    virtual void Deinitialize() override;

    void Connect(const FString& RpcUrl, const FString& WsUrl);
    void SubmitTx(const FString& SignedPayload);
    void RequestOwnedObjects(const FString& AddressHex);

    DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(
        FOnInventoryUpdated, const TArray<FOtteItem>&, Items);
    UPROPERTY(BlueprintAssignable)
    FOnInventoryUpdated OnInventoryUpdated;

private:
    TSharedPtr<IWebSocket> Socket;
    FString RpcUrl;
};`,
      },
      {
        type: "code",
        label: "OtteChainClient.cpp (submit)",
        text: `void UOtteChainClient::SubmitTx(const FString& SignedPayload)
{
    const TSharedRef<IHttpRequest> Req = FHttpModule::Get().CreateRequest();
    Req->SetURL(RpcUrl);
    Req->SetVerb(TEXT("POST"));
    Req->SetHeader(TEXT("Content-Type"), TEXT("application/json"));
    Req->SetContentAsString(FString::Printf(
        TEXT("{\\"jsonrpc\\":\\"2.0\\",\\"id\\":1,\\"method\\":\\"otte_submitTx\\",\\"params\\":[%s]}"),
        *SignedPayload));
    Req->OnProcessRequestComplete().BindUObject(this, &UOtteChainClient::OnSubmitComplete);
    Req->ProcessRequest();
}`,
      },
      {
        type: "code",
        label: "OtteChainClient.cpp (subscribe)",
        text: `void UOtteChainClient::Connect(const FString& InRpcUrl, const FString& WsUrl)
{
    RpcUrl = InRpcUrl;
    Socket = FWebSocketsModule::Get().CreateWebSocket(WsUrl, TEXT(""));
    Socket->OnMessage().AddUObject(this, &UOtteChainClient::OnWsMessage);
    Socket->OnConnected().AddLambda([this]()
    {
        const FString Sub = FString::Printf(
            TEXT("{\\"jsonrpc\\":\\"2.0\\",\\"id\\":2,\\"method\\":\\"otte_subscribeOwner\\",\\"params\\":[\\"%s\\"]}"),
            *PlayerAddress);
        Socket->Send(Sub);
    });
    Socket->Connect();
}`,
      },
      {
        type: "callout",
        tone: "warn",
        title: "Keep JSON off the game thread",
        text: "Parse indexer payloads on a worker (`AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask)`) and marshal the `TArray<FOtteItem>` back with `AsyncTask(ENamedThreads::GameThread)`. A 2 KB inventory is fine; a 2 MB dump in `Tick` is not.",
      },
    ],
  },
  {
    id: "wallet",
    title: "6. Wallet and player identity",
    blocks: [
      {
        type: "paragraph",
        text: "Day-one players should not be forced through a seed phrase before the tutorial dungeon. Use passkeys or zkLogin for the account object, and treat an injected EIP-1193 wallet as the power-user path for trading.",
      },
      {
        type: "steps",
        items: [
          {
            title: "On first launch, create a **player object** on-chain with a passkey credential. That object owns the character object.",
          },
          {
            title: "Bind an optional external wallet later with an atomic `Transfer` of a `WalletLink` capability — the character does not move.",
          },
          {
            title: "Every economy tx is signed in a Common UI modal (`WBP_SignTx`) that shows human text: “Mint Iron Sword”, “List for 12 GOLD”, never a raw hex dump as the only copy.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "For a web companion (the oTTeVerse site already uses EIP-6963 MetaMask discovery), the same address owns the same objects. The game and the site are two clients of one ledger.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Session keys for micro-actions",
        text: "Equip and loot-ack can use a session key with a spending cap and a 30-minute TTL so the player is not prompted on every chest. Listings and withdrawals always require the root signer.",
      },
    ],
  },
  {
    id: "inventory",
    title: "7. Bind inventory to object events",
    blocks: [
      {
        type: "paragraph",
        text: "Drive the HUD from chain events. The dedicated server may *predict* a drop for juice; the item actor only becomes tradable after `otte_submitTx` returns effects that include a created `GameItem`.",
      },
      {
        type: "code",
        label: "AOtteInventory.cpp",
        text: `void AOtteInventory::BeginPlay()
{
    Super::BeginPlay();
    if (UOtteChainClient* Chain = GetGameInstance()->GetSubsystem<UOtteChainClient>())
    {
        Chain->OnInventoryUpdated.AddDynamic(this, &AOtteInventory::RebuildFromChain);
        Chain->RequestOwnedObjects(PlayerAddress);
    }
}

void AOtteInventory::RebuildFromChain(const TArray<FOtteItem>& Items)
{
    Slots.Reset();
    for (const FOtteItem& Item : Items)
    {
        FInventorySlot Slot;
        Slot.ObjectId = Item.Id;
        Slot.Version = Item.Version;
        Slot.Mesh = LoadMeshByHash(Item.ContentHash);
        Slots.Add(Slot);
    }
    OnRep_Slots();
}`,
      },
      {
        type: "paragraph",
        text: "Use **Mutable** (production-ready in 5.8) to assemble the skeletal mesh from cosmetic objects. Each cosmetic is an owned object; Mutable parameters are the stats payload. When the player trades the cloak, the next `RebuildFromChain` drops that parameter. No studio database row to go stale.",
      },
      {
        type: "callout",
        tone: "ue",
        title: "Iris only replicates the visual",
        text: "Replicate `Slots` as a compact struct (id + version + hash) so other players see the cloak. The authority for *who owns it* remains the chain. If a client lies, the next indexer push corrects the HUD.",
      },
    ],
  },
  {
    id: "marketplace",
    title: "8. Shared-object marketplace",
    blocks: [
      {
        type: "paragraph",
        text: "A listing is a shared object. Two buyers racing to fill it is a real conflict — this is where [parallel execution](/blog/parallel-execution-for-game-blockchains) and [Block-STM](/blog/aptos-block-stm-scheduler) earn their keep. Independent listings still run concurrently.",
      },
      {
        type: "code",
        label: "crates/objects/src/market.rs",
        text: `pub struct Listing {
    pub id: ObjectId,
    pub owner: Owner, // Shared
    pub item: ObjectId,
    pub price: Coin,
    pub royalty_bps: u16,
    pub version: u64,
}

pub fn fill(listing: &mut Listing, buyer: Address, payment: Coin) -> FillEffects {
    assert!(payment.amount >= listing.price.amount);
    let royalty = payment.amount * listing.royalty_bps as u64 / 10_000;
    FillEffects {
        item_to: buyer,
        seller_receives: payment.amount - royalty,
        creator_receives: royalty,
        listing_deleted: true,
    }
}`,
      },
      {
        type: "paragraph",
        text: "In UE, `WBP_MarketRow` calls `SubmitTx` with a `Fill` payload. Disable the button locally on click, then wait for the owner subscription. If the fill loses the race, the indexer pushes an error effect and the row returns to “listed.”",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Royalties at transfer time",
        text: "Enforce creator cuts in the `Fill` / `Transfer` operation, not in a courtesy contract the marketplace can skip. Protocol-level royalties are part of the digital-economy primitive set.",
      },
    ],
  },
  {
    id: "server",
    title: "9. Dedicated server and coprocessor",
    blocks: [
      {
        type: "paragraph",
        text: "The UE dedicated server is the authority for *what happened in the room*. It is not the authority for *who owns the sword*. After a chest opens, the server runs the loot table in an off-chain WASM coprocessor (or native Rust), then posts an `AttestLoot` transaction with a result hash.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Chest actor on the server rolls the table with a commit-reveal seed.",
          },
          {
            title: "Coprocessor returns `{ item_type, stats, content_hash }` and a signature over that payload.",
          },
          {
            title: "Server (or a relayer the player co-signs) submits `AttestLoot`. The WASM contract mints the `GameItem` to the player object.",
          },
          {
            title: "Indexer pushes the new object. Clients spawn the pickup mesh from `content_hash`.",
          },
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Never mint from a single game server key",
        text: "A stolen dedicated-server binary should not be an unbounded treasury. Gate `AttestLoot` on a coprocessor signature set, a rate limit, and a `TreasuryCap` with a daily mint ceiling.",
      },
    ],
  },
  {
    id: "loop",
    title: "10. Local integration loop",
    blocks: [
      {
        type: "paragraph",
        text: "Run this until a chest drop survives a client reconnect. That is the moment the economy is real.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Start the Rust node: `cargo run -p node -- --dev`. Confirm RPC on `127.0.0.1:9000` and WS on `9001`.",
          },
          {
            title: "Start the indexer: `cargo run -p indexer -- --rpc http://127.0.0.1:9000`.",
          },
          {
            title: "In Unreal, set `OtteChain.RpcUrl` and `OtteChain.WsUrl` in **Project Settings → oTTeVerse Chain**.",
          },
          {
            title: "PIE as Listen Server. Open a chest. Watch `otte_submitTx` in the node log, then the HUD slot fill.",
          },
          {
            title: "Stop PIE, start again. `RequestOwnedObjects` must restore the sword. If it does not, you stored the item only in the actor.",
          },
          {
            title: "Open a second PIE window as a client. The cloak should replicate through Iris *and* match the indexer.",
          },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "MCP plugin is optional scaffolding",
        text: "UE 5.8 ships an experimental MCP plugin so an LLM can create Blueprints and assets inside the editor. Use it to stub HUD widgets. Do not let it author economy contracts — those stay in the Rust repo with tests against an in-memory object store.",
      },
    ],
  },
  {
    id: "checklist",
    title: "Ship checklist",
    blocks: [
      {
        type: "table",
        table: {
          headers: ["Gate", "Pass when"],
          rows: [
            [
              "Reconnect",
              "Inventory rebuilds from the indexer with matching versions",
            ],
            [
              "Fast path",
              "Owned-object transfer (equip) finalizes in a few hundred ms",
            ],
            [
              "Shared path",
              "Two buyers, one listing: exactly one fill, the other errors cleanly",
            ],
            [
              "Royalty",
              "Creator cut is in the Fill effects, not a side payment",
            ],
            [
              "Session key",
              "Loot-ack works without a root-signer prompt; withdraw does not",
            ],
            [
              "Content hash",
              "Unknown hash shows a placeholder mesh, never a crash",
            ],
            [
              "Iris",
              "Remote pawns show cosmetics; a hacked client cannot grant items",
            ],
            [
              "Fees",
              "Micro-actions are near-zero; listings can pay a priority fee",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "When those gates pass, you have a UE 5.8 game on a modern Rust blockchain for a digital economy: **objects as items**, **Iris as the multiplayer fabric**, **WASM as the contract runtime**, and **gameplay still at 60 FPS**.",
      },
      {
        type: "subheading",
        text: "Read next on this blog",
      },
      {
        type: "bullets",
        items: [
          "[Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies) — the layered architecture this tutorial implements.",
          "[Parallel Execution for Game Blockchains](/blog/parallel-execution-for-game-blockchains) — why independent inventories scale.",
          "[Implementing MVCC in Rust](/blog/implementing-mvcc-in-rust-for-parallel-game-blockchain-execution) — versions on every object your HUD already stores.",
          "[Examining the Mysticeti Consensus Protocol](/blog/examining-the-mysticeti-consensus-protocol) and [Explaining the Beluga Synchronizer Mechanism](/blog/explaining-the-beluga-synchronizer-mechanism) — how the node commits and fetches blocks under the RPC you call.",
        ],
      },
    ],
  },
];
