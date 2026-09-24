"use client";

import { useEffect, useRef, useState } from "react";
import {
  discoverInjectedProviders,
  getAccounts,
  isUserRejected,
  pickWalletProvider,
  requestAccounts,
  revokePermissions,
  shortenAddress,
  type EIP1193Provider,
} from "@/lib/wallet";

const INSTALL_URL = "https://metamask.io/download";

const buttonClassName =
  "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[2px] bg-gradient-to-b from-[#75b022] to-[#588a1b] px-2.5 text-[13px] font-normal text-[#d2efa9] shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] hover:from-[#8bc53f] hover:to-[#6aa621] hover:text-white disabled:opacity-70";

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-4 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const providerRef = useRef<EIP1193Provider | null>(null);
  const attachRef = useRef<(provider: EIP1193Provider) => void>(() => {});

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
        // Ignore restore failures; the user can connect from the button.
      }
    })();

    return () => {
      cancelled = true;
      providerRef.current?.removeListener?.("accountsChanged", onAccountsChanged);
    };
  }, []);

  async function connect() {
    setError(null);
    setBusy(true);
    try {
      const providers = await discoverInjectedProviders();
      const provider = pickWalletProvider(providers);
      if (!provider) {
        window.open(INSTALL_URL, "_blank", "noopener,noreferrer");
        setError("Install MetaMask to connect");
        return;
      }
      attachRef.current(provider);
      setAccount(await requestAccounts(provider));
    } catch (err) {
      setError(
        isUserRejected(err) ? "Connection rejected" : "Could not connect wallet",
      );
    } finally {
      setBusy(false);
    }
  }

  async function disconnect() {
    setBusy(true);
    setError(null);
    try {
      if (providerRef.current) {
        await revokePermissions(providerRef.current);
      }
    } finally {
      setAccount(null);
      setBusy(false);
    }
  }

  return (
    <span className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          void (account ? disconnect() : connect());
        }}
        disabled={busy}
        className={buttonClassName}
        title={
          account
            ? "Disconnect wallet"
            : (error ?? "Connect MetaMask or another injected wallet")
        }
        aria-label={
          account
            ? `Connected ${shortenAddress(account)}. Disconnect wallet.`
            : "Connect Wallet"
        }
        aria-busy={busy}
      >
        <WalletIcon />
        {account ? (
          shortenAddress(account)
        ) : busy ? (
          "Connecting…"
        ) : (
          <>
            Connect
            <span className="hidden sm:inline"> Wallet</span>
          </>
        )}
      </button>
      {error ? (
        <span className="sr-only" role="status">
          {error}
        </span>
      ) : null}
    </span>
  );
}
