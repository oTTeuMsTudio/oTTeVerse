"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { GameBanner, GameMark, NftArtwork } from "@/components/nft-artwork";
import {
  catalogStats,
  formatOtte,
  gameById,
  nftCategories,
  nftCurrency,
  nftGames,
  nftListings,
  nftRarities,
  rarityRank,
  type NftCategory,
  type NftListing,
  type NftRarity,
} from "@/lib/nft-catalog";
import {
  discoverInjectedProviders,
  getAccounts,
  isUserRejected,
  pickWalletProvider,
  requestAccounts,
  shortenAddress,
  type EIP1193Provider,
} from "@/lib/wallet";

const INSTALL_URL = "https://metamask.io/download";

const priceBands = [
  { id: "any", label: "Any price" },
  { id: "under-20", label: "Under 20" },
  { id: "20-80", label: "20 – 79" },
  { id: "80-150", label: "80 – 150" },
  { id: "over-150", label: "Over 150" },
] as const;

const statuses = [
  { id: "all", label: "All" },
  { id: "available", label: "Available" },
  { id: "collected", label: "Collected" },
] as const;

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name" },
  { id: "rarity", label: "Rarity: high to low" },
] as const;

type PriceBand = (typeof priceBands)[number]["id"];
type StatusFilter = (typeof statuses)[number]["id"];
type SortKey = (typeof sorts)[number]["id"];
type ViewMode = "cards" | "table";

const rarityClass: Record<NftRarity, string> = {
  Common: "text-[#d5e2ee]",
  Uncommon: "text-[#6ee7b7]",
  Rare: "text-[#7dd3fc]",
  Epic: "text-[#d8b4fe]",
  Legendary: "text-[#fcd34d]",
};

const fieldClass =
  "h-11 rounded-xl border border-[#1f2937] bg-[#0d1721] px-3 text-sm text-white outline-none focus:border-cyan";

export function NftStore() {
  const [account, setAccount] = useState<string | null>(null);
  const [owned, setOwned] = useState<ReadonlySet<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const [gameId, setGameId] = useState<string | null>(null);
  const [category, setCategory] = useState<NftCategory | "All">("All");
  const [rarities, setRarities] = useState<NftRarity[]>([]);
  const [price, setPrice] = useState<PriceBand>("any");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [view, setView] = useState<ViewMode>("cards");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const providerRef = useRef<EIP1193Provider | null>(null);
  const attachRef = useRef<(provider: EIP1193Provider) => void>(() => {});
  const busyRef = useRef(false);

  useEffect(() => {
    const onAccountsChanged = (accounts: unknown) => {
      if (!Array.isArray(accounts) || typeof accounts[0] !== "string") {
        setAccount(null);
        return;
      }
      setAccount(accounts[0]);
    };

    const attach = (provider: EIP1193Provider) => {
      const previous = providerRef.current;
      if (previous && previous !== provider) {
        previous.removeListener?.("accountsChanged", onAccountsChanged);
      }
      providerRef.current = provider;
      provider.on?.("accountsChanged", onAccountsChanged);
    };

    attachRef.current = attach;

    let cancelled = false;

    void (async () => {
      const providers = await discoverInjectedProviders();
      if (cancelled) {
        return;
      }
      const provider = pickWalletProvider(providers);
      if (!provider) {
        return;
      }
      attach(provider);
      try {
        const existing = await getAccounts(provider);
        if (!cancelled && existing) {
          setAccount(existing);
        }
      } catch {
        // The Buy button can request accounts if restore fails.
      }
    })();

    return () => {
      cancelled = true;
      providerRef.current?.removeListener?.(
        "accountsChanged",
        onAccountsChanged,
      );
    };
  }, []);

  async function ensureAccount() {
    const providers = await discoverInjectedProviders();
    const provider = providerRef.current ?? pickWalletProvider(providers);
    if (!provider) {
      window.open(INSTALL_URL, "_blank", "noopener,noreferrer");
      throw new Error("Install MetaMask to collect this NFT");
    }
    attachRef.current(provider);
    const existing = await getAccounts(provider);
    if (existing) {
      setAccount(existing);
      return existing;
    }
    const next = await requestAccounts(provider);
    setAccount(next);
    return next;
  }

  async function buy(item: NftListing) {
    if (owned.has(item.id) || busyRef.current) {
      return;
    }
    busyRef.current = true;
    setBusyId(item.id);
    setNotice(null);
    try {
      const address = await ensureAccount();
      setOwned((current) => {
        if (current.has(item.id)) {
          return current;
        }
        const next = new Set(current);
        next.add(item.id);
        return next;
      });
      setNotice(`${item.name} now belongs to ${shortenAddress(address)}.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not collect this NFT";
      setNotice(isUserRejected(error) ? "Connection rejected" : message);
    } finally {
      busyRef.current = false;
      setBusyId(null);
    }
  }

  const needle = query.trim().toLowerCase();
  const scoped =
    gameId === null
      ? nftListings
      : nftListings.filter((item) => item.gameId === gameId);
  const stats = catalogStats(scoped);
  const selectedGame = gameId === null ? undefined : gameById.get(gameId);

  const visible = scoped.filter((item) => {
    if (category !== "All" && item.category !== category) {
      return false;
    }
    if (rarities.length > 0 && !rarities.includes(item.rarity)) {
      return false;
    }
    if (!matchesPrice(item.price, price)) {
      return false;
    }
    if (status === "available" && owned.has(item.id)) {
      return false;
    }
    if (status === "collected" && !owned.has(item.id)) {
      return false;
    }
    if (needle.length === 0) {
      return true;
    }
    const game = gameById.get(item.gameId);
    const haystack =
      `${item.name} ${item.category} ${item.rarity} ${item.summary} ${game?.name ?? ""}`.toLowerCase();
    return haystack.includes(needle);
  });

  const sorted =
    sort === "featured" ? visible : visible.toSorted(compareListings(sort));

  const activeFilters =
    (gameId === null ? 0 : 1) +
    (category === "All" ? 0 : 1) +
    rarities.length +
    (price === "any" ? 0 : 1) +
    (status === "all" ? 0 : 1);

  function clearFilters() {
    setQuery("");
    setGameId(null);
    setCategory("All");
    setRarities([]);
    setPrice("any");
    setStatus("all");
  }

  function openGame(id: string) {
    setGameId((current) => (current === id ? null : id));
  }

  return (
    <div className="mt-8 [color-scheme:dark]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {selectedGame ? selectedGame.name : "All games"}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#b7c6d6]">
            {selectedGame
              ? selectedGame.summary
              : `${nftGames.length} games. ${nftListings.length} listings. Prices in ${nftCurrency}.`}
          </p>
        </div>
        <p className="text-sm text-[#b7c6d6]">
          {account
            ? `Collecting as ${shortenAddress(account)}.`
            : "Connect Wallet in the header, or press Buy and the page will ask for it."}
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-[#1f2937] bg-[#1f2937] sm:grid-cols-4">
        <Stat label="Floor" value={formatOtte(stats.floor)} />
        <Stat label="NFTs" value={String(stats.items)} />
        <Stat label="Listed value" value={formatOtte(stats.listedValue)} />
        <Stat label="Editions" value={stats.editions.toLocaleString("en-US")} />
      </dl>

      <div
        role="group"
        aria-label="Games"
        className="mt-5 flex gap-3 overflow-x-auto pb-1"
      >
        {nftGames.map((game) => {
          const gameListings = nftListings.filter(
            (item) => item.gameId === game.id,
          );
          const gameStats = catalogStats(gameListings);
          const selected = gameId === game.id;
          return (
            <button
              key={game.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                openGame(game.id);
              }}
              className={`w-[210px] shrink-0 overflow-hidden rounded-xl border bg-[#0d1721] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${
                selected
                  ? "border-cyan ring-2 ring-cyan"
                  : "border-[#1f2937] hover:border-[#3d5168]"
              }`}
            >
              <div className="relative h-16">
                <GameBanner gameId={game.id} />
                <div className="absolute -bottom-4 left-3 size-10 overflow-hidden rounded-lg border-2 border-[#0d1721]">
                  <GameMark gameId={game.id} />
                </div>
              </div>
              <div className="px-3 pt-6 pb-3">
                <p className="truncate text-sm font-semibold">{game.name}</p>
                <p className="mt-2 flex items-center justify-between text-xs text-[#b7c6d6]">
                  <span>Floor</span>
                  <span className="font-semibold text-white tabular-nums">
                    {formatOtte(gameStats.floor)}
                  </span>
                </p>
                <p className="mt-1 flex items-center justify-between text-xs text-[#b7c6d6]">
                  <span>NFTs</span>
                  <span className="tabular-nums text-white">
                    {gameStats.items}
                  </span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Search game NFTs</span>
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Search items, games, or rarities"
            autoComplete="off"
            className={`${fieldClass} w-full px-4`}
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <label>
            <span className="sr-only">Sort</span>
            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortKey);
              }}
              className={fieldClass}
            >
              {sorts.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
          <div role="group" aria-label="Layout" className="flex">
            <ViewButton
              pressed={view === "cards"}
              onClick={() => {
                setView("cards");
              }}
              position="left"
            >
              Cards
            </ViewButton>
            <ViewButton
              pressed={view === "table"}
              onClick={() => {
                setView("table");
              }}
              position="right"
            >
              Table
            </ViewButton>
          </div>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="nft-filters"
            onClick={() => {
              setFiltersOpen((open) => !open);
            }}
            className="h-11 rounded-xl border border-[#1f2937] bg-[#0d1721] px-3 text-sm font-semibold text-white lg:hidden"
          >
            Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
        </div>
      </div>

      <div
        role="group"
        aria-label="Categories"
        className="mt-3 flex gap-2 overflow-x-auto pb-1"
      >
        <CategoryPill
          label="All"
          selected={category === "All"}
          onClick={() => {
            setCategory("All");
          }}
        />
        {nftCategories.map((entry) => (
          <CategoryPill
            key={entry}
            label={entry}
            selected={category === entry}
            onClick={() => {
              setCategory(entry);
            }}
          />
        ))}
      </div>

      <div className="mt-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-6">
        <aside
          id="nft-filters"
          className={`rounded-xl border border-[#1f2937] bg-[#0d1721] p-4 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto ${
            filtersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <FilterGroup title="Game">
            <RadioRow
              name="nft-game"
              label="All games"
              checked={gameId === null}
              onChange={() => {
                setGameId(null);
              }}
            />
            {nftGames.map((game) => (
              <RadioRow
                key={game.id}
                name="nft-game"
                label={game.name}
                checked={gameId === game.id}
                onChange={() => {
                  setGameId(game.id);
                }}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Rarity">
            {nftRarities.map((entry) => (
              <label
                key={entry}
                className="flex items-center gap-2 text-sm text-[#d5e2ee]"
              >
                <input
                  type="checkbox"
                  checked={rarities.includes(entry)}
                  onChange={() => {
                    setRarities((current) =>
                      current.includes(entry)
                        ? current.filter((value) => value !== entry)
                        : [...current, entry],
                    );
                  }}
                  className="size-4 accent-cyan"
                />
                <span className={rarityClass[entry]}>{entry}</span>
              </label>
            ))}
          </FilterGroup>
          <FilterGroup title="Price">
            {priceBands.map((band) => (
              <RadioRow
                key={band.id}
                name="nft-price"
                label={band.label}
                checked={price === band.id}
                onChange={() => {
                  setPrice(band.id);
                }}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Status">
            {statuses.map((entry) => (
              <RadioRow
                key={entry.id}
                name="nft-status"
                label={entry.label}
                checked={status === entry.id}
                onChange={() => {
                  setStatus(entry.id);
                }}
              />
            ))}
          </FilterGroup>
          {activeFilters > 0 ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 text-sm font-semibold text-cyan hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </aside>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-[#b7c6d6]">
              {sorted.length} {sorted.length === 1 ? "NFT" : "NFTs"}
            </p>
            {activeFilters > 0 || needle.length > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-cyan hover:underline"
              >
                Clear
              </button>
            ) : null}
          </div>
          {notice !== null ? (
            <p className="mb-3 text-sm font-medium text-white" role="status">
              {notice}
            </p>
          ) : null}
          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#1f2937] px-6 py-16 text-center">
              <p className="text-base font-semibold">No NFTs match</p>
              <p className="mt-2 text-sm text-[#b7c6d6]">
                Try another game, category, or search.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-button px-4 py-2 text-sm font-semibold text-white hover:bg-button-hover"
              >
                Clear filters
              </button>
            </div>
          ) : view === "cards" ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {sorted.map((item) => (
                <li key={item.id}>
                  <ItemCard
                    item={item}
                    owned={owned.has(item.id)}
                    buying={busyId === item.id}
                    buyLocked={busyId !== null}
                    onBuy={buy}
                    onOpenGame={openGame}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ItemTable
              items={sorted}
              owned={owned}
              busyId={busyId}
              onBuy={buy}
              onOpenGame={openGame}
            />
          )}
          <p className="mt-6 max-w-2xl text-sm leading-6 text-[#b7c6d6]">
            Prices and last sales are catalog records. Buy assigns the listing
            to your connected address for this visit. On the Rust chain, that
            same step is a fill of one shared listing: the object owner becomes
            your address, and the creator royalty stays inside the fill.
          </p>
        </div>
      </div>
    </div>
  );
}

function matchesPrice(price: number, band: PriceBand) {
  if (band === "any") {
    return true;
  }
  if (band === "under-20") {
    return price < 20;
  }
  if (band === "20-80") {
    return price >= 20 && price < 80;
  }
  if (band === "80-150") {
    return price >= 80 && price <= 150;
  }
  return price > 150;
}

function compareListings(sort: Exclude<SortKey, "featured">) {
  return (a: NftListing, b: NftListing) => {
    if (sort === "price-asc") {
      return a.price - b.price || a.name.localeCompare(b.name);
    }
    if (sort === "price-desc") {
      return b.price - a.price || a.name.localeCompare(b.name);
    }
    if (sort === "name") {
      return a.name.localeCompare(b.name);
    }
    return rarityRank[b.rarity] - rarityRank[a.rarity] || a.price - b.price;
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0d1721] px-4 py-3">
      <dt className="text-[11px] font-semibold tracking-[0.14em] text-[#a9bdd1] uppercase">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="mb-4 border-b border-[#1f2937] pb-4">
      <legend className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-[#a9bdd1] uppercase">
        {title}
      </legend>
      <div className="grid gap-2">{children}</div>
    </fieldset>
  );
}

function RadioRow({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#d5e2ee]">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 accent-cyan"
      />
      {label}
    </label>
  );
}

function CategoryPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${
        selected
          ? "bg-button text-white"
          : "border border-[#1f2937] bg-[#0d1721] text-[#d5e2ee] hover:border-cyan"
      }`}
    >
      {label}
    </button>
  );
}

function ViewButton({
  pressed,
  onClick,
  position,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  position: "left" | "right";
  children: string;
}) {
  const radius = position === "left" ? "rounded-l-xl" : "rounded-r-xl";
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`h-11 border border-[#1f2937] px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${radius} ${
        pressed ? "bg-button text-white" : "bg-[#0d1721] text-[#d5e2ee]"
      }`}
    >
      {children}
    </button>
  );
}

function BuyButton({
  item,
  owned,
  buying,
  buyLocked,
  onBuy,
  wide,
}: {
  item: NftListing;
  owned: boolean;
  buying: boolean;
  buyLocked: boolean;
  onBuy: (item: NftListing) => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        void onBuy(item);
      }}
      disabled={owned || buyLocked}
      aria-label={
        owned
          ? `${item.name} collected`
          : `Buy ${item.name} for ${item.price} ${nftCurrency}`
      }
      className={`rounded-lg bg-button font-semibold text-white hover:bg-button-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:opacity-70 ${
        wide ? "mt-3 w-full px-3 py-2 text-sm" : "px-3 py-1.5 text-sm"
      }`}
    >
      {owned ? "Collected" : buying ? "Buying…" : "Buy"}
    </button>
  );
}

function ItemCard({
  item,
  owned,
  buying,
  buyLocked,
  onBuy,
  onOpenGame,
}: {
  item: NftListing;
  owned: boolean;
  buying: boolean;
  buyLocked: boolean;
  onBuy: (item: NftListing) => void;
  onOpenGame: (gameId: string) => void;
}) {
  const game = gameById.get(item.gameId);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[#1f2937] bg-[#0d1721] motion-safe:transition motion-safe:hover:-translate-y-0.5 hover:border-cyan">
      <div className="relative aspect-square bg-[#061018]">
        <NftArtwork id={item.id} />
        <span
          className={`absolute top-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${rarityClass[item.rarity]}`}
        >
          {item.rarity}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full"
            style={{ background: game?.color ?? "#00a8e8" }}
          />
          <button
            type="button"
            onClick={() => {
              onOpenGame(item.gameId);
            }}
            className="max-w-full truncate text-left text-xs font-medium text-[#b7c6d6] hover:text-white"
          >
            {game?.name}
          </button>
          <span className="text-xs text-[#b7c6d6]">· {item.category}</span>
        </div>
        <h3 className="mt-1 text-sm font-semibold tracking-tight text-white">
          {item.name}
        </h3>
        <p className="mt-1 flex-1 text-xs leading-5 text-[#b7c6d6]">
          {item.summary}
        </p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold tracking-wide text-[#a9bdd1] uppercase">
              Price
            </p>
            <p className="text-sm font-semibold tabular-nums">
              {item.price} {nftCurrency}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold tracking-wide text-[#a9bdd1] uppercase">
              Last sale
            </p>
            <p className="text-sm tabular-nums text-[#d5e2ee]">{item.lastSale}</p>
          </div>
        </div>
        <BuyButton
          item={item}
          owned={owned}
          buying={buying}
          buyLocked={buyLocked}
          onBuy={onBuy}
          wide
        />
      </div>
    </article>
  );
}

function ItemTable({
  items,
  owned,
  busyId,
  onBuy,
  onOpenGame,
}: {
  items: readonly NftListing[];
  owned: ReadonlySet<string>;
  busyId: string | null;
  onBuy: (item: NftListing) => void;
  onOpenGame: (gameId: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#1f2937]">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <caption className="sr-only">Game NFT listings</caption>
        <thead className="bg-[#0d1721] text-[11px] tracking-[0.14em] text-[#a9bdd1] uppercase">
          <tr>
            <th scope="col" className="px-3 py-3 font-semibold">
              Item
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              Game
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              Category
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              Rarity
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Price
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Last sale
            </th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">
              Supply
            </th>
            <th scope="col" className="px-3 py-3 font-semibold">
              <span className="sr-only">Buy</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const game = gameById.get(item.gameId);
            return (
              <tr key={item.id} className="border-t border-[#1f2937]">
                <th scope="row" className="px-3 py-2 font-semibold text-white">
                  <span className="flex items-center gap-3">
                    <span className="size-12 shrink-0 overflow-hidden rounded-md">
                      <NftArtwork id={item.id} />
                    </span>
                    <span>
                      <span className="block">{item.name}</span>
                      <span className="mt-0.5 block text-xs font-normal text-[#b7c6d6]">
                        {item.summary}
                      </span>
                    </span>
                  </span>
                </th>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenGame(item.gameId);
                    }}
                    className="inline-flex items-center gap-1.5 text-left text-[#d5e2ee] hover:text-white"
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full"
                      style={{ background: game?.color ?? "#00a8e8" }}
                    />
                    {game?.name}
                  </button>
                </td>
                <td className="px-3 py-2 text-[#d5e2ee]">{item.category}</td>
                <td className={`px-3 py-2 font-medium ${rarityClass[item.rarity]}`}>
                  {item.rarity}
                </td>
                <td className="px-3 py-2 text-right font-semibold tabular-nums">
                  {item.price} {nftCurrency}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-[#d5e2ee]">
                  {item.lastSale}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-[#d5e2ee]">
                  {item.supply.toLocaleString("en-US")}
                </td>
                <td className="px-3 py-2 text-right">
                  <BuyButton
                    item={item}
                    owned={owned.has(item.id)}
                    buying={busyId === item.id}
                    buyLocked={busyId !== null}
                    onBuy={onBuy}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
