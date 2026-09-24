import type { DefinitionSection } from "@/lib/definition";

export const lead = [
  "The Web3 gaming landscape has undergone a fundamental reset. The loop moved from hyper-speculative **Play-to-Earn** toward a player-centric **Play-and-Own** framework. After **93%** of early-generation Web3 games collapsed under out-of-control token inflation, the emphasis shifted to gameplay-first development. NFTs now support sovereign digital asset ownership, without forcing blockchain friction onto casual players.",
];

export const sections: DefinitionSection[] = [
  {
    id: "what-changed",
    title: "What changed",
    blocks: [
      {
        type: "toc",
        items: [
          { href: "#what-changed", label: "What changed" },
          { href: "#why-p2e-broke", label: "Why Play-to-Earn broke" },
          { href: "#play-and-own", label: "What Play-and-Own asks of a game" },
          { href: "#trends", label: "Three trends shaping the reset" },
          { href: "#web25", label: "Frictionless Web2.5 onboarding" },
          { href: "#mobile", label: "Mobile-first expansion" },
          { href: "#interop", label: "Interoperable universes" },
          { href: "#what-to-ship", label: "What a gameplay-first studio ships" },
        ],
      },
      {
        type: "paragraph",
        text: "Play-to-Earn treated the token as the reason to open the game. Play-and-Own treats the match as the reason, and the chain as the record of what the player keeps. A person who only wants to play can finish a session. A person who wants the sword, the land, or the skin can still hold it as their own.",
      },
      {
        type: "table",
        table: {
          headers: ["Question", "Play-to-Earn", "Play-and-Own"],
          rows: [
            [
              "Why you open the game",
              "To extract a token you can sell",
              "To play, and to keep what you earn",
            ],
            [
              "What the NFT is for",
              "A chip in a yield loop",
              "Proof that one sword, skin, or plot is yours",
            ],
            [
              "Who touches a wallet",
              "Everyone, on the first screen",
              "The player who moves or sells an asset",
            ],
            [
              "What ends the loop",
              "More tokens printed than the game can absorb",
              "A game people stop wanting to play",
            ],
          ],
        },
      },
    ],
  },
  {
    id: "why-p2e-broke",
    title: "Why Play-to-Earn broke",
    blocks: [
      {
        type: "paragraph",
        text: "The first generation paid players to show up. Win a match, clear a quest, or simply log in, and the game minted a token. That works only while new money arrives faster than players cash out. The reward was the product. The match was the wrapper.",
      },
      {
        type: "paragraph",
        text: "Token inflation is what happens when the printer outruns the game. Every reward adds supply. A real economy needs sinks that remove supply: crafting that burns materials, fees that do not get reminted, cosmetics people buy because they want the look. Early titles minted faster than those sinks could absorb. The price fell. Players who had joined for the price left. The next cohort was smaller, so the price fell again.",
      },
      {
        type: "bullets",
        items: [
          "**Rewards outran play.** A session paid out even when it was dull, so the dull session stayed in the economy.",
          "**Selling was the skill.** The profitable action was to exit the token, so the most committed users were the ones removing demand.",
          "**The treasury depended on newcomers.** The chart needed a larger wave of buyers than the wave that was cashing out.",
          "**The game could not stand alone.** On a day the token was flat, there was no remaining reason to launch it.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "93% did not survive that loop",
        text: "93% of early-generation Web3 games collapsed under that inflation. A new slogan on the same reward printer produces the same ending. If the token must rise for people to keep playing, the design is still Play-to-Earn.",
      },
    ],
  },
  {
    id: "play-and-own",
    title: "What Play-and-Own asks of a game",
    blocks: [
      {
        type: "paragraph",
        text: "Play-and-Own starts from the session a player would still want if the marketplace were closed for a week. Combat, exploration, building, and social play have to hold up on their own. Ownership is the second promise: the sword, the plot, and the wearable are the player's, recorded so a private studio database is not the only copy of that fact.",
      },
      {
        type: "paragraph",
        text: "That is a narrow job for the NFT. It identifies one asset, names the owner, and lets that owner transfer it. It does not have to be the prize for every click. Sovereign ownership means the player can hold the asset, move it, or sell it. It does not mean every casual player must learn a seed phrase before the tutorial.",
      },
      {
        type: "bullets",
        items: [
          "**Gameplay stays off the chain.** Jumping, shooting, and looting resolve in the game at frame rate. The chain is the ledger of record for items that matter after the match.",
          "**Friction stays off casual players.** A wallet prompt belongs on the action that changes ownership, such as a gift, a listing, or an equip that moves the object.",
          "**The asset is specific.** One blade has one id, one owner, and a version that goes up when it changes. A picture on a card is the display. The object is the asset.",
          "**The reward is the thing, when there is a reward.** A skin you can wear next week beats a token whose only use is to be sold tonight.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Same rule this site already uses",
        text: "The [NFTs store](/nfts) lists land, items, and wearables a player can hold. [The Future of NFTs — Market Insights & Use Cases](/blog/what-are-modern-nfts-and-how-to-use-them) walks through collecting one, giving it away, equipping it, and listing it. [How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy) keeps the fight in Unreal and the ownership record in Rust.",
      },
    ],
  },
  {
    id: "trends",
    title: "Three trends shaping the reset",
    blocks: [
      {
        type: "paragraph",
        text: "Once studios stopped designing around a rising token, three product facts took over. Players will not install a wallet before they know the game is fun. Most of them are on a phone. And an item they truly own should still mean something if they walk into another world.",
      },
      {
        type: "table",
        table: {
          headers: ["Trend", "What players see", "What the chain does"],
          rows: [
            [
              "Web2.5 onboarding",
              "A social login and a normal first session",
              "Accounts and transfers happen behind that login",
            ],
            [
              "Mobile-first play",
              "The phone is the main screen",
              "The asset still has one owner when the session is short",
            ],
            [
              "Interoperable universes",
              "A weapon or skin shows up in another game",
              "The NFT travels as a portable asset across chains",
            ],
          ],
        },
      },
    ],
  },
  {
    id: "web25",
    title: "Frictionless Web2.5 onboarding",
    blocks: [
      {
        type: "paragraph",
        text: "Web2.5 is a normal game with a chain behind it. The player gets a session the way they already get one everywhere else: a social login, an email, or an account they already have. The blockchain backend stays hidden. Top titles stopped putting a browser extension and a seed phrase on the first screen.",
      },
      {
        type: "paragraph",
        text: "Products such as **Immutable Passport** are the abstraction layer that makes that possible. The passport creates the wallet from the login, holds the flow a new player should not have to operate by hand, and submits the transaction without turning the match into a signing ceremony. The player sees “sign in” and, later, “this skin is yours.”",
      },
      {
        type: "bullets",
        items: [
          "**Hide the backend.** Matchmaking, movement, and inventory UI talk to the game. The chain is a service the game calls when ownership changes.",
          "**Start from an account people already have.** A social login is a door. A twelve-word phrase is a wall in front of someone who came to play.",
          "**Show the chain when it matters.** Transfer, sale, and a move between games are the moments a clear signature protects the player. Opening a chest is not one of those moments.",
          "**Keep the asset recoverable.** Invisible signing still has to leave the player with a real owner record they can export, or the word “own” is only a login on somebody else’s server.",
        ],
      },
      {
        type: "callout",
        tone: "tip",
        title: "Invisible is for the session, not for the asset",
        text: "Hiding the wallet during play is the point of Web2.5. Hiding the fact of ownership is a return to a private database. The player who later wants the sword in another game needs an object id and an owner, not only a row in the studio’s account table.",
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile-first expansion",
    blocks: [
      {
        type: "paragraph",
        text: "Mobile devices have passed the PC and become the dominant portal for Web3 gaming. They make up more than half of the network footprint. A design that assumes a desktop extension, a large window, and a long session is aimed at the smaller half.",
      },
      {
        type: "paragraph",
        text: "Phone sessions are shorter. The first minute decides whether the player stays. There is no room for a wallet install between the store page and the first match. The asset still has to be legible on a small screen: one name, one owner, one price if it is for sale, and a picture that reads at a thumb’s width.",
      },
      {
        type: "bullets",
        items: [
          "**The install is the onboarding.** If the chain requires a second app before the first match, most of the footprint never arrives.",
          "**The session can end in minutes.** Ownership updates that matter should survive a player who backgrounds the game.",
          "**The catalog is a phone catalog.** Cards, filters, and a buy action have to work with one hand. A table of hashes does not.",
          "**PC remains a home for deep sessions.** Builders, simulators, and long matches still live there. The majority portal is still the phone, so the account and the asset have to meet the player on that screen.",
        ],
      },
    ],
  },
  {
    id: "interop",
    title: "Interoperable universes",
    blocks: [
      {
        type: "paragraph",
        text: "A gaming NFT is increasingly a portable asset, carried by cross-chain technology, rather than a variable locked inside one studio’s ecosystem. A weapon or a cosmetic skin earned in one game can unlock parallel utility, or a visual transformation, inside another.",
      },
      {
        type: "paragraph",
        text: "Portable does not mean every game shares one combat system. The first game can mint a blade and record its owner. The second game can recognize that object and decide, in its own rules, what the blade does there: a matching skin on a character, a material in a crafting bench, or a key that opens a door. The chain carries identity and ownership. Each title still writes its own gameplay.",
      },
      {
        type: "subheading",
        text: "What has to travel with the asset",
      },
      {
        type: "bullets",
        items: [
          "**An id both games can name.** If the second game cannot point at the same object, the skin is a screenshot, not an asset.",
          "**An owner the second game trusts.** A bridge or a cross-chain read has to show the same person still holds it, including after a sale.",
          "**A display fingerprint.** The mesh or image can live on the open web. A hash on the object tells the second game the file was not swapped.",
          "**A type the second game understands.** `weapon`, `wearable`, or `land` is a contract between studios. A private enum in one codebase does not unlock anything next door.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Utility is a promise the second game makes",
        text: "Ownership can move even when the second game never ships. A marketing line that says the sword will grant stats in a future title is only a promise. Ship the recognition in the second game, or say plainly that the asset is a collectible until that recognition exists.",
      },
    ],
  },
  {
    id: "what-to-ship",
    title: "What a gameplay-first studio ships",
    blocks: [
      {
        type: "paragraph",
        text: "The reset is a build order. Make the game someone will play on an ordinary Tuesday. Then decide which objects are worth owning. Then hide the chain from everyone who is only there to play, and leave a clean door for everyone who wants to take an asset with them.",
      },
      {
        type: "steps",
        items: [
          {
            title: "**Ship the session before the economy.**",
            bullets: [
              "If the match, the world, or the social loop fails with the marketplace closed, ownership will not repair it.",
            ],
          },
          {
            title: "**Mint objects players already understand.**",
            bullets: [
              "A blade, a plot, a jacket. One id, one owner, a version, and a picture. The [NFTs store](/nfts) is that catalog: Land, Item, and Wearable, priced in OTTE.",
            ],
          },
          {
            title: "**Put the wallet on the ownership action.**",
            bullets: [
              "Sign in like a normal game. Ask for a signature when the object moves. The UE 5.8 tutorial keeps combat in the engine and the record on the chain.",
            ],
          },
          {
            title: "**Write the asset so another game can read it.**",
            bullets: [
              "Stable id, owner, type, and a fingerprint of the art. That is the minimum a second title needs before a skin can change a character there.",
            ],
          },
          {
            title: "**Refuse a reward token that must go up.**",
            bullets: [
              "Sinks, cosmetics, and items people want are economies. A printer that pays players to stay is the loop that already collapsed.",
            ],
          },
        ],
      },
      {
        type: "subheading",
        text: "Read next on this blog",
      },
      {
        type: "bullets",
        items: [
          "[The Future of NFTs — Market Insights & Use Cases](/blog/what-are-modern-nfts-and-how-to-use-them) — what a modern game NFT is, and how to collect, gift, equip, and list one.",
          "[How to Build a Game in UE 5.8 with a Modern Rust Blockchain for Digital Economy](/blog/how-to-build-a-game-in-ue-5-8-with-modern-rust-blockchain-for-digital-economy) — Unreal runs the game, Rust records who owns the sword, the land, and the listing.",
          "[Modern Rust Blockchain for Games and Digital Economies](/blog/modern-rust-blockchain-for-games-and-digital-economies) — gameplay off the hot path, ownership and value on the ledger.",
          "[Parallel Execution for Game Blockchains](/blog/parallel-execution-for-game-blockchains) — why two players can move two different items at the same time.",
        ],
      },
    ],
  },
];
