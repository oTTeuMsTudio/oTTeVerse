"use client";

import { useEffect, useRef, useState } from "react";
import { NftArtwork } from "@/components/nft-artwork";
import {
  nftCategories,
  nftCurrency,
  nftListings,
  type NftCategory,
  type NftListing,
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

export function NftStore() {
  const [account, setAccount] = useState<string | null>(null);
  const [owned, setOwned] = useState<ReadonlySet<string>>(() => new Set());
  const [category, setCategory] = useState<NftCategory | "All">("All");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
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
    setStatus(null);
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
      setStatus(`${item.name} now belongs to ${shortenAddress(address)}.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not collect this NFT";
      setStatus(isUserRejected(error) ? "Connection rejected" : message);
    } finally {
      busyRef.current = false;
      setBusyId(null);
    }
  }

  const visible =
    category === "All"
      ? nftListings
      : nftListings.filter((item) => item.category === category);

  return (
    <div className="mt-8">
      <p className="text-sm text-muted">
        {account
          ? `Collecting as ${shortenAddress(account)}.`
          : "Connect Wallet in the header, or press Buy and the page will ask for it."}
      </p>
      <div
        role="group"
        aria-label="Categories"
        className="mt-4 flex flex-wrap gap-2"
      >
        {nftCategories.map((entry) => {
          const selected = entry === category;
          return (
            <button
              key={entry}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setCategory(entry);
              }}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${
                selected
                  ? "border border-button bg-button text-white"
                  : "border border-line bg-white text-foreground hover:border-cyan"
              }`}
            >
              {entry}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-muted">
        Showing {visible.length} {visible.length === 1 ? "object" : "objects"}.
      </p>
      {status !== null ? (
        <p className="mt-2 text-sm font-medium text-foreground" role="status">
          {status}
        </p>
      ) : null}
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visible.map((item) => {
          const isOwned = owned.has(item.id);
          const buying = busyId === item.id;
          return (
            <li key={item.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white">
                <div className="flex justify-center border-b border-line bg-[#e8f7fc] px-3 py-3">
                  <div className="size-20 sm:size-24">
                    <NftArtwork id={item.id} />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
                    {item.category}
                  </p>
                  <h2
                    id={`nft-${item.id}`}
                    className="mt-1 text-base font-semibold tracking-tight"
                  >
                    {item.name}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                    {item.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {item.price} {nftCurrency}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        void buy(item);
                      }}
                      disabled={isOwned || busyId !== null}
                      aria-label={
                        isOwned
                          ? `${item.name} collected`
                          : `Buy ${item.name} for ${item.price} ${nftCurrency}`
                      }
                      className="rounded-md bg-button px-3 py-1.5 text-sm font-semibold text-white hover:bg-button-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan disabled:opacity-70"
                    >
                      {isOwned ? "Collected" : buying ? "Buying…" : "Buy"}
                    </button>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 max-w-2xl text-sm leading-6 text-muted">
        Buy assigns the listing to your connected address for this visit.
        On the Rust chain, that same step is a fill of one shared listing:
        the object owner becomes your address, and the creator royalty stays
        inside the fill.
      </p>
    </div>
  );
}
