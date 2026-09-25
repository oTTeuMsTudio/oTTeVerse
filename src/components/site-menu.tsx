"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type ReactNode,
} from "react";
import { ConnectWallet } from "@/components/connect-wallet";
import { LogInButton } from "@/components/log-in-button";
import {
  gameById,
  nftCategories,
  nftGames,
  nftListings,
} from "@/lib/nft-catalog";
import { posts } from "@/lib/posts";

type MenuLink = {
  href: string;
  label: string;
  hint?: string;
};

type SearchHit = MenuLink & {
  group: "Pages" | "Posts" | "Games" | "NFTs";
};

const RECENT_KEY = "otteverse-menu-recent-v1";
const RECENT_EVENT = "otteverse-recent";

const pageLinks: MenuLink[] = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/nfts", label: "NFT catalog" },
  { href: "/login", label: "Log in" },
];

const postLinks: MenuLink[] = posts.map((post) => ({
  href: post.href,
  label: post.title,
  hint: post.kicker ?? post.dateLabel,
}));

const categoryLinks: MenuLink[] = nftCategories.map((category) => ({
  href: `/nfts?category=${category}`,
  label: category,
}));

const gameLinks: MenuLink[] = nftGames.map((game) => ({
  href: `/nfts?game=${game.id}`,
  label: game.name,
}));

const panelClass =
  "absolute top-[calc(100%+8px)] z-50 min-w-[240px] rounded-xl border border-line bg-white py-1.5 text-sm text-foreground shadow-[0_8px_24px_rgba(4,17,29,0.12)]";

const panelLinkClass =
  "block rounded-lg px-3 py-2 leading-snug text-foreground hover:bg-[#f6f7f8] focus-visible:bg-[#f6f7f8] focus-visible:outline-none";

function prefersHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function parseRecent(raw: string): MenuLink[] {
  if (raw.length === 0) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter(
        (item): item is MenuLink =>
          !!item &&
          typeof item === "object" &&
          "href" in item &&
          "label" in item &&
          typeof item.href === "string" &&
          item.href.startsWith("/") &&
          typeof item.label === "string",
      )
      .slice(0, 5);
  } catch {
    return [];
  }
}

function recentSnapshot() {
  return localStorage.getItem(RECENT_KEY) ?? "";
}

function emptyRecentSnapshot() {
  return "";
}

function subscribeRecent(onStoreChange: () => void) {
  window.addEventListener(RECENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(RECENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function writeRecent(item: MenuLink) {
  const next = [
    item,
    ...parseRecent(recentSnapshot()).filter((entry) => entry.href !== item.href),
  ].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(RECENT_EVENT));
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={`size-2.5 shrink-0 opacity-80 ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M2.2 4.4 6 8l3.8-3.6" />
    </svg>
  );
}

function MenuSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="py-1">
      <p className="px-3 pt-1.5 pb-1 text-[11px] font-semibold tracking-wide text-muted uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

function MenuLinks({
  items,
  onPick,
}: {
  items: readonly MenuLink[];
  onPick: (item: MenuLink) => void;
}) {
  return (
    <ul>
      {items.map((item) => (
        <li key={`${item.href}-${item.label}`}>
          <Link href={item.href} className={panelLinkClass} onClick={() => onPick(item)}>
            <span className="line-clamp-2">{item.label}</span>
            {item.hint ? (
              <span className="mt-0.5 block text-[11px] text-muted">{item.hint}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function SupernavItem({
  id,
  label,
  href,
  current,
  open,
  onEnter,
  onLeave,
  onToggle,
  onPick,
  children,
}: {
  id: string;
  label: string;
  href: string;
  current: boolean;
  open: boolean;
  onEnter: (id: string) => void;
  onLeave: () => void;
  onToggle: (id: string, detail: number) => void;
  onPick: (item: MenuLink) => void;
  children: ReactNode;
}) {
  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => onEnter(id)}
      onMouseLeave={onLeave}
    >
      <Link
        href={href}
        aria-current={current ? "page" : undefined}
        className={`rounded-xl px-3 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-button ${
          current ? "text-button" : "text-foreground hover:bg-[#f6f7f8]"
        }`}
        onClick={() => onPick({ href, label })}
      >
        {label}
      </Link>
      <button
        type="button"
        className="inline-flex size-8 items-center justify-center rounded-lg text-muted hover:bg-[#f6f7f8] hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-button"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-label={`${label} menu`}
        onClick={(event) => onToggle(id, event.detail)}
      >
        <Chevron open={open} />
      </button>
      {open ? (
        <div id={`${id}-menu`} className={`${panelClass} max-h-[70vh] w-[340px] overflow-y-auto`}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

function SearchPanel({
  query,
  hits,
  recent,
  onPick,
}: {
  query: string;
  hits: readonly SearchHit[];
  recent: readonly MenuLink[];
  onPick: (item: MenuLink) => void;
}) {
  const needle = query.trim();
  if (needle.length > 0) {
    if (hits.length === 0) {
      return (
        <p className="px-3 py-3 text-sm text-muted">
          No matches. Press Enter to search the NFT catalog.
        </p>
      );
    }
    const groups = ["Pages", "Posts", "Games", "NFTs"] as const;
    return (
      <div>
        {groups.map((group) => {
          const items = hits.filter((hit) => hit.group === group);
          if (items.length === 0) {
            return null;
          }
          return (
            <MenuSection key={group} title={group}>
              <MenuLinks items={items} onPick={onPick} />
            </MenuSection>
          );
        })}
      </div>
    );
  }

  return (
    <div>
      {recent.length > 0 ? (
        <MenuSection title="Recent">
          <MenuLinks items={recent} onPick={onPick} />
        </MenuSection>
      ) : null}
      <MenuSection title="Popular">
        <MenuLinks items={postLinks.slice(0, 4)} onPick={onPick} />
      </MenuSection>
      <MenuSection title="Categories">
        <MenuLinks items={categoryLinks} onPick={onPick} />
      </MenuSection>
      <MenuSection title="Games">
        <MenuLinks items={gameLinks} onPick={onPick} />
      </MenuSection>
    </div>
  );
}

function MobilePanel({ onPick }: { onPick: (item: MenuLink) => void }) {
  return (
    <div
      id="site-mobile-menu"
      className="max-h-[70vh] overflow-y-auto border-t border-line bg-white lg:hidden"
    >
      <nav aria-label="Menu" className="px-2 py-2">
        <MenuSection title="Pages">
          <MenuLinks items={pageLinks} onPick={onPick} />
        </MenuSection>
        <MenuSection title="Blog">
          <MenuLinks items={postLinks} onPick={onPick} />
        </MenuSection>
        <MenuSection title="Explore">
          <MenuLinks items={categoryLinks} onPick={onPick} />
          <MenuLinks items={gameLinks} onPick={onPick} />
        </MenuSection>
      </nav>
    </div>
  );
}

export function SiteMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const [openState, setOpenState] = useState<{ id: string; path: string } | null>(null);
  const [mobilePath, setMobilePath] = useState<string | null>(null);
  const [searchPath, setSearchPath] = useState<string | null>(null);
  const [queryState, setQueryState] = useState({ text: "", path: "" });
  const recentRaw = useSyncExternalStore(
    subscribeRecent,
    recentSnapshot,
    emptyRecentSnapshot,
  );
  const open = openState?.path === pathname ? openState.id : null;
  const mobileOpen = mobilePath === pathname;
  const searchOpen = searchPath === pathname;
  const query = queryState.path === pathname ? queryState.text : "";
  const recent = useMemo(() => parseRecent(recentRaw), [recentRaw]);

  const hits = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) {
      return [];
    }
    const pages: SearchHit[] = pageLinks
      .filter((item) => item.label.toLowerCase().includes(needle))
      .map((item) => ({ ...item, group: "Pages" }));
    const articles: SearchHit[] = posts
      .filter((post) =>
        `${post.title} ${post.description} ${post.kicker ?? ""}`
          .toLowerCase()
          .includes(needle),
      )
      .map((post) => ({
        href: post.href,
        label: post.title,
        hint: post.kicker ?? post.dateLabel,
        group: "Posts",
      }));
    const games: SearchHit[] = nftGames
      .filter((game) => game.name.toLowerCase().includes(needle))
      .map((game) => ({
        href: `/nfts?game=${game.id}`,
        label: game.name,
        group: "Games",
      }));
    const listings: SearchHit[] = nftListings
      .filter((item) => {
        const game = gameById.get(item.gameId);
        return `${item.name} ${item.category} ${item.rarity} ${game?.name ?? ""}`
          .toLowerCase()
          .includes(needle);
      })
      .slice(0, 8)
      .map((item) => ({
        href: `/nfts?q=${encodeURIComponent(item.name)}`,
        label: item.name,
        hint: gameById.get(item.gameId)?.name,
        group: "NFTs",
      }));
    return [...pages, ...articles, ...games, ...listings].slice(0, 12);
  }, [query]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenState(null);
        setSearchPath(null);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenState(null);
        setSearchPath(null);
        setMobilePath(null);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) {
        window.clearTimeout(closeTimer.current);
      }
    };
  }, []);

  function remember(item: MenuLink) {
    writeRecent(item);
    setOpenState(null);
    setMobilePath(null);
    setSearchPath(null);
    setQueryState({ text: "", path: pathname });
  }

  function cancelClose() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function onEnter(id: string) {
    if (!prefersHover()) {
      return;
    }
    cancelClose();
    setSearchPath(null);
    setOpenState({ id, path: pathname });
  }

  function onLeave() {
    if (!prefersHover()) {
      return;
    }
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenState(null), 160);
  }

  function onToggle(id: string, detail: number) {
    if (prefersHover() && detail !== 0) {
      return;
    }
    setSearchPath(null);
    setOpenState((current) => {
      const shown = current?.path === pathname ? current.id : null;
      return shown === id ? null : { id, path: pathname };
    });
  }

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const needle = query.trim();
    if (needle.length === 0) {
      return;
    }
    const target = hits[0] ?? {
      href: `/nfts?q=${encodeURIComponent(needle)}`,
      label: needle,
    };
    remember(target);
    router.push(target.href);
  }

  function onSearchFocus() {
    setSearchPath(pathname);
    setOpenState(null);
  }

  function setQuery(text: string) {
    setQueryState({ text, path: pathname });
  }

  const onBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const onNfts = pathname === "/nfts" || pathname.startsWith("/nfts/");

  return (
    <div ref={rootRef} className="bg-white text-foreground">
      <div className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-6">
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-xl text-foreground hover:bg-[#f6f7f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-button lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="site-mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => {
            setMobilePath((current) => (current === pathname ? null : pathname));
            setOpenState(null);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="currentColor">
            {mobileOpen ? (
              <path d="M6.2 5.2 12 11l5.8-5.8 1 1L13 12l5.8 5.8-1 1L12 13l-5.8 5.8-1-1L11 12 5.2 6.2z" />
            ) : (
              <path d="M4 7h16v1.6H4zm0 4.2h16v1.6H4zM4 15.4h16V17H4z" />
            )}
          </svg>
        </button>
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2.5 text-foreground"
          aria-label="oTTeVerse home"
          onClick={() => remember({ href: "/", label: "Home" })}
        >
          <Image
            src="/logotip.jpg"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-xl object-cover"
            priority
          />
          <span className="hidden truncate text-[20px] font-semibold tracking-tight sm:inline">
            oTTeVerse
          </span>
        </Link>
        <SearchBox
          id="store-search"
          className="relative mx-2 hidden min-w-0 flex-1 lg:block"
          query={query}
          searchOpen={searchOpen}
          hits={hits}
          recent={recent}
          onQuery={(text) => {
            setQuery(text);
            setSearchPath(pathname);
          }}
          onFocus={onSearchFocus}
          onSubmit={onSearch}
          onPick={remember}
        />
        <nav aria-label="Primary" className="hidden items-center lg:flex">
          <SupernavItem
            id="nfts"
            label="Explore"
            href="/nfts"
            current={onNfts}
            open={open === "nfts"}
            onEnter={onEnter}
            onLeave={onLeave}
            onToggle={onToggle}
            onPick={remember}
          >
            <MenuSection title="Type">
              <MenuLinks items={categoryLinks} onPick={remember} />
            </MenuSection>
            <MenuSection title="Collections">
              <MenuLinks items={gameLinks} onPick={remember} />
            </MenuSection>
          </SupernavItem>
          <SupernavItem
            id="blog"
            label="Blog"
            href="/blog"
            current={onBlog}
            open={open === "blog"}
            onEnter={onEnter}
            onLeave={onLeave}
            onToggle={onToggle}
            onPick={remember}
          >
            <MenuLinks items={postLinks} onPick={remember} />
          </SupernavItem>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ConnectWallet />
          <LogInButton />
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1600px] px-3 pb-3 lg:hidden">
        <SearchBox
          id="store-search-mobile"
          className="relative w-full"
          query={query}
          searchOpen={searchOpen}
          hits={hits}
          recent={recent}
          onQuery={(text) => {
            setQuery(text);
            setSearchPath(pathname);
          }}
          onFocus={onSearchFocus}
          onSubmit={onSearch}
          onPick={remember}
        />
      </div>
      {mobileOpen ? <MobilePanel onPick={remember} /> : null}
    </div>
  );
}

function SearchBox({
  id,
  className,
  query,
  searchOpen,
  hits,
  recent,
  onQuery,
  onFocus,
  onSubmit,
  onPick,
}: {
  id: string;
  className: string;
  query: string;
  searchOpen: boolean;
  hits: readonly SearchHit[];
  recent: readonly MenuLink[];
  onQuery: (text: string) => void;
  onFocus: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onPick: (item: MenuLink) => void;
}) {
  return (
    <form className={className} role="search" onSubmit={onSubmit}>
      <label htmlFor={id} className="sr-only">
        Search items, collections, and posts
      </label>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </svg>
      <input
        id={id}
        role="combobox"
        value={query}
        onChange={(event) => {
          onQuery(event.target.value);
        }}
        onFocus={onFocus}
        placeholder="Search items, collections, and accounts"
        autoComplete="off"
        aria-expanded={searchOpen}
        aria-controls={`${id}-panel`}
        aria-autocomplete="list"
        className="h-12 w-full rounded-xl border border-line bg-[#f6f7f8] pr-4 pl-10 text-sm text-foreground placeholder:text-muted outline-none focus:border-button focus:bg-white focus:shadow-[0_0_0_3px_rgba(32,129,226,0.18)]"
      />
      {searchOpen ? (
        <div
          id={`${id}-panel`}
          className={`${panelClass} right-0 left-0 max-h-[70vh] overflow-y-auto`}
        >
          <SearchPanel query={query} hits={hits} recent={recent} onPick={onPick} />
        </div>
      ) : null}
    </form>
  );
}
