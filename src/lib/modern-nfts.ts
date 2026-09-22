import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "A modern NFT is an **object you own**: an id, a type, a version, and a short list of capabilities. It is not a picture that happens to have a token number. This tutorial shows what that object is, how it differs from a classic ERC-721, and how to use one — collect it on the [NFTs store](/nfts), transfer it, equip it in a game, and list it again.",
];

export const sections: DefinitionSection[] = [
  {
    id: "what-you-will-do",
    title: "What you will do",
    blocks: [
      {
        type: "toc",
        items: [
          { href: "#what-you-will-do", label: "What you will do" },
          { href: "#what-it-is", label: "What a modern NFT is" },
          { href: "#classic-vs-modern", label: "Classic token vs modern object" },
          { href: "#the-object", label: "The fields on the object" },
          { href: "#use-the-store", label: "Collect one on the store" },
          { href: "#operations", label: "Transfer, equip, and list" },
          { href: "#in-a-game", label: "Use it inside a game" },
          { href: "#safety", label: "What to sign, and what to refuse" },
          { href: "#checklist", label: "Checklist" },
        ],
      },
      {
        type: "paragraph",
        text: "You will leave with a concrete model. An **Iris Blade** is a single-owner item. A **Harbor Plot** is land. A **Market Stall** is where a shared listing lives. The picture on the card is the display. The NFT is the object underneath it.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Where this sits",
        text: "The store is the place you collect. The chain rules are the same object model as [How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy) and [Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies).",
      },
    ],
  },
  {
    id: "what-it-is",
    title: "What a modern NFT is",
    blocks: [
      {
        type: "paragraph",
        text: "Start from the thing a player means when they say “my sword.” It has one identity. It has one owner at a time. It can move to another address, or into another object, without asking a global token contract for permission. Other clients learn about the move from an indexer, not from a studio database.",
      },
      {
        type: "bullets",
        items: [
          "**Identity.** A globally unique object id. Two blades never share it.",
          "**Owner.** An address, another object (a character, a listing), shared (a marketplace stall), or immutable.",
          "**Type.** `item::Blade`, `land::Plot`, `wearable::Sigil`. The type decides which operations are legal.",
          "**Version.** A number that increments on every accepted change. Your HUD stores it so a stale event cannot rewind the item.",
          "**Capabilities.** `key` makes it an object. `store` allows it to be transferred and wrapped. No `store` means it stays with the address that received it.",
          "**Display.** A content hash for the mesh or image. The bytes can live on a CDN. The hash lives on the object, so a swapped file does not become a different sword.",
        ],
      },
      {
        type: "paragraph",
        text: "Independent objects do not share a row in one giant map. A transfer of your blade and a transfer of someone else’s plot touch different objects, so they can commit on the fast path together. A shared listing is the opposite: two buyers racing one stall is a real conflict, and exactly one fill wins.",
      },
      {
        type: "callout",
        tone: "tip",
        title: "The picture is not the asset",
        text: "Art, metadata, and the marketplace card are views. The asset is the object id plus its owner and version. If the image host is down, you still own the object. If the image changes under the same hash, the client rejects it.",
      },
    ],
  },
  {
    id: "classic-vs-modern",
    title: "Classic token vs modern object",
    blocks: [
      {
        type: "paragraph",
        text: "ERC-721 (and the semi-fungible ERC-1155) proved that a contract can name an owner for token id `N`. Games then spent years routing around the parts that do not match an inventory. A modern NFT keeps the ownership guarantee and drops the global table.",
      },
      {
        type: "table",
        table: {
          headers: ["Trait", "Classic NFT", "Modern NFT"],
          rows: [
            [
              "Record",
              "token id inside one contract",
              "object id, owned on its own",
            ],
            [
              "Owner",
              "an address in a mapping",
              "address, object, shared, or immutable",
            ],
            [
              "Transfer",
              "writes the contract’s shared storage",
              "single-owner moves skip the global lock",
            ],
            [
              "Composing",
              "a token does not own a token",
              "a character object can own a blade",
            ],
            [
              "Marketplace",
              "setApprovalForAll on every token",
              "transfer of the one object you listed",
            ],
            [
              "Royalties",
              "a fee the market can ignore",
              "a cut inside the fill, on the type",
            ],
            [
              "Display",
              "tokenURI the issuer can rewrite",
              "content hash pinned on the object",
            ],
            [
              "Contention",
              "unrelated transfers share one contract",
              "unrelated objects execute in parallel",
            ],
          ],
        },
      },
      {
        type: "callout",
        tone: "warn",
        title: "Approval is the old footgun",
        text: "`setApprovalForAll` lets one market contract move every token you own, forever, until you revoke it. A modern list moves **one** object into **one** listing. Closing the listing does not leave a blanket grant behind.",
      },
    ],
  },
  {
    id: "the-object",
    title: "The fields on the object",
    blocks: [
      {
        type: "paragraph",
        text: "This is the item the store is selling when the card says Iris Blade. Land and wearables use the same shape with a different type name. The comment on `owner` is the whole product.",
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
        text: "The indexer shows the same record to the store and to the game. A client that skips the version will equip a blade the player already sold.",
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
          "**Address owner.** The usual case after a buy. You can transfer it, equip it, or list it.",
          "**Object owner.** The blade is wrapped in a character or held by a listing. The parent has to release it.",
          "**Shared.** The Market Stall pattern. Anyone can attempt the operation; consensus orders the attempts.",
          "**Immutable.** A published display or a frozen lore object. No transfer. No mutation.",
        ],
      },
    ],
  },
  {
    id: "use-the-store",
    title: "Collect one on the store",
    blocks: [
      {
        type: "paragraph",
        text: "The [NFTs page](/nfts) is the store. Eight listings cover the three types you will actually use: land, items, and wearables. Prices are in **OTTE**, the economy unit on the card. Buying assigns that listing to the address currently connected in this browser.",
      },
      {
        type: "steps",
        items: [
          {
            title: "Open the [NFTs store](/nfts) from the left menu.",
            bullets: [
              "Blog sits above NFTs. The store is the page, not a modal.",
            ],
          },
          {
            title: "Connect a wallet.",
            bullets: [
              "Use **Connect Wallet** in the header, or press **Buy** and approve the request.",
              "MetaMask, or any injected wallet found through EIP-6963, is enough.",
              "No wallet opens the MetaMask download page. Rejecting the prompt leaves the listing unowned.",
            ],
          },
          {
            title: "Filter by **Land**, **Item**, or **Wearable** if you already know the slot.",
            bullets: [
              "Harbor Plot, Market Stall, and Mesh Ridge are land.",
              "Iris Blade and Fast Path Pass are items.",
              "Cyan Sigil, Royalties Mark, and Runner Frame are wearables.",
            ],
          },
          {
            title: "Read the card before you buy.",
            bullets: [
              "Category is the type family.",
              "The summary is what the object is allowed to represent.",
              "The price is the fill amount for that one listing.",
            ],
          },
          {
            title: "Press **Buy** on one card.",
            bullets: [
              "The button reads **Buying…** until the address is known.",
              "It then reads **Collected**, and the page names the short address that owns it.",
              "A second click does nothing. One listing, one owner.",
            ],
          },
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "What the button does today",
        text: "Buy on this site assigns the listing to your connected address for the visit. It does not broadcast a chain transaction. The next section is the same action once a node is settling fills.",
      },
    ],
  },
  {
    id: "operations",
    title: "Transfer, equip, and list",
    blocks: [
      {
        type: "paragraph",
        text: "Three operations cover almost every “how do I use this NFT?” question. Each one names the object. None of them grants a contract the right to move the rest of your inventory.",
      },
      {
        type: "subheading",
        text: "Transfer",
      },
      {
        type: "paragraph",
        text: "A transfer is legal when the object has `store` and the current owner is an address you control. The version increments so the previous owner’s client drops it.",
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
        text: "Single-owner transfers take the fast path: certify and commit without waiting behind unrelated plots and blades. That is the path equip and gift should use. See [Parallel Execution for Game Blockchains](/blog/parallel-execution-for-game-blockchains) for why the ids have to be explicit.",
      },
      {
        type: "subheading",
        text: "Equip",
      },
      {
        type: "paragraph",
        text: "Equipping does not copy the NFT into the game. It moves the object under a character object you already own. The dedicated server and the other clients hear the new owner from the indexer and swap the mesh whose hash matches `content_hash`.",
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
        title: "Session key for equip, root key for selling",
        text: "Sign routine equips with a session key so a play session does not prompt on every cosmetic. Withdrawing, transferring away, and listing still ask for the root signer.",
      },
      {
        type: "subheading",
        text: "List",
      },
      {
        type: "paragraph",
        text: "A listing is a **shared** object. It points at the item and names a price. Two buyers can try to fill it; the scheduler commits one and returns a clean error to the other. The creator cut is part of `fill`, so a marketplace cannot skip it.",
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
        text: "Harbor Plot at 120 OTTE, Iris Blade at 48, Fast Path Pass at 9: each card is one `Listing`. Market Stall is the shared booth those listings hang from. Royalties Mark is the wearable that points at a creator who is paid inside the fill, in basis points, not by a second transfer the seller can forget.",
      },
    ],
  },
  {
    id: "in-a-game",
    title: "Use it inside a game",
    blocks: [
      {
        type: "paragraph",
        text: "A modern NFT is useless if a jump waits on it. Keep the frame in Unreal. Keep ownership on the object. The first tutorial on this blog builds that split in UE 5.8; this one is the inventory side of the same loop.",
      },
      {
        type: "table",
        table: {
          headers: ["You do this", "Where it runs"],
          rows: [
            ["Walk the Harbor Plot", "UE 5.8, World Partition"],
            ["Swing the Iris Blade", "Dedicated server, not L1"],
            ["Show the Cyan Sigil", "Client mesh from content hash"],
            ["Buy, gift, equip, list", "Rust object transaction"],
            ["Lose a fill race", "Indexer error, card returns to listed"],
            ["Reload the game", "Inventory rebuilds from object versions"],
          ],
        },
      },
      {
        type: "paragraph",
        text: "Follow [How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy) when you are ready to bind those object events to a pawn. The C++ plugin speaks JSON-RPC and WebSockets. It does not embed a validator.",
      },
      {
        type: "callout",
        tone: "rust",
        title: "One language for the asset",
        text: "The item, the listing, and the fill are Rust. WASM runs the economy contract. The game never compiles that crate. It submits a typed operation and renders the result.",
      },
    ],
  },
  {
    id: "safety",
    title: "What to sign, and what to refuse",
    blocks: [
      {
        type: "paragraph",
        text: "Using an NFT is mostly refusing the wrong signature. The object model removes the worst legacy approval, and a careless payload can still hand the object to someone else.",
      },
      {
        type: "bullets",
        items: [
          "Sign a transfer that names **one object id** and **one recipient**. Refuse a payload that names a collection, a range, or “all”.",
          "Refuse `setApprovalForAll`, unlimited allowances, and any market that asks to move objects you did not list.",
          "Check the type. A wearable signature should not be accepted as a land transfer.",
          "Check the version. If the wallet shows a version older than the indexer, the request is stale.",
          "Equip with a session key. Sell, withdraw, and change the owner address with the root key.",
          "Treat a shared listing as a race. If your fill loses, the object was never yours. Do not retry with a higher allowance to “make it stick.”",
          "Confirm the content hash before you render an unknown mesh. A missing hash is a placeholder, not a crash, and not a free item.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "The store will not ask twice",
        text: "A collected card stays collected for the visit. A site that asks you to approve a second contract, a different chain, or a seed phrase after Buy is not this store.",
      },
    ],
  },
  {
    id: "checklist",
    title: "Checklist",
    blocks: [
      {
        type: "paragraph",
        text: "You understand modern NFTs well enough to use them when each line below is true in your own words.",
      },
      {
        type: "table",
        table: {
          headers: ["Check", "You can say"],
          rows: [
            [
              "Definition",
              "An NFT is an object with id, owner, type, version, capabilities",
            ],
            [
              "Display",
              "The image is a content hash, not the asset",
            ],
            [
              "Store",
              "Buy on /nfts assigns one listing to the connected address",
            ],
            [
              "Fast path",
              "A single-owner transfer does not wait on unrelated objects",
            ],
            [
              "Equip",
              "The character object becomes the owner; the mesh follows the hash",
            ],
            [
              "List",
              "A shared Listing holds one item, one price, one royalty",
            ],
            [
              "Race",
              "Two fills, one listing: one owner, one clean error",
            ],
            [
              "Signature",
              "One object, one recipient, no blanket approval",
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
          "[How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy) — bind these objects to a pawn without putting combat on the chain.",
          "[Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies) — why assets are objects in the first place.",
          "[Parallel Execution for Game Blockchains](/blog/parallel-execution-for-game-blockchains) — why two inventories do not block each other.",
          "[Comparing Aptos Block-STM with Sui](/blog/comparing-aptos-block-stm-with-sui) — discovering a conflict after the fact, versus encoding it in the owner.",
        ],
      },
    ],
  },
];
