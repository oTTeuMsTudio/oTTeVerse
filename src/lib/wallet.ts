export type EIP1193Provider = {
  request: (args: { method: string; params?: unknown }) => Promise<unknown>;
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (
    event: string,
    listener: (...args: unknown[]) => void,
  ) => void;
};

export type EIP6963ProviderInfo = {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
};

export type EIP6963ProviderDetail = {
  info: EIP6963ProviderInfo;
  provider: EIP1193Provider;
};

const METAMASK_RDNS = new Set([
  "io.metamask",
  "io.metamask.flask",
  "io.metamask.mmi",
]);

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

export function isMetaMaskProvider(info: EIP6963ProviderInfo) {
  return METAMASK_RDNS.has(info.rdns);
}

export function discoverInjectedProviders(): Promise<EIP6963ProviderDetail[]> {
  if (typeof window === "undefined") {
    return Promise.resolve([]);
  }

  return new Promise((resolve) => {
    const byUuid = new Map<string, EIP6963ProviderDetail>();

    const onAnnounce = (event: Event) => {
      const detail = (event as CustomEvent<EIP6963ProviderDetail>).detail;
      if (!detail?.info?.uuid || !detail.provider) {
        return;
      }
      byUuid.set(detail.info.uuid, detail);
    };

    window.addEventListener("eip6963:announceProvider", onAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    window.setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
      resolve([...byUuid.values()]);
    }, 100);
  });
}

export function pickWalletProvider(
  providers: EIP6963ProviderDetail[],
): EIP1193Provider | undefined {
  const metamask = providers.find((entry) => isMetaMaskProvider(entry.info));
  if (metamask) {
    return metamask.provider;
  }
  if (providers[0]) {
    return providers[0].provider;
  }
  if (typeof window !== "undefined" && window.ethereum?.request) {
    return window.ethereum;
  }
  return undefined;
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function isUserRejected(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  const code = "code" in error ? error.code : undefined;
  return code === 4001 || code === "ACTION_REJECTED";
}

function firstAccount(value: unknown) {
  if (!Array.isArray(value) || typeof value[0] !== "string") {
    return null;
  }
  return value[0];
}

export async function requestAccounts(provider: EIP1193Provider) {
  const account = firstAccount(
    await provider.request({ method: "eth_requestAccounts" }),
  );
  if (!account) {
    throw new Error("No account returned");
  }
  return account;
}

export async function getAccounts(provider: EIP1193Provider) {
  return firstAccount(await provider.request({ method: "eth_accounts" }));
}

export async function revokePermissions(provider: EIP1193Provider) {
  try {
    await provider.request({
      method: "wallet_revokePermissions",
      params: [{ eth_accounts: {} }],
    });
  } catch {
    // Some wallets do not support revoke; clearing local state is enough.
  }
}
