"use client";

import { useSearchParams } from "next/navigation";
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
  Common: "text-[#707a83]",
  Uncommon: "text-[#0d8a4e]",
  Rare: "text-[#2081e2]",
  Epic: "text-[#7a3ff2]",
  Legendary: "text-[#b8860b]",
};

const fieldClass =
  "h-12 rounded-xl border border-line bg-white px-3 text-sm text-foreground outline-none focus:border-button focus:shadow-[0_0_0_3px_rgba(32,129,226,0.18)]";

function isNftCategory(value: string | null): value is NftCategory {
  return value === "Land" || value === "Item" || value === "Wearable";
}

function gameFromParam(value: string | null) {
  if (!value || !nftGames.some((game) => game.id === value)) {
    return null;
  }
  return value;
}

export function NftStore() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const gameParam = searchParams.get("game");
  const queryParam = searchParams.get("q");
  const initialCategory = isNftCategory(categoryParam) ? categoryParam : "All";
  const initialGameId = gameFromParam(gameParam);
  const initialQuery = queryParam ?? "";

  return (
    <NftStoreScreen
      initialCategory={initialCategory}
      initialGameId={initialGameId}
      initialQuery={initialQuery}
    />
  );
}

function NftStoreScreen({
  initialCategory,
  initialGameId,
  initialQuery,
}: {
  initialCategory: NftCategory | "All";
  initialGameId: string | null;
  initialQuery: string;
}) {
  const [account, setAccount] = useState<string | null>(null);
  const [owned, setOwned] = useState<ReadonlySet<string>>(() => new Set());
  const paramKey = `${initialCategory}|${initialGameId ?? ""}|${initialQuery}`;
  const [filters, setFilters] = useState(() => ({
    key: paramKey,
    category: initialCategory,
    gameId: initialGameId,
    query: initialQuery,
  }));
  const category = filters.key === paramKey ? filters.category : initialCategory;
  const gameId = filters.key === paramKey ? filters.gameId : initialGameId;
  const query = filters.key === paramKey ? filters.query : initialQuery;

  function setQuery(next: string) {
    setFilters({ key: paramKey, category, gameId, query: next });
  }

  function setGameId(next: string | null | ((current: string | null) => string | null)) {
    setFilters({
      key: paramKey,
      category,
      gameId: typeof next === "function" ? next(gameId) : next,
      query,
    });
  }

  function setCategory(next: NftCategory | "All") {
    setFilters({ key: paramKey, category: next, gameId, query });
  }
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
    setFilters({ key: paramKey, category: "All", gameId: null, query: "" });
    setRarities([]);
    setPrice("any");
    setStatus("all");
  }

  function openGame(id: string) {
    setGameId((current) => (current === id ? null : id));
  }

  return (
    <div className="mt-8 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {selectedGame ? selectedGame.name : "All collections"}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
            {selectedGame
              ? selectedGame.summary
              : `${nftGames.length} collections. ${nftListings.length} items. Prices in ${nftCurrency}.`}
          </p>
        </div>
        <p className="text-sm text-muted">
          {account
            ? `Collecting as ${shortenAddress(account)}.`
            : "Connect Wallet in the header, or press Buy and the page will ask for it."}
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
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
              className={`w-[220px] shrink-0 overflow-hidden rounded-xl border bg-white text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button ${
                selected
                  ? "border-button ring-2 ring-button"
                  : "border-line hover:shadow-[0_0_8px_rgba(4,17,29,0.18)]"
              }`}
            >
              <div className="relative h-16">
                <GameBanner gameId={game.id} />
                <div className="absolute -bottom-4 left-3 size-10 overflow-hidden rounded-lg border-2 border-white">
                  <GameMark gameId={game.id} />
                </div>
              </div>
              <div className="px-3 pt-6 pb-3">
                <p className="truncate text-sm font-semibold">{game.name}</p>
                <p className="mt-2 flex items-center justify-between text-xs text-muted">
                  <span>Floor</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {formatOtte(gameStats.floor)}
                  </span>
                </p>
                <p className="mt-1 flex items-center justify-between text-xs text-muted">
                  <span>Items</span>
                  <span className="tabular-nums text-foreground">
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
            placeholder="Search items, collections, and accounts"
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
            className="h-12 rounded-xl border border-line bg-white px-3 text-sm font-semibold text-foreground lg:hidden"
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
          className={`rounded-xl border border-line bg-white p-4 lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto ${
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
                className="flex items-center gap-2 text-sm text-foreground"
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
                  className="size-4 accent-button"
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
              className="mt-2 text-sm font-semibold text-button hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </aside>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted">
              {sorted.length} {sorted.length === 1 ? "NFT" : "NFTs"}
            </p>
            {activeFilters > 0 || needle.length > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm font-semibold text-button hover:underline"
              >
                Clear
              </button>
            ) : null}
          </div>
          {notice !== null ? (
            <p className="mb-3 text-sm font-medium text-foreground" role="status">
              {notice}
            </p>
          ) : null}
          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center">
              <p className="text-base font-semibold">No items match</p>
              <p className="mt-2 text-sm text-muted">
                Try another game, category, or search.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-xl bg-button px-4 py-2 text-sm font-semibold text-white hover:bg-button-hover"
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
          <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">
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
    <div className="bg-white px-4 py-3">
      <dt className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
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
    <fieldset className="mb-4 border-b border-line pb-4 last:border-b-0">
      <legend className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
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
    <label className="flex items-center gap-2 text-sm text-foreground">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 accent-button"
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
      className={`shrink-0 rounded-xl px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button ${
        selected
          ? "bg-button text-white"
          : "border border-line bg-white text-foreground hover:bg-[#f6f7f8]"
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
      className={`h-12 border border-line px-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button ${radius} ${
        pressed ? "bg-button text-white" : "bg-white text-foreground hover:bg-[#f6f7f8]"
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
      className={`rounded-xl bg-button font-semibold text-white hover:bg-button-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button disabled:opacity-70 ${
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
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white hover:shadow-[0_0_8px_rgba(4,17,29,0.18)]">
      <div className="relative aspect-square bg-[#f6f7f8]">
        <NftArtwork id={item.id} />
        <span
          className={`absolute top-2 left-2 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${rarityClass[item.rarity]}`}
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
            className="max-w-full truncate text-left text-xs font-medium text-muted hover:text-button"
          >
            {game?.name}
          </button>
          <span className="text-xs text-muted">· {item.category}</span>
        </div>
        <h3 className="mt-1 text-sm font-semibold tracking-tight text-foreground">
          {item.name}
        </h3>
        <p className="mt-1 flex-1 text-xs leading-5 text-muted">
          {item.summary}
        </p>
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold tracking-wide text-muted uppercase">
              Price
            </p>
            <p className="text-sm font-semibold tabular-nums">
              {item.price} {nftCurrency}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold tracking-wide text-muted uppercase">
              Last sale
            </p>
            <p className="text-sm tabular-nums text-[#353840]">{item.lastSale}</p>
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
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-[880px] border-collapse text-left text-sm">
        <caption className="sr-only">Game NFT listings</caption>
        <thead className="bg-[#f6f7f8] text-[11px] tracking-[0.14em] text-muted uppercase">
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
              <tr key={item.id} className="border-t border-line hover:bg-[#fbfdff]">
                <th scope="row" className="px-3 py-2 font-semibold text-foreground">
                  <span className="flex items-center gap-3">
                    <span className="size-12 shrink-0 overflow-hidden rounded-md">
                      <NftArtwork id={item.id} />
                    </span>
                    <span>
                      <span className="block">{item.name}</span>
                      <span className="mt-0.5 block text-xs font-normal text-muted">
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
                    className="inline-flex items-center gap-1.5 text-left text-[#353840] hover:text-button"
                  >
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full"
                      style={{ background: game?.color ?? "#00a8e8" }}
                    />
                    {game?.name}
                  </button>
                </td>
                <td className="px-3 py-2 text-[#353840]">{item.category}</td>
                <td className={`px-3 py-2 font-medium ${rarityClass[item.rarity]}`}>
                  {item.rarity}
                </td>
                <td className="px-3 py-2 text-right font-semibold tabular-nums">
                  {item.price} {nftCurrency}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-[#353840]">
                  {item.lastSale}
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-[#353840]">
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
