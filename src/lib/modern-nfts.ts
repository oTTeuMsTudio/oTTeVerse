import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "The next NFTs are things you own in a game: a sword, a plot of land, or a jacket. Each one has an id, a type, a version number, and a short list of what you are allowed to do with it. This post explains how that market works, then walks through the use cases: collect one on the [NFTs store](/nfts), give it to a friend, wear it on your character, and put it up for sale.",
];

export const sections: DefinitionSection[] = [
  {
    id: "what-you-will-do",
    title: "What this post covers",
    blocks: [
      {
        type: "toc",
        items: [
          { href: "#what-you-will-do", label: "What this post covers" },
          { href: "#what-it-is", label: "What an NFT is now" },
          { href: "#classic-vs-modern", label: "Old market and the next one" },
          { href: "#the-object", label: "The fields on one item" },
          { href: "#use-the-store", label: "Use case: collect one" },
          { href: "#operations", label: "Use case: give, wear, or sell" },
          { href: "#in-a-game", label: "Use case: bring it into a game" },
          { href: "#safety", label: "What to sign, and what to refuse" },
          { href: "#checklist", label: "Checklist" },
        ],
      },
      {
        type: "paragraph",
        text: "You will leave with a clear picture. An **Iris Blade** is one sword with one owner. A **Harbor Plot** is land. A **Market Stall** is the shared shop booth where a listing lives. The picture on the card is the display. The NFT is the object underneath that picture.",
      },
      {
        type: "table",
        table: {
          headers: ["Word", "Plain meaning"],
          rows: [
            [
              "NFT",
              "A digital item with one owner. Here that means a sword, land, or wearable, with an id written in a shared notebook.",
            ],
            [
              "Object",
              "That item as the notebook stores it: id, owner, type, version, and what you may do with it.",
            ],
            [
              "Wallet address",
              "Your name on the notebook. The wallet app proves it is you by signing, like a permission slip.",
            ],
            [
              "Version",
              "A counter that goes up every time the item changes. Your game remembers it so an old message cannot undo a sale.",
            ],
            [
              "Content hash",
              "A fingerprint of the picture or 3D model. If someone swaps the file, the fingerprint no longer matches.",
            ],
            [
              "OTTE",
              "The coin printed on the store cards. Harbor Plot is 120. Iris Blade is 48. Fast Path Pass is 9.",
            ],
          ],
        },
      },
      {
        type: "callout",
        tone: "info",
        title: "Where this sits",
        text: "The store is where you collect. The notebook rules are the same object model as [How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy) and [Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies).",
      },
    ],
  },
  {
    id: "what-it-is",
    title: "What an NFT is now",
    blocks: [
      {
        type: "paragraph",
        text: "Start from the thing a player means when they say “my sword.” It has one identity. One person owns it at a time. It can move to another wallet, or into another object, such as a character or a shop listing. Other players learn about the move from a reader called an **indexer**. That reader watches the notebook and tells the website and the game what changed. A private studio database is a separate list.",
      },
      {
        type: "bullets",
        items: [
          "**Identity.** A unique object id. Two blades keep two different ids.",
          "**Owner.** A wallet address, another object (a character or a listing), shared (a marketplace stall), or frozen.",
          "**Type.** `item::Blade`, `land::Plot`, `wearable::Sigil`. The type decides which actions are allowed.",
          "**Version.** A number that goes up on every accepted change. Your game stores it so a late message cannot rewind the item.",
          "**Capabilities.** `key` means this record is a real object. `store` means you may give it away or tuck it inside another object. With `store` missing, it stays with the address that received it.",
          "**Display.** A fingerprint of the mesh or image. The file can live on a normal website. The fingerprint lives on the object, so a swapped file stays a different file.",
        ],
      },
      {
        type: "paragraph",
        text: "Each object is its own record. Giving away your blade and giving away someone else’s plot touch different objects, so both can finish at the same time. A shared listing is the opposite case. Two buyers racing for one stall is a real clash, and exactly one purchase wins.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "The picture is the poster. The object is the item.",
        text: "Art, the description, and the shop card are views of the object. The asset is the object id plus its owner and version. If the image website is down, you still own the object. If the file changes while the fingerprint stays the same, the game refuses the file.",
      },
    ],
  },
  {
    id: "classic-vs-modern",
    title: "Market insight: the old token and the next object",
    blocks: [
      {
        type: "paragraph",
        text: "The first NFT markets used a standard called **ERC-721**. A cousin called **ERC-1155** can also represent a stack of identical items. Both proved that a program can say “wallet A owns token number N.” Games then spent years working around the parts that feel wrong in a backpack. The next NFT keeps the ownership promise and gives each item its own record.",
      },
      {
        type: "table",
        table: {
          headers: ["Trait", "Older NFT market", "Next NFT market"],
          rows: [
            [
              "Record",
              "A token number inside one big program",
              "An object id that stands on its own",
            ],
            [
              "Owner",
              "A wallet address in one shared list",
              "A wallet, another object, a shared stall, or frozen",
            ],
            [
              "Transfer",
              "Rewrites storage that every token shares",
              "A single-owner move skips that shared lock",
            ],
            [
              "Composing",
              "Each token sits beside the others",
              "A character object can hold a blade",
            ],
            [
              "Marketplace",
              "One approval can cover every token you own",
              "You hand over the one object you listed",
            ],
            [
              "Royalties",
              "A creator fee the shop is free to skip",
              "The maker’s cut is part of the sale itself",
            ],
            [
              "Display",
              "A link the issuer can rewrite later",
              "A fingerprint pinned on the object",
            ],
            [
              "Speed",
              "Unrelated sales wait on the same program",
              "Unrelated objects can move at the same time",
            ],
          ],
        },
      },
      {
        type: "paragraph",
        text: "That table is the market shift. Ownership stays. The global spreadsheet goes away. A shop lists one item. The person who designed it gets paid inside the sale. Two strangers can trade two different items in the same moment.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "The old approval is the dangerous button",
        text: "`setApprovalForAll` lets one shop program move every token you own, and it keeps that power until you turn it off. A modern listing moves **one** object into **one** stall. When the listing closes, that permission ends with it.",
      },
    ],
  },
  {
    id: "the-object",
    title: "The fields on one item",
    blocks: [
      {
        type: "paragraph",
        text: "This is the item the store is selling when the card says Iris Blade. Land and wearables use the same shape with a different type name. The comment on `owner` is the whole product: four ways an item can be held.",
      },
      {
        type: "code",
        label: "crates/objects/src/item.rs",
        text: `pub struct Item {
    pub id: ObjectId,
    pub owner: Owner, // Address | Object | Shared | Immutable
    pub version: u64,
    pub type_name: &'static str,
    pub content_hash: [u8; 32],
    pub capabilities: Capabilities, // key + store
}

pub enum Owner {
    Address(Address),
    Object(ObjectId),
    Shared,
    Immutable,
}`,
      },
      {
        type: "paragraph",
        text: "The indexer shows this same record to the store and to the game. A client that skips the version will equip a blade the player already sold, because it believed an older page of the notebook.",
      },
      {
        type: "code",
        label: "indexer object",
        text: `{
  "id": "0x8c1a…a42",
  "type": "otte::item::Blade",
  "owner": { "Address": "0xabc…1234" },
  "version": 7,
  "content_hash": "bafy…e31",
  "capabilities": ["key", "store"]
}`,
      },
      {
        type: "bullets",
        items: [
          "**Address owner.** The usual case after a buy. You can give it away, wear it, or list it.",
          "**Object owner.** The blade is tucked inside a character, or held by a listing. The parent has to let it go.",
          "**Shared.** The Market Stall pattern. Anyone can try the action. The notebook orders the tries.",
          "**Immutable.** A published display or a frozen lore object. It stays put. Its fields stay put.",
        ],
      },
    ],
  },
  {
    id: "use-the-store",
    title: "Use case: collect one on the store",
    blocks: [
      {
        type: "paragraph",
        text: "The [NFTs page](/nfts) is the store. Eight listings cover the three types you will actually use: land, items, and wearables. Prices are in **OTTE**. Buying writes that listing onto the wallet address connected in this browser.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Open the [NFTs store](/nfts) from the top-right menu.",
            bullets: [
              "Blog sits beside NFTs, before Connect Wallet. The store is its own page.",
            ],
          },
          {
            title: "Connect a wallet.",
            bullets: [
              "Use **Connect Wallet** in the header, or press **Buy** and approve the request.",
              "MetaMask works. So does any wallet the browser finds through EIP-6963, the standard way a page discovers the wallet app you installed.",
              "If no wallet is installed, Buy opens the MetaMask download page and the listing stays unowned.",
              "If you reject the connection prompt, the page says Connection rejected and the listing stays unowned.",
            ],
          },
          {
            title: "Filter by **Land**, **Item**, or **Wearable** when you already know the slot.",
            bullets: [
              "Harbor Plot, Market Stall, and Mesh Ridge are land.",
              "Iris Blade and Fast Path Pass are items.",
              "Cyan Sigil, Royalties Mark, and Runner Frame are wearables.",
            ],
          },
          {
            title: "Read the card before you buy.",
            bullets: [
              "Category is the type family: land, item, or wearable.",
              "The summary says what the object is allowed to represent.",
              "The price is the amount for that one listing.",
            ],
          },
          {
            title: "Press **Buy** on one card.",
            bullets: [
              "The button reads **Buying…** until the address is known.",
              "It then reads **Collected**, and the page names the short address that owns it.",
              "One listing keeps one owner. After Collected, that card stays with that address.",
            ],
          },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "What the button does today",
        text: "Buy on this site saves the owner in this browser for the visit. The next section is that same action once a node is recording the sales on the chain.",
      },
    ],
  },
  {
    id: "operations",
    title: "Use case: give it, wear it, or sell it",
    blocks: [
      {
        type: "paragraph",
        text: "Three actions cover almost every “how do I use this NFT?” question. Each one names the object. Each one leaves the rest of your backpack where it is.",
      },
      {
        type: "subheading",
        text: "Give it away",
      },
      {
        type: "paragraph",
        text: "A transfer is allowed when the object has `store` and the current owner is a wallet address you control. The version goes up, so the previous owner’s game drops the item.",
      },
      {
        type: "code",
        label: "transfer",
        text: `pub fn transfer(item: &mut Item, to: Address) {
    assert!(item.capabilities.store);
    assert!(matches!(item.owner, Owner::Address(_)));
    item.owner = Owner::Address(to);
    item.version += 1;
}`,
      },
      {
        type: "paragraph",
        text: "Single-owner transfers take the fast path. The notebook checks them and saves them while unrelated plots and blades move too. Gifts and equips should use that path. See [Parallel Execution for Game Blockchains](/blog/parallel-execution-for-game-blockchains) for why the ids have to be written out clearly.",
      },
      {
        type: "subheading",
        text: "Wear it",
      },
      {
        type: "paragraph",
        text: "Equipping keeps the same NFT. It moves the object under a character object you already own. The game server and the other players hear the new owner from the indexer and swap in the mesh whose fingerprint matches `content_hash`.",
      },
      {
        type: "code",
        label: "equip",
        text: `pub fn equip(item: &mut Item, character: ObjectId) {
    assert!(matches!(item.owner, Owner::Address(_)));
    item.owner = Owner::Object(character);
    item.version += 1;
}`,
      },
      {
        type: "callout",
        tone: "tip",
        title: "A play-session key for outfits, the main key for selling",
        text: "Sign everyday equips with a session key, a temporary key for this play session, so the game can skip a popup on every hat. Giving the item away, taking money out, and listing it still ask for the main key in your wallet.",
      },
      {
        type: "subheading",
        text: "Sell it",
      },
      {
        type: "paragraph",
        text: "A listing is a **shared** object. It points at the item and names a price. Two buyers can try to buy it. The scheduler saves one purchase and returns a clear error to the other. The creator’s cut is inside `fill`, so a marketplace has to pay it as part of the sale.",
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
        text: "`royalty_bps` is the maker’s cut in basis points. One hundred basis points is 1 percent, so 500 means 5 percent. The code divides by 10,000 because 10,000 basis points is the whole price. Harbor Plot at 120 OTTE, Iris Blade at 48, and Fast Path Pass at 9 are each one `Listing`. Market Stall is the shared booth those listings hang from. Royalties Mark is the wearable that points at a creator who is paid inside the sale.",
      },
    ],
  },
  {
    id: "in-a-game",
    title: "Use case: bring it into a game",
    blocks: [
      {
        type: "paragraph",
        text: "An NFT is useful in a game when a jump stays instant. Keep the frame in Unreal. Keep ownership on the object. The first tutorial on this blog builds that split in UE 5.8. This one is the backpack side of the same loop.",
      },
      {
        type: "table",
        table: {
          headers: ["You do this", "Where it runs"],
          rows: [
            ["Walk the Harbor Plot", "UE 5.8, on the part of the map near you"],
            ["Swing the Iris Blade", "The game server, in the match"],
            ["Show the Cyan Sigil", "Your computer, using the fingerprint"],
            ["Buy, gift, equip, list", "A Rust transaction on the notebook"],
            ["Lose a race to buy", "The indexer reports the error and the card stays listed"],
            ["Reload the game", "The backpack rebuilds from the object versions"],
          ],
        },
      },
      {
        type: "paragraph",
        text: "Follow [How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy) when you are ready to attach those object events to a character. The C++ add-on talks to the notebook with web messages (JSON-RPC and WebSockets). The game draws the world. The notebook keeps the ownership.",
      },
      {
        type: "callout",
        tone: "rust",
        title: "One language for the asset",
        text: "The item, the listing, and the sale are Rust. A small program on the chain handles the economy. The game sends one typed action and draws the result.",
      },
    ],
  },
  {
    id: "safety",
    title: "What to sign, and what to refuse",
    blocks: [
      {
        type: "paragraph",
        text: "Using an NFT is mostly reading the signature before you approve it. The object model removes the old “move everything I own” approval. A sloppy message can still hand one object to someone else.",
      },
      {
        type: "bullets",
        items: [
          "Sign a transfer that names **one object id** and **one recipient**. Refuse a message that names a whole collection, a range of ids, or the word “all”.",
          "Refuse `setApprovalForAll`, unlimited spending limits, and any market that asks to move objects you left off the listing.",
          "Check the type. A wearable signature should stay a wearable signature. Land uses its own type.",
          "Check the version. When the wallet shows a version older than the indexer, the request is stale. Wait for a fresh one.",
          "Equip with a session key. Sell, withdraw, and change the owner address with the main key.",
          "Treat a shared listing as a race. If your purchase loses, the object stayed with the other buyer. A bigger spending limit leaves that result as it is. Wait for another listing.",
          "Confirm the fingerprint before you show an unknown 3D model. A missing fingerprint shows a placeholder model. The screen stays up, and the placeholder grants you nothing.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "This store asks once",
        text: "A collected card stays collected for the visit. After Buy, this store stays on that result. A page that then asks for a second contract, a different chain, or your secret recovery words is a different site. Those words stay in your wallet app.",
      },
    ],
  },
  {
    id: "checklist",
    title: "Checklist",
    blocks: [
      {
        type: "paragraph",
        text: "You understand this market well enough to use it when you can say each line below in your own words.",
      },
      {
        type: "table",
        table: {
          headers: ["Check", "You can say"],
          rows: [
            [
              "Definition",
              "An NFT is an object with an id, an owner, a type, a version, and capabilities",
            ],
            [
              "Display",
              "The image is a fingerprint on the object, and the object is the asset",
            ],
            [
              "Store",
              "Buy on /nfts gives one listing to the connected address",
            ],
            [
              "Fast path",
              "A single-owner gift can finish while unrelated objects move too",
            ],
            [
              "Equip",
              "The character object becomes the owner, and the mesh follows the fingerprint",
            ],
            [
              "List",
              "A shared listing holds one item, one price, and one creator cut",
            ],
            [
              "Race",
              "Two buyers, one listing: one owner, and a clear error for the other",
            ],
            [
              "Signature",
              "One object, one recipient, and a separate approval for anything else",
            ],
          ],
        },
      },
      {
        type: "subheading",
        text: "Read next on this blog",
      },
      {
        type: "bullets",
        items: [
          "[How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy) — attach these objects to a character while the fight stays in the game.",
          "[Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies) — why these assets are objects in the first place.",
          "[Parallel Execution for Game Blockchains](/blog/parallel-execution-for-game-blockchains) — why two backpacks can update at the same time.",
          "[Comparing Aptos Block-STM with Sui](/blog/comparing-aptos-block-stm-with-sui) — finding a clash after the fact, versus writing the owner so the clash is obvious.",
        ],
      },
    ],
  },
];
