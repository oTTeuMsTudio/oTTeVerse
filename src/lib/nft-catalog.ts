export type NftCategory = "Land" | "Item" | "Wearable";

export type NftRarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export type NftGame = {
  id: string;
  name: string;
  summary: string;
  color: string;
};

export type NftListing = {
  id: string;
  name: string;
  gameId: string;
  category: NftCategory;
  rarity: NftRarity;
  price: number;
  lastSale: number;
  supply: number;
  summary: string;
};

export const nftCurrency = "OTTE";

export const nftCategories: NftCategory[] = ["Land", "Item", "Wearable"];

export const nftRarities: NftRarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
];

export const rarityRank: Record<NftRarity, number> = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
};

export const nftGames: NftGame[] = [
  {
    id: "harbor-exchange",
    name: "Harbor Exchange",
    summary: "Waterfront parcels, stalls, and the objects that trade there.",
    color: "#00a8e8",
  },
  {
    id: "ridge-runners",
    name: "Ridge Runners",
    summary: "Frames, mounts, and passes for the ridge trails.",
    color: "#34d399",
  },
  {
    id: "sigil-keep",
    name: "Sigil Keep",
    summary: "Wearable marks, seals, and the creator royalty badge.",
    color: "#f0c24b",
  },
  {
    id: "iris-armory",
    name: "Iris Armory",
    summary: "Cosmetic weapons and the passes that open the armory floor.",
    color: "#fb7185",
  },
  {
    id: "mesh-frontier",
    name: "Mesh Frontier",
    summary: "Terrain deeds above the ground the engine streams in.",
    color: "#2dd4bf",
  },
  {
    id: "fast-path",
    name: "Fast Path Arena",
    summary: "Access objects for equip and transfer when nothing else contends.",
    color: "#c084fc",
  },
];

export const nftListings: NftListing[] = [
  {
    id: "harbor-plot",
    name: "Harbor Plot",
    gameId: "harbor-exchange",
    category: "Land",
    rarity: "Rare",
    price: 120,
    lastSale: 104,
    supply: 40,
    summary:
      "A waterfront parcel. The deed is one land object; the docks you walk on stay in the engine.",
  },
  {
    id: "iris-blade",
    name: "Iris Blade",
    gameId: "iris-armory",
    category: "Item",
    rarity: "Rare",
    price: 48,
    lastSale: 41,
    supply: 100,
    summary:
      "A cosmetic sword. Combat stays off-chain. The object is the right to show this mesh.",
  },
  {
    id: "cyan-sigil",
    name: "Cyan Sigil",
    gameId: "sigil-keep",
    category: "Wearable",
    rarity: "Uncommon",
    price: 18,
    lastSale: 15,
    supply: 300,
    summary:
      "A shoulder mark bound to the owner address. Other clients read it from the indexer.",
  },
  {
    id: "market-stall",
    name: "Market Stall",
    gameId: "harbor-exchange",
    category: "Land",
    rarity: "Epic",
    price: 240,
    lastSale: 210,
    supply: 12,
    summary:
      "A booth on the harbor exchange. Listings that settle here are shared objects.",
  },
  {
    id: "mesh-ridge",
    name: "Mesh Ridge",
    gameId: "mesh-frontier",
    category: "Land",
    rarity: "Rare",
    price: 86,
    lastSale: 79,
    supply: 50,
    summary:
      "A terrain claim above the ridge. World Partition streams the ground; the deed does not.",
  },
  {
    id: "royalties-mark",
    name: "Royalties Mark",
    gameId: "sigil-keep",
    category: "Wearable",
    rarity: "Common",
    price: 12,
    lastSale: 10,
    supply: 500,
    summary:
      "A creator badge. Secondary sales pay the creator inside the fill, not as a side tip.",
  },
  {
    id: "runner-frame",
    name: "Runner Frame",
    gameId: "ridge-runners",
    category: "Wearable",
    rarity: "Uncommon",
    price: 36,
    lastSale: 30,
    supply: 150,
    summary:
      "A character frame for the third-person pawn. Equip moves the object onto your character.",
  },
  {
    id: "fast-path-pass",
    name: "Fast Path Pass",
    gameId: "fast-path",
    category: "Item",
    rarity: "Common",
    price: 9,
    lastSale: 7,
    supply: 800,
    summary:
      "An access object for sub-second equip and transfer when nothing else contends.",
  },
  {
    id: "dock-lantern",
    name: "Dock Lantern",
    gameId: "harbor-exchange",
    category: "Item",
    rarity: "Common",
    price: 14,
    lastSale: 11,
    supply: 200,
    summary:
      "A quay light. The mesh stays in the client. The object is the right to hang it on a plot.",
  },
  {
    id: "tide-crate",
    name: "Tide Crate",
    gameId: "harbor-exchange",
    category: "Item",
    rarity: "Uncommon",
    price: 32,
    lastSale: 27,
    supply: 80,
    summary:
      "A trade crate that opens on a stall. What is inside resolves in the engine.",
  },
  {
    id: "quay-charter",
    name: "Quay Charter",
    gameId: "harbor-exchange",
    category: "Item",
    rarity: "Rare",
    price: 55,
    lastSale: 48,
    supply: 60,
    summary:
      "A berth charter. Holding it lets the pawn dock at Harbor Exchange.",
  },
  {
    id: "trail-band",
    name: "Trail Band",
    gameId: "ridge-runners",
    category: "Wearable",
    rarity: "Common",
    price: 11,
    lastSale: 9,
    supply: 400,
    summary:
      "A wrist band for ridge runs. Other clients read the color from the indexer.",
  },
  {
    id: "ridge-sprint",
    name: "Ridge Sprint",
    gameId: "ridge-runners",
    category: "Item",
    rarity: "Rare",
    price: 64,
    lastSale: 58,
    supply: 70,
    summary:
      "A sprint mount for the ridge trails. The pawn rides it. The object is the mount.",
  },
  {
    id: "cliff-token",
    name: "Cliff Token",
    gameId: "ridge-runners",
    category: "Item",
    rarity: "Uncommon",
    price: 22,
    lastSale: 18,
    supply: 120,
    summary: "Entry for the cliff time trial. The timer stays in the match.",
  },
  {
    id: "scout-pin",
    name: "Scout Pin",
    gameId: "ridge-runners",
    category: "Wearable",
    rarity: "Common",
    price: 16,
    lastSale: 12,
    supply: 250,
    summary:
      "A scout pin on the pawn. Movement stays in the engine. The object is the pin.",
  },
  {
    id: "keeper-cloak",
    name: "Keeper Cloak",
    gameId: "sigil-keep",
    category: "Wearable",
    rarity: "Rare",
    price: 74,
    lastSale: 66,
    supply: 40,
    summary:
      "A cloak for the keep. Equip moves the object onto your character.",
  },
  {
    id: "oath-seal",
    name: "Oath Seal",
    gameId: "sigil-keep",
    category: "Item",
    rarity: "Uncommon",
    price: 28,
    lastSale: 24,
    supply: 90,
    summary:
      "A seal that marks a creator listing. The royalty stays inside the fill.",
  },
  {
    id: "vault-key",
    name: "Vault Key",
    gameId: "sigil-keep",
    category: "Item",
    rarity: "Epic",
    price: 96,
    lastSale: 88,
    supply: 25,
    summary:
      "A key to the keep vault. Access is the object, not a side list.",
  },
  {
    id: "glass-edge",
    name: "Glass Edge",
    gameId: "iris-armory",
    category: "Item",
    rarity: "Epic",
    price: 110,
    lastSale: 96,
    supply: 30,
    summary: "A glass edge cosmetic. Combat stays off-chain.",
  },
  {
    id: "practice-hilt",
    name: "Practice Hilt",
    gameId: "iris-armory",
    category: "Item",
    rarity: "Common",
    price: 8,
    lastSale: 6,
    supply: 600,
    summary: "A training hilt. The cheapest armory object.",
  },
  {
    id: "duelist-wrap",
    name: "Duelist Wrap",
    gameId: "iris-armory",
    category: "Wearable",
    rarity: "Uncommon",
    price: 21,
    lastSale: 17,
    supply: 180,
    summary: "A wrap for the sword arm. The grip stays on the mesh.",
  },
  {
    id: "armory-pass",
    name: "Armory Pass",
    gameId: "iris-armory",
    category: "Item",
    rarity: "Rare",
    price: 40,
    lastSale: 33,
    supply: 80,
    summary: "Floor access at Iris Armory. The door reads this object.",
  },
  {
    id: "basin-claim",
    name: "Basin Claim",
    gameId: "mesh-frontier",
    category: "Land",
    rarity: "Epic",
    price: 168,
    lastSale: 150,
    supply: 20,
    summary:
      "A basin deed. World Partition streams the ground. The claim does not.",
  },
  {
    id: "survey-pin",
    name: "Survey Pin",
    gameId: "mesh-frontier",
    category: "Item",
    rarity: "Common",
    price: 16,
    lastSale: 13,
    supply: 220,
    summary: "A survey marker. Planting it does not move the terrain.",
  },
  {
    id: "ridge-camp",
    name: "Ridge Camp",
    gameId: "mesh-frontier",
    category: "Land",
    rarity: "Uncommon",
    price: 64,
    lastSale: 55,
    supply: 35,
    summary: "A camp plot on the ridge line. The tent is the mesh. The plot is the deed.",
  },
  {
    id: "cartographer",
    name: "Cartographer",
    gameId: "mesh-frontier",
    category: "Wearable",
    rarity: "Rare",
    price: 42,
    lastSale: 36,
    supply: 75,
    summary: "A cartographer coat. The map stays in the client.",
  },
  {
    id: "heat-lane",
    name: "Heat Lane",
    gameId: "fast-path",
    category: "Item",
    rarity: "Uncommon",
    price: 27,
    lastSale: 22,
    supply: 140,
    summary: "A lane pass for the heated bracket. The match reads it at the gate.",
  },
  {
    id: "podium-frame",
    name: "Podium Frame",
    gameId: "fast-path",
    category: "Wearable",
    rarity: "Rare",
    price: 58,
    lastSale: 49,
    supply: 45,
    summary: "A podium frame worn after a clean finish.",
  },
  {
    id: "sprint-core",
    name: "Sprint Core",
    gameId: "fast-path",
    category: "Item",
    rarity: "Common",
    price: 19,
    lastSale: 15,
    supply: 260,
    summary: "A core shown on the pawn during a sprint.",
  },
  {
    id: "champion-mount",
    name: "Champion Mount",
    gameId: "fast-path",
    category: "Item",
    rarity: "Legendary",
    price: 180,
    lastSale: 160,
    supply: 8,
    summary: "The arena champion mount. One object, one owner.",
  },
];

export const gameById = new Map(nftGames.map((game) => [game.id, game]));

const numberFormat = new Intl.NumberFormat("en-US");

export function formatOtte(value: number) {
  return `${numberFormat.format(value)} ${nftCurrency}`;
}

export function catalogStats(listings: readonly NftListing[]) {
  let floor = listings[0]?.price ?? 0;
  let listedValue = 0;
  let editions = 0;
  for (const item of listings) {
    if (item.price < floor) {
      floor = item.price;
    }
    listedValue += item.price;
    editions += item.supply;
  }
  return {
    items: listings.length,
    floor,
    listedValue,
    editions,
  };
}
