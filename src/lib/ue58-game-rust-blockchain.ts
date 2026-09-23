import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "This tutorial builds a small game in **Unreal Engine 5.8** and connects it to a **blockchain** written in the Rust programming language. The game stays fast. The blockchain is the shared notebook that says who owns the sword, the land, and the money.",
];

export const sections: DefinitionSection[] = [
  {
    id: "what-you-ship",
    title: "What you will build",
    blocks: [
      {
        type: "toc",
        items: [
          { href: "#what-you-ship", label: "What you will build" },
          { href: "#split", label: "Keep the fight off the notebook" },
          { href: "#prereqs", label: "What to install first" },
          { href: "#architecture", label: "How the pieces fit" },
          { href: "#ue-project", label: "Create the Unreal project" },
          { href: "#plugins", label: "Turn on multiplayer and web chat" },
          { href: "#rust-objects", label: "Describe items in Rust" },
          { href: "#rpc", label: "Add a simple web door" },
          { href: "#cpp-plugin", label: "Build the Unreal add-on" },
          { href: "#wallet", label: "Prove who the player is" },
          { href: "#inventory", label: "Show the backpack from the notebook" },
          { href: "#marketplace", label: "Build the shop" },
          { href: "#server", label: "Open a chest the fair way" },
          { href: "#loop", label: "Test it on your computer" },
          { href: "#checklist", label: "Checklist before you ship" },
        ],
      },
      {
        type: "paragraph",
        text: "When you finish, you have a third-person game. A player opens a chest. The game server checks the roll. The Rust program creates a real item. Every other player sees that sword in the owner's backpack because the notebook says so, not because a private studio database says so.",
      },
      {
        type: "table",
        table: {
          headers: ["Word", "Plain meaning"],
          rows: [
            [
              "Unreal Engine (UE)",
              "The program that draws the game and moves your character.",
            ],
            [
              "Blockchain",
              "A shared notebook. Many computers keep the same copy, so one person cannot secretly change a line.",
            ],
            [
              "Rust",
              "The programming language used to write that notebook's software.",
            ],
            [
              "Object",
              "One thing in the notebook: a sword, a cloak, a piece of land, or a coin pile. It has an id, an owner, and a version number.",
            ],
            [
              "Wallet",
              "An app that proves 'this player is me' by signing a message. Like signing a permission slip.",
            ],
            [
              "Mint",
              "Create a new item and write it into the notebook.",
            ],
          ],
        },
      },
      {
        type: "callout",
        tone: "info",
        title: "The whole idea, in one sentence",
        text: "Unreal runs the game and keeps it smooth. Rust writes down who owns what and what it is worth. A small add-on in the game sends signed web messages. The blockchain does not run inside the game.",
      },
    ],
  },
  {
    id: "split",
    title: "Keep the fight off the notebook",
    blocks: [
      {
        type: "paragraph",
        text: "A game feels broken if a jump has to wait for the notebook. So the fight stays in Unreal. Buying, selling, and owning stay on the chain. This is the same split as [Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies).",
      },
      {
        type: "table",
        table: {
          headers: ["Stays in the game", "Goes in the notebook"],
          rows: [
            [
              "Buttons, camera, animation, and physics",
              "Swords, land, and coins",
            ],
            [
              "Showing other players where you are",
              "Who owns an item, and which version it is",
            ],
            [
              "How your character walks and runs",
              "Shop sales and the creator's cut of the price",
            ],
            [
              "Loading the part of the map near you",
              "Land deeds and rent",
            ],
            [
              "How your character looks",
              "A fingerprint of the outfit file, not the file itself",
            ],
            [
              "Finding a match, chat, and cheat checks",
              "Holding a prize until the match result is proven",
            ],
          ],
        },
      },
      {
        type: "callout",
        tone: "warn",
        title: "Do not write every punch into the notebook",
        text: "Shots, dodges, and hits stay on the game server. The notebook only records six kinds of actions: create an item, destroy an item, give it to someone, equip it, put it up for sale, and buy it.",
      },
    ],
  },
  {
    id: "prereqs",
    title: "What to install first",
    blocks: [
      {
        type: "paragraph",
        text: "Install these tools before you write any game code. Unreal Engine 5.8 is the last big Unreal Engine 5 release. Its multiplayer system, called Iris, is ready for a real game. That is why this tutorial uses 5.8.",
      },
      {
        type: "steps",
        items: [
          {
            title: "**Unreal Engine 5.8**, from the Epic Games Launcher or from GitHub.",
            bullets: [
              "Start from the C++ Games template. The third-person sample is enough.",
              "On Windows, install Visual Studio 2022 with the Game Development with C++ workload. That pack is what compiles Unreal's C++ code.",
            ],
          },
          {
            title: "**Rust**, using the `rustup` installer. Also add the `wasm32-unknown-unknown` target. That target turns the shop rules into a small program the notebook can run safely.",
          },
          {
            title: "A local copy of the oTTeVerse chain. You need these code folders: `node`, `execution`, `vm-wasm`, `objects`, `rpc`, `indexer`, and `sdk`.",
          },
          {
            title: "A wallet that can sign a message. MetaMask in the browser is enough for the first version.",
          },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Use two windows",
        text: "One window runs the Rust notebook and the helper that lists your items. The other window is the Unreal Editor. The game never compiles the chain. It only talks to it over the web.",
      },
    ],
  },
  {
    id: "architecture",
    title: "How the pieces fit",
    blocks: [
      {
        type: "paragraph",
        text: "Read this picture from top to bottom. Pictures and movement never cross the line. Ownership and money always do.",
      },
      {
        type: "code",
        label: "how the game and the notebook talk",
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

Indexer ──► inventory views, activity, "what changed"`,
      },
      {
        type: "paragraph",
        text: "Here is that picture in normal words. **Iris** shows other players your character. **Mover** moves your character. **Enhanced Input** reads the keyboard and controller. The **OtteChain plugin** is the add-on that talks to the chain. A **signed JSON-RPC** message is a web request with your signature on it, so the chain knows it came from you. The **dedicated server** is the computer that runs the fight. The **Rust L1** is the main notebook. **Objects** are the items. **WASM contracts** are the small programs that enforce the shop rules. The **parallel scheduler** updates many different items at the same time. **Mysticeti** and **Beluga** are how the computers agree on the next page and how they catch up. The **coprocessor** rolls the chest and signs the result. The **indexer** keeps a ready-made list of your items so the game does not search the whole notebook every frame.",
      },
      {
        type: "paragraph",
        text: "Giving your own sword to a friend is the **fast path**. Only you own it, so the chain does not need a long meeting. A shop listing is **shared**, because many people might try to buy it at once. Those sales have to take turns. Two players' backpacks can update at the same time. The same shop listing cannot.",
      },
      {
        type: "callout",
        tone: "rust",
        title: "Why the notebook side is written in Rust",
        text: "One language covers the chain's computers, the item storage, the shop rules, the item-list helper, and the toolkit. The Unreal add-on stays in C++. They talk with web messages, so later you can point the game at a hosted chain without rebuilding the game.",
      },
    ],
  },
  {
    id: "ue-project",
    title: "1. Create the Unreal project",
    blocks: [
      {
        type: "steps",
        items: [
          {
            title: "Open the Epic Games Launcher and start **Unreal Engine 5.8**.",
          },
          {
            title: "Choose New Project, then Games, then Third Person, then C++. Name it `OtteRealm`. Turn on starter content only if you want the screenshots to look finished.",
          },
          {
            title: "While you are still testing, open Project Settings, then Packaging, and set the build to **Development**. Unreal 5.8 already packages the game in smaller pieces and stores the result with Zenserver. Leave that on.",
          },
          {
            title: "Make the add-on: Edit, then Plugins, then New Plugin, then **Blank**. Name it `OtteChain`. This is the only new C++ you add for the chain.",
          },
        ],
      },
      {
        type: "callout",
        tone: "ue",
        title: "Three Unreal 5.8 tools you actually use",
        text: "**Iris** copies your character to other players. **Mover** handles walking and running, and it can use Iris too. **Mutable** builds an outfit from pieces, using the item info from the notebook. The ground tools fill the world. They never write in the notebook.",
      },
    ],
  },
  {
    id: "plugins",
    title: "2. Turn on multiplayer and web chat",
    blocks: [
      {
        type: "paragraph",
        text: "Iris is Unreal's newer way to copy characters to other players. HTTP is a normal web request: you ask, you get one answer. A WebSocket is a line that stays open, so the notebook can push an update the moment your items change. None of these is the blockchain. They are only how the game talks to it.",
      },
      {
        type: "subheading",
        text: "Tell Unreal to use Iris",
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
        text: "Describe the add-on",
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
        text: "Modules the add-on is allowed to use",
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
        title: "Open the wallet from the pause menu",
        text: "Unreal 5.8 lets Enhanced Input work with menus. Make an action called `IA_OpenWallet` and put it on the pause menu. The player should not get a wallet popup in the middle of a dodge.",
      },
    ],
  },
  {
    id: "rust-objects",
    title: "3. Describe items in Rust",
    blocks: [
      {
        type: "paragraph",
        text: "Every thing a player can trade is an **object**. It has an id nobody else has, an owner, a version number, and a list of what you are allowed to do with it. A sword is not a row in an ordinary database. It is one object. The chain can update your sword and a friend's sword at the same time, because they are different objects.",
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
        text: "The 3D model does not live in the notebook. `content_hash` is a fingerprint of the model file. The file itself sits on a normal file server, or on IPFS. After the indexer says the player owns the object, Unreal loads the model that matches that fingerprint.",
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
        type: "paragraph",
        text: "Those names are the only economy actions. `MintItem` creates an item. `Transfer` gives it to someone. `Equip` and `Unequip` put it on a character or take it off. `List` puts it in the shop. `Fill` means a buyer takes that listing. `AttestLoot` is the signed note that says what came out of a chest.",
      },
      {
        type: "callout",
        tone: "rust",
        title: "A special key, not a hidden admin button",
        text: "Creating an item should require a special object called a TreasuryCap. The studio holds it, or a group that can use it only after a time lock. Players cannot quietly print new items. Making more supply is a named action.",
      },
    ],
  },
  {
    id: "rpc",
    title: "4. Add a simple web door",
    blocks: [
      {
        type: "paragraph",
        text: "The game should not speak the chain's private language. Give it three requests and one live update. Send item ids and version numbers. Do not send 3D models.",
      },
      {
        type: "table",
        table: {
          headers: ["Request", "Who uses it", "What comes back"],
          rows: [
            [
              "otte_getOwnedObjects",
              "The game, when you log in or open the backpack",
              "Id, type, version, stats, and the file fingerprint",
            ],
            [
              "otte_submitTx",
              "The game, after the wallet signs",
              "A receipt: what was created, changed, or deleted",
            ],
            [
              "otte_getObject",
              "The game, when an item appears in the world",
              "The full object",
            ],
            [
              "otte_subscribeOwner",
              "The open web line (WebSocket)",
              "A push the moment that player's items change",
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
        text: "The indexer is its own Rust program. It builds the backpack list ahead of time. The game reads that list. It does not search the whole notebook while it is drawing a frame. 'What changed since last time' arrives as a message.",
      },
    ],
  },
  {
    id: "cpp-plugin",
    title: "5. Build the Unreal add-on",
    blocks: [
      {
        type: "paragraph",
        text: "One class, `UOtteChainClient`, sends the web requests and listens for updates. The rest of the game never talks to the web by itself. A subsystem is Unreal's name for a helper that lives as long as the game is running.",
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
        label: "OtteChainClient.cpp (send a signed action)",
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
        label: "OtteChainClient.cpp (listen for changes)",
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
        title: "Do not read the answer while drawing a frame",
        text: "Read the JSON on a background task (`AsyncTask(ENamedThreads::AnyBackgroundThreadNormalTask)`). Then hand the item list back to the game thread with `AsyncTask(ENamedThreads::GameThread)`. A small backpack is fine. A huge dump inside `Tick` will make the game stutter.",
      },
    ],
  },
  {
    id: "wallet",
    title: "6. Prove who the player is",
    blocks: [
      {
        type: "paragraph",
        text: "On the first day, do not make the player write down a secret phrase before the tutorial dungeon. Use a passkey, the same idea as Face ID or a device PIN, or a login that turns a normal account into a chain account. Players who want to trade can connect a browser wallet such as MetaMask later.",
      },
      {
        type: "steps",
        items: [
          {
            title: "On the first launch, create a **player object** in the notebook, using a passkey. That object owns the character object.",
          },
          {
            title: "Later, the player can link an outside wallet. That link is its own small object. The character does not move.",
          },
          {
            title: "Every money action is signed in a menu (`WBP_SignTx`) that uses plain words: “Mint Iron Sword” or “List for 12 GOLD”. Do not show only a long hex string.",
          },
        ],
      },
      {
        type: "paragraph",
        text: "The oTTeVerse website already finds MetaMask in the browser. The same address owns the same items in the game and on the site. Two apps, one notebook.",
      },
      {
        type: "callout",
        tone: "info",
        title: "A short permission slip for small actions",
        text: "A session key can last 30 minutes and it can have a spending limit. Opening chests and equipping gear can use it, so the player is not asked to sign every time. Putting an item up for sale, and taking money out, still need the main key.",
      },
    ],
  },
  {
    id: "inventory",
    title: "7. Show the backpack from the notebook",
    blocks: [
      {
        type: "paragraph",
        text: "Build the backpack screen from messages sent by the chain. The game server may show a drop right away, so the game feels instant. The item is only really yours, and only tradable, after `otte_submitTx` answers that a `GameItem` was created.",
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
        text: "**Mutable**, which is ready in Unreal 5.8, builds the character from cosmetic objects. Each cosmetic is an owned object. When the player trades the cloak, the next backpack update removes it. There is no old database row left behind to go stale.",
      },
      {
        type: "callout",
        tone: "ue",
        title: "Iris only copies what other players should see",
        text: "Copy a short note for each slot: the id, the version, and the file fingerprint. That is enough for other players to see the cloak. Who owns it is decided by the notebook. If a cheater's game lies, the next update from the indexer fixes the screen.",
      },
    ],
  },
  {
    id: "marketplace",
    title: "8. Build the shop",
    blocks: [
      {
        type: "paragraph",
        text: "A shop listing is a shared object. Two buyers can press Buy at the same moment. That clash is real. This is where [parallel execution](/blog/parallel-execution-for-game-blockchains) and the [Block-STM scheduler](/blog/aptos-block-stm-scheduler) matter. Listings for different items can still sell at the same time.",
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
        text: "`royalty_bps` is the creator's cut, measured in hundredths of a percent. 500 means 5 percent. The code checks that the buyer paid enough, takes that cut, pays the seller the rest, gives the item to the buyer, and deletes the listing.",
      },
      {
        type: "paragraph",
        text: "In Unreal, the shop row button sends a `Fill` message. Turn the button off as soon as it is clicked, then wait for the update. If someone else bought it first, the indexer sends an error and the row goes back to “listed.”",
      },
      {
        type: "callout",
        tone: "tip",
        title: "Take the creator's cut inside the sale",
        text: "Put the cut in the `Fill` and `Transfer` actions. Do not trust the shop to send it later as a favor. If the cut is part of the sale, a shop cannot skip it.",
      },
    ],
  },
  {
    id: "server",
    title: "9. Open a chest the fair way",
    blocks: [
      {
        type: "paragraph",
        text: "The Unreal dedicated server decides what happened in the room. It does not decide who owns the sword. After a chest opens, a helper program rolls the loot outside the notebook and signs the result. The chain checks that signature, then creates the item. That helper is called a coprocessor.",
      },
      {
        type: "steps",
        items: [
          {
            title: "The chest on the server rolls the loot table with a seed that was locked in before the roll. That way the server cannot change the result after seeing it.",
          },
          {
            title: "The helper returns the item type, the stats, the file fingerprint, and a signature over that answer.",
          },
          {
            title: "The server, or a messenger the player also signs, sends `AttestLoot`. The shop-rules program then mints the `GameItem` to the player.",
          },
          {
            title: "The indexer pushes the new object. Each game client shows the pickup using the file fingerprint.",
          },
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Do not let one game-server key print unlimited items",
        text: "If someone steals the server program, they should not own the treasury. `AttestLoot` should need the helper's signature, a speed limit, and a TreasuryCap that can create only so many items per day.",
      },
    ],
  },
  {
    id: "loop",
    title: "10. Test it on your computer",
    blocks: [
      {
        type: "paragraph",
        text: "Practice until a chest drop is still in the backpack after you close the game and open it again. That is the moment the economy is real.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Start the Rust node: `cargo run -p node -- --dev`. Check that web requests answer on `127.0.0.1:9000` and the live line is on `9001`.",
          },
          {
            title: "Start the indexer: `cargo run -p indexer -- --rpc http://127.0.0.1:9000`.",
          },
          {
            title: "In Unreal, set `OtteChain.RpcUrl` and `OtteChain.WsUrl` under **Project Settings**, then **oTTeVerse Chain**.",
          },
          {
            title: "Press Play as a Listen Server. PIE means Play In Editor, Unreal's play button. Open a chest. Watch `otte_submitTx` in the node log, then watch the backpack slot fill in.",
          },
          {
            title: "Stop play, then press Play again. `RequestOwnedObjects` must bring the sword back. If it does not, you saved the item only inside the actor, not in the notebook.",
          },
          {
            title: "Open a second Play window as a client. The cloak should show up through Iris, and it should match the indexer's list.",
          },
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "The editor AI helper is optional",
        text: "Unreal 5.8 has an experimental MCP plugin. An AI can use it to stub out menu widgets inside the editor. Do not let it write the economy rules. Those stay in the Rust project, with tests against a practice item store.",
      },
    ],
  },
  {
    id: "checklist",
    title: "Checklist before you ship",
    blocks: [
      {
        type: "table",
        table: {
          headers: ["Check", "It passes when"],
          rows: [
            [
              "Close and reopen",
              "The backpack rebuilds from the indexer, and the version numbers match",
            ],
            [
              "Your own item",
              "Equipping it finishes in a few hundred milliseconds",
            ],
            [
              "The shop",
              "Two buyers, one listing: exactly one sale works, and the other gets a clear error",
            ],
            [
              "Creator's cut",
              "The cut is inside the sale receipt, not a separate payment someone might skip",
            ],
            [
              "Short permission slip",
              "Opening a chest works without the main signature prompt. Taking money out does not",
            ],
            [
              "Missing file",
              "An unknown fingerprint shows a placeholder model. It never crashes",
            ],
            [
              "Other players",
              "They see your outfit. A cheated client cannot grant itself items",
            ],
            [
              "Fees",
              "Small actions cost almost nothing. A shop listing can pay extra to go first",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "When those checks pass, you have a Unreal Engine 5.8 game on a Rust blockchain. **Items are objects. Other players see you through Iris. The shop rules are small safe programs. The fight still runs at a smooth frame rate.**",
      },
      {
        type: "subheading",
        text: "Read next on this blog",
      },
      {
        type: "bullets",
        items: [
          "[The Future of NFTs — Market Insights & Use Cases](/blog/what-are-modern-nfts-and-how-to-use-them) — the item you create here, and how to collect it, equip it, and list it.",
          "[Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies) — the bigger design this tutorial follows.",
          "[Parallel Execution for Game Blockchains](/blog/parallel-execution-for-game-blockchains) — why two backpacks can update at the same time.",
          "[Implementing MVCC in Rust](/blog/implementing-mvcc-in-rust-for-parallel-game-blockchain-execution) — why every item your backpack stores also has a version number.",
          "[Examining the Mysticeti Consensus Protocol](/blog/examining-the-mysticeti-consensus-protocol) and [Explaining the Beluga Synchronizer Mechanism](/blog/explaining-the-beluga-synchronizer-mechanism) — how the computers agree on the next page, and how they catch up, under the web door your game calls.",
        ],
      },
    ],
  },
];
