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

const tutorialLinks: MenuLink[] = posts
  .filter((post) => post.kicker === "Tutorial")
  .map((post) => ({
    href: post.href,
    label: post.title,
    hint: "Tutorial",
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
  "absolute top-full z-50 min-w-[240px] border border-black bg-[#1b2838] py-1.5 text-[13px] text-[#c6d4df] shadow-[0_12px_28px_rgba(0,0,0,0.55)]";

const panelLinkClass =
  "block px-3 py-1.5 leading-snug text-[#c6d4df] hover:bg-[#2a475e] hover:text-white focus-visible:bg-[#2a475e] focus-visible:text-white focus-visible:outline-none";

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
      <p className="px-3 pt-1 pb-1 text-[11px] font-semibold tracking-wide text-[#67c1f5] uppercase">
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
              <span className="mt-0.5 block text-[11px] text-[#8f98a0]">{item.hint}</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function TabFlyout({
  id,
  label,
  current,
  open,
  align = "left",
  wide = false,
  onEnter,
  onLeave,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  current?: boolean;
  open: boolean;
  align?: "left" | "right";
  wide?: boolean;
  onEnter: (id: string) => void;
  onLeave: () => void;
  onToggle: (id: string, detail: number) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={() => onEnter(id)} onMouseLeave={onLeave}>
      <button
        type="button"
        className={`inline-flex h-9 items-center gap-1.5 px-3 text-[13px] hover:bg-black/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#67c1f5] ${
          open || current ? "bg-black/25 text-white" : "text-[#e5eef5]"
        }`}
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        aria-haspopup="true"
        onClick={(event) => onToggle(id, event.detail)}
      >
        {label}
        <Chevron open={open} />
      </button>
      {open ? (
        <div
          id={`${id}-menu`}
          className={`${panelClass} max-h-[70vh] overflow-y-auto ${
            align === "right" ? "right-0" : "left-0"
          } ${wide ? "w-[380px]" : ""}`}
        >
          {children}
        </div>
      ) : null}
    </div>
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
        className={`px-2 py-1 text-[14px] tracking-wide uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67c1f5] ${
          current ? "text-white" : "text-[#b8b6b4] hover:text-white"
        }`}
        onClick={() => onPick({ href, label })}
      >
        {label}
      </Link>
      <button
        type="button"
        className="inline-flex size-6 items-center justify-center text-[#8f98a0] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#67c1f5]"
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
        <p className="px-3 py-3 text-[13px] text-[#8f98a0]">
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
      id="steam-mobile-menu"
      className="max-h-[70vh] overflow-y-auto border-t border-black bg-[#1b2838] lg:hidden"
    >
      <nav aria-label="Menu" className="px-2 py-2">
        <MenuSection title="Store">
          <MenuLinks items={pageLinks} onPick={onPick} />
        </MenuSection>
        <MenuSection title="News">
          <MenuLinks items={postLinks} onPick={onPick} />
        </MenuSection>
        <MenuSection title="Categories">
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
  const [storeVisible, setStoreVisible] = useState(true);
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
    let last = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (y <= 4) {
        setStoreVisible(true);
      } else if (y > last + 8) {
        setStoreVisible(false);
        setOpenState(null);
        setSearchPath(null);
      } else if (last - y > 8) {
        setStoreVisible(true);
      }
      last = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    setStoreVisible(true);
  }

  function setQuery(text: string) {
    setQueryState({ text, path: pathname });
  }

  const onHome = pathname === "/";
  const onBlog = pathname === "/blog" || pathname.startsWith("/blog/");
  const onNfts = pathname === "/nfts" || pathname.startsWith("/nfts/");
  const showStore = storeVisible || mobileOpen || searchOpen;

  return (
    <div ref={rootRef} className="steam-header">
      <div className="flex h-14 items-center gap-1 px-3 sm:gap-2 sm:px-4 lg:px-6">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center text-[#c6d4df] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#67c1f5] lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="steam-mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => {
            setMobilePath((current) => (current === pathname ? null : pathname));
            setOpenState(null);
            setStoreVisible(true);
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
          className="flex min-w-0 items-center gap-2.5 text-white"
          aria-label="oTTeVerse home"
          onClick={() => remember({ href: "/", label: "Home" })}
        >
          <Image
            src="/logotip.jpg"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-sm object-cover"
            priority
          />
          <span className="hidden truncate text-[18px] font-semibold tracking-tight sm:inline">
            oTTeVerse
          </span>
        </Link>
        <nav aria-label="Primary" className="ml-3 hidden items-center lg:flex">
          <SupernavItem
            id="store"
            label="Store"
            href="/"
            current={onHome}
            open={open === "store"}
            onEnter={onEnter}
            onLeave={onLeave}
            onToggle={onToggle}
            onPick={remember}
          >
            <MenuLinks items={pageLinks} onPick={remember} />
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
          <SupernavItem
            id="nfts"
            label="NFTs"
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
            <MenuSection title="Games">
              <MenuLinks items={gameLinks} onPick={remember} />
            </MenuSection>
          </SupernavItem>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ConnectWallet />
          <LogInButton />
        </div>
      </div>
      {mobileOpen ? <MobilePanel onPick={remember} /> : null}
      <div className="steam-storebar" hidden={showStore ? undefined : true}>
        <div className="flex items-center gap-1 px-3 py-2 lg:px-5">
          <div className="hidden flex-1 items-center lg:flex">
            <TabFlyout
              id="browse"
              label="Browse"
              open={open === "browse"}
              onEnter={onEnter}
              onLeave={onLeave}
              onToggle={onToggle}
            >
              <MenuLinks
                items={pageLinks.filter((item) => item.href !== "/login")}
                onPick={remember}
              />
              <MenuSection title="Tutorials">
                <MenuLinks items={tutorialLinks} onPick={remember} />
              </MenuSection>
            </TabFlyout>
            <TabFlyout
              id="news"
              label="News"
              current={onBlog}
              wide
              open={open === "news"}
              onEnter={onEnter}
              onLeave={onLeave}
              onToggle={onToggle}
            >
              <MenuLinks items={[{ href: "/blog", label: "All posts" }, ...postLinks]} onPick={remember} />
            </TabFlyout>
            <TabFlyout
              id="categories"
              label="Categories"
              current={onNfts}
              open={open === "categories"}
              onEnter={onEnter}
              onLeave={onLeave}
              onToggle={onToggle}
            >
              <MenuSection title="Type">
                <MenuLinks items={categoryLinks} onPick={remember} />
              </MenuSection>
              <MenuSection title="Games">
                <MenuLinks items={gameLinks} onPick={remember} />
              </MenuSection>
            </TabFlyout>
          </div>
          <form
            className="relative w-full lg:w-[min(560px,42vw)] lg:flex-none"
            role="search"
            onSubmit={onSearch}
          >
            <label htmlFor="store-search" className="sr-only">
              Search posts and NFTs
            </label>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-[#d5eaf3]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
            <input
              id="store-search"
              role="combobox"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchPath(pathname);
              }}
              onFocus={onSearchFocus}
              placeholder="search"
              autoComplete="off"
              aria-expanded={searchOpen}
              aria-controls="store-search-panel"
              aria-autocomplete="list"
              className="h-9 w-full rounded-[3px] bg-[#316282] pr-3 pl-9 text-[14px] text-white placeholder:text-[#d5eaf3]/75 outline-none focus:bg-[#3d7ea3]"
            />
            {searchOpen ? (
              <div
                id="store-search-panel"
                className={`${panelClass} right-0 left-0 max-h-[70vh] overflow-y-auto`}
              >
                <SearchPanel query={query} hits={hits} recent={recent} onPick={remember} />
              </div>
            ) : null}
          </form>
          <div className="hidden flex-1 items-center justify-end lg:flex">
            <Link
              href="/nfts"
              aria-current={onNfts ? "page" : undefined}
              className={`inline-flex h-9 items-center gap-2 px-3 text-[13px] hover:bg-black/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#67c1f5] ${
                onNfts ? "text-white" : "text-[#e5eef5]"
              }`}
              onClick={() => remember({ href: "/nfts", label: "NFT catalog" })}
            >
              Catalog
              <span className="text-[#67c1f5]">{nftListings.length}</span>
            </Link>
            <TabFlyout
              id="more"
              label="More"
              align="right"
              open={open === "more"}
              onEnter={onEnter}
              onLeave={onLeave}
              onToggle={onToggle}
            >
              <MenuLinks
                items={[
                  { href: "/login", label: "Log in" },
                  { href: "/", label: "Home" },
                ]}
                onPick={remember}
              />
            </TabFlyout>
          </div>
        </div>
      </div>
    </div>
  );
}
