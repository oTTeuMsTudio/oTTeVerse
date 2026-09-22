export type NftCategory = "Land" | "Item" | "Wearable";

export type NftListing = {
  id: string;
  name: string;
  category: NftCategory;
  price: number;
  summary: string;
};

export const nftCurrency = "OTTE";

export const nftCategories: Array<NftCategory | "All"> = [
  "All",
  "Land",
  "Item",
  "Wearable",
];

export const nftListings: NftListing[] = [
  {
    id: "harbor-plot",
    name: "Harbor Plot",
    category: "Land",
    price: 120,
    summary:
      "A waterfront parcel. The deed is one land object; the docks you walk on stay in the engine.",
  },
  {
    id: "iris-blade",
    name: "Iris Blade",
    category: "Item",
    price: 48,
    summary:
      "A cosmetic sword. Combat stays off-chain. The object is the right to show this mesh.",
  },
  {
    id: "cyan-sigil",
    name: "Cyan Sigil",
    category: "Wearable",
    price: 18,
    summary:
      "A shoulder mark bound to the owner address. Other clients read it from the indexer.",
  },
  {
    id: "market-stall",
    name: "Market Stall",
    category: "Land",
    price: 240,
    summary:
      "A booth on the harbor exchange. Listings that settle here are shared objects.",
  },
  {
    id: "mesh-ridge",
    name: "Mesh Ridge",
    category: "Land",
    price: 86,
    summary:
      "A terrain claim above the ridge. World Partition streams the ground; the deed does not.",
  },
  {
    id: "royalties-mark",
    name: "Royalties Mark",
    category: "Wearable",
    price: 12,
    summary:
      "A creator badge. Secondary sales pay the creator inside the fill, not as a side tip.",
  },
  {
    id: "runner-frame",
    name: "Runner Frame",
    category: "Wearable",
    price: 36,
    summary:
      "A character frame for the third-person pawn. Equip moves the object onto your character.",
  },
  {
    id: "fast-path-pass",
    name: "Fast Path Pass",
    category: "Item",
    price: 9,
    summary:
      "An access object for sub-second equip and transfer when nothing else contends.",
  },
];
