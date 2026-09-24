import type { ReactNode } from "react";

const frame = "h-full w-full";

export function NftArtwork({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" className={frame}>
      {scenes[id] ?? scenes["harbor-plot"]}
    </svg>
  );
}

const banners: Record<string, { bg: string; mid: string; accent: string }> = {
  "harbor-exchange": { bg: "#06344a", mid: "#0b6e91", accent: "#e07a3d" },
  "ridge-runners": { bg: "#10281c", mid: "#1f7a4d", accent: "#b6f25c" },
  "sigil-keep": { bg: "#2a2208", mid: "#8a6a12", accent: "#f0c24b" },
  "iris-armory": { bg: "#3a1020", mid: "#9f2948", accent: "#fb7185" },
  "mesh-frontier": { bg: "#042824", mid: "#0f766e", accent: "#5eead4" },
  "fast-path": { bg: "#241038", mid: "#6d28d9", accent: "#e9d5ff" },
};

export function GameBanner({ gameId }: { gameId: string }) {
  const tone = banners[gameId] ?? banners["harbor-exchange"];
  return (
    <svg
      viewBox="0 0 320 96"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={frame}
    >
      <rect width="320" height="96" fill={tone.bg} />
      <circle cx="270" cy="18" r="64" fill={tone.mid} />
      <circle cx="36" cy="84" r="42" fill={tone.accent} opacity="0.85" />
      <path
        d="M0 62c48-28 96 8 148-8s92-6 172 18v24H0z"
        fill="#ffffff"
        opacity="0.12"
      />
    </svg>
  );
}

export function GameMark({ gameId }: { gameId: string }) {
  const tone = banners[gameId] ?? banners["harbor-exchange"];
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={frame}>
      <rect width="64" height="64" fill={tone.bg} />
      <path
        d="M32 8l18 10v20L32 48 14 38V18z"
        fill={tone.mid}
        stroke={tone.accent}
        strokeWidth="2"
      />
      <circle cx="32" cy="28" r="6" fill={tone.accent} />
    </svg>
  );
}

const scenes: Record<string, ReactNode> = {
  "harbor-plot": (
    <>
      <rect width="200" height="200" fill="#d7f1fb" />
      <path d="M0 128c24-16 40-16 64 0s40 16 64 0 40-16 72 0v72H0z" fill="#0070a1" />
      <path d="M0 146c28-12 44-12 68 0s40 14 68 0 36-12 64 0v54H0z" fill="#00a8e8" />
      <rect x="28" y="58" width="78" height="62" rx="4" fill="#f7fbfd" stroke="#0070a1" strokeWidth="4" />
      <path d="M28 84h78M54 58v62M80 58v62" stroke="#00a8e8" strokeWidth="3" />
      <rect x="118" y="96" width="54" height="8" rx="2" fill="#c2410c" />
      <rect x="136" y="78" width="8" height="26" fill="#b45309" />
    </>
  ),
  "iris-blade": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M92 18h16l8 108H84z" fill="#f4f8fb" stroke="#0070a1" strokeWidth="4" />
      <path d="M100 22v100" stroke="#00a8e8" strokeWidth="4" />
      <rect x="62" y="124" width="76" height="14" rx="3" fill="#0070a1" />
      <rect x="90" y="138" width="20" height="36" rx="2" fill="#c2410c" />
      <circle cx="100" cy="182" r="8" fill="#00a8e8" />
    </>
  ),
  "cyan-sigil": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M100 24l58 34v68l-58 34-58-34V58z" fill="#f7fbfd" stroke="#0070a1" strokeWidth="5" />
      <path d="M100 52l34 20v40l-34 20-34-20V72z" fill="#00a8e8" />
      <path d="M100 74l16 10v20l-16 10-16-10V84z" fill="#f7fbfd" />
    </>
  ),
  "market-stall": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M28 78l72-36 72 36v14H28z" fill="#c2410c" />
      <path d="M28 78l24-12v26H28zm48-24l24-12v38H76zm48-12l24 12v14h-24z" fill="#00a8e8" />
      <rect x="40" y="100" width="120" height="58" rx="3" fill="#f7fbfd" stroke="#0070a1" strokeWidth="4" />
      <path d="M40 124h120" stroke="#00a8e8" strokeWidth="4" />
      <rect x="58" y="136" width="22" height="22" fill="#0070a1" />
      <rect x="90" y="136" width="22" height="22" fill="#00aff7" />
      <rect x="122" y="136" width="22" height="22" fill="#c2410c" />
    </>
  ),
  "mesh-ridge": (
    <>
      <rect width="200" height="200" fill="#d7f1fb" />
      <path d="M0 150l48-70 36 40 28-52 40 46 48-28v114H0z" fill="#0070a1" />
      <path d="M48 80l36 40 8-14 20 26-28 8z" fill="#00a8e8" />
      <path d="M16 168h168M16 168l28-40M60 168l20-36M100 168l8-28M140 168l24-32M184 168l-16-20" stroke="#f7fbfd" strokeWidth="2" />
      <circle cx="150" cy="42" r="16" fill="#00aff7" />
    </>
  ),
  "royalties-mark": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <circle cx="100" cy="100" r="68" fill="#0070a1" />
      <circle cx="100" cy="100" r="50" fill="#f7fbfd" />
      <circle cx="100" cy="100" r="32" fill="none" stroke="#00a8e8" strokeWidth="8" />
      <path d="M100 68v64M84 96c8-16 24-16 32 0s8 28 0 36-28 4-32-8" fill="none" stroke="#c2410c" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  "runner-frame": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <rect x="36" y="28" width="128" height="144" rx="64" fill="none" stroke="#0070a1" strokeWidth="8" />
      <circle cx="100" cy="78" r="18" fill="#00a8e8" />
      <path d="M68 142c6-28 20-40 32-40s26 12 32 40" fill="#0070a1" />
      <path d="M46 118h18M136 118h18" stroke="#c2410c" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  "fast-path-pass": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M28 58h144v28a12 12 0 0 0 0 24v28H28v-28a12 12 0 0 0 0-24z" fill="#f7fbfd" stroke="#0070a1" strokeWidth="4" />
      <path d="M48 58v84" stroke="#00a8e8" strokeWidth="4" strokeDasharray="6 6" />
      <path d="M78 92h62M78 108h40" stroke="#0070a1" strokeWidth="6" strokeLinecap="round" />
      <circle cx="152" cy="100" r="8" fill="#c2410c" />
    </>
  ),
  "dock-lantern": (
    <>
      <rect width="200" height="200" fill="#d7f1fb" />
      <path d="M0 150c30-18 50-8 80 0s50 16 70 0 30-14 50 0v50H0z" fill="#0070a1" />
      <rect x="96" y="36" width="8" height="70" fill="#b45309" />
      <path d="M78 70h44l-6 36H84z" fill="#f0c24b" stroke="#c2410c" strokeWidth="4" />
      <path d="M86 106h28" stroke="#c2410c" strokeWidth="4" />
      <circle cx="100" cy="88" r="6" fill="#fff7d6" />
    </>
  ),
  "tide-crate": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M0 156c28-16 48-6 76 2s52 10 76-4 28-12 48 2v44H0z" fill="#00a8e8" />
      <rect x="48" y="58" width="104" height="78" rx="4" fill="#c2410c" stroke="#7c2d12" strokeWidth="4" />
      <path d="M48 84h104M48 110h104M86 58v78M124 58v78" stroke="#f7fbfd" strokeWidth="4" />
      <rect x="70" y="46" width="60" height="16" rx="3" fill="#0070a1" />
    </>
  ),
  "quay-charter": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <rect x="46" y="28" width="108" height="144" rx="6" fill="#f7fbfd" stroke="#0070a1" strokeWidth="4" />
      <path d="M64 58h72M64 78h72M64 98h48" stroke="#00a8e8" strokeWidth="6" strokeLinecap="round" />
      <circle cx="124" cy="132" r="22" fill="#c2410c" />
      <path d="M114 132h20M124 122v20" stroke="#f7fbfd" strokeWidth="4" />
    </>
  ),
  "trail-band": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M36 100c0-40 28-64 64-64s64 24 64 64-28 64-64 64-64-24-64-64z" fill="none" stroke="#0070a1" strokeWidth="16" />
      <path d="M46 100c0-32 22-50 54-50" fill="none" stroke="#34d399" strokeWidth="8" strokeLinecap="round" />
      <rect x="78" y="86" width="44" height="28" rx="6" fill="#f7fbfd" stroke="#0070a1" strokeWidth="4" />
    </>
  ),
  "ridge-sprint": (
    <>
      <rect width="200" height="200" fill="#d7f1fb" />
      <path d="M0 160l50-46 30 24 28-58 42 40 50-22v102H0z" fill="#0070a1" />
      <path d="M28 118c22-8 36-28 48-28 10 0 14 10 22 10 16 0 28-20 48-16 8 2 14 10 14 18v22H40z" fill="#34d399" />
      <circle cx="148" cy="92" r="10" fill="#064e3b" />
      <path d="M40 124l-16 20M70 128l-8 22M108 130l6 22" stroke="#064e3b" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  "cliff-token": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <circle cx="100" cy="100" r="68" fill="#0070a1" />
      <circle cx="100" cy="100" r="52" fill="#f7fbfd" />
      <path d="M78 128l22-64 22 64" fill="none" stroke="#00a8e8" strokeWidth="8" strokeLinejoin="round" />
      <path d="M70 128h60" stroke="#c2410c" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  "scout-pin": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <circle cx="100" cy="86" r="48" fill="#f7fbfd" stroke="#0070a1" strokeWidth="6" />
      <circle cx="100" cy="74" r="10" fill="#00a8e8" />
      <path d="M82 104c4-12 12-16 18-16s14 4 18 16" fill="#0070a1" />
      <path d="M100 134l18 36H82z" fill="#c2410c" />
    </>
  ),
  "keeper-cloak": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M100 36l62 28-18 104H56L38 64z" fill="#0070a1" />
      <path d="M100 36l40 22v18L100 96 60 76V58z" fill="#00a8e8" />
      <circle cx="100" cy="58" r="8" fill="#f0c24b" />
      <path d="M84 120h32" stroke="#f7fbfd" strokeWidth="4" />
    </>
  ),
  "oath-seal": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <circle cx="100" cy="104" r="58" fill="#c2410c" />
      <circle cx="100" cy="104" r="40" fill="none" stroke="#f7fbfd" strokeWidth="4" />
      <path d="M100 78l8 18h18l-14 12 6 18-18-10-18 10 6-18-14-12h18z" fill="#f0c24b" />
    </>
  ),
  "vault-key": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <circle cx="72" cy="88" r="32" fill="none" stroke="#f0c24b" strokeWidth="12" />
      <circle cx="72" cy="88" r="10" fill="#0070a1" />
      <rect x="100" y="80" width="72" height="16" rx="3" fill="#f0c24b" />
      <rect x="142" y="96" width="10" height="22" fill="#f0c24b" />
      <rect x="160" y="96" width="10" height="16" fill="#f0c24b" />
    </>
  ),
  "glass-edge": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M108 16l10 120H86L96 16z" fill="#dbeafe" stroke="#0070a1" strokeWidth="4" />
      <path d="M102 24l8 100" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
      <rect x="70" y="132" width="60" height="12" rx="2" fill="#fb7185" />
      <rect x="92" y="144" width="16" height="32" rx="2" fill="#0070a1" />
    </>
  ),
  "practice-hilt": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <rect x="94" y="28" width="12" height="70" rx="2" fill="#94a3b8" />
      <rect x="58" y="96" width="84" height="16" rx="3" fill="#0070a1" />
      <rect x="90" y="112" width="20" height="52" rx="3" fill="#c2410c" />
      <circle cx="100" cy="172" r="8" fill="#00a8e8" />
    </>
  ),
  "duelist-wrap": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M48 120c20-48 40-64 52-64s32 16 52 64c8 20-4 36-20 36H68c-16 0-28-16-20-36z" fill="#f7fbfd" stroke="#0070a1" strokeWidth="4" />
      <path d="M64 96h72M70 114h60M78 132h44" stroke="#fb7185" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  "armory-pass": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <rect x="28" y="52" width="144" height="96" rx="8" fill="#f7fbfd" stroke="#fb7185" strokeWidth="4" />
      <path d="M28 84h144" stroke="#0070a1" strokeWidth="4" />
      <path d="M48 108h70M48 124h46" stroke="#0070a1" strokeWidth="6" strokeLinecap="round" />
      <circle cx="148" cy="116" r="12" fill="#00a8e8" />
    </>
  ),
  "basin-claim": (
    <>
      <rect width="200" height="200" fill="#d7f1fb" />
      <path d="M0 150L46 48l28 36L100 40l36 62 28-24 36 72v14H0z" fill="#0f766e" />
      <path d="M40 150c20-28 36-28 56 0h48c-8-48-28-72-52-72s-48 28-52 72z" fill="#5eead4" />
      <rect x="92" y="118" width="16" height="36" fill="#c2410c" />
      <circle cx="100" cy="112" r="8" fill="#f0c24b" />
    </>
  ),
  "survey-pin": (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <path d="M100 28c28 0 46 20 46 44 0 32-46 86-46 86S54 104 54 72c0-24 18-44 46-44z" fill="#2dd4bf" stroke="#0f766e" strokeWidth="4" />
      <circle cx="100" cy="72" r="14" fill="#f7fbfd" />
    </>
  ),
  "ridge-camp": (
    <>
      <rect width="200" height="200" fill="#d7f1fb" />
      <path d="M0 158l70-52 130 52v42H0z" fill="#0f766e" />
      <path d="M48 150l52-64 52 64z" fill="#f7fbfd" stroke="#0070a1" strokeWidth="4" />
      <path d="M100 86v64" stroke="#c2410c" strokeWidth="4" />
      <rect x="88" y="128" width="24" height="22" fill="#0070a1" />
    </>
  ),
  cartographer: (
    <>
      <rect width="200" height="200" fill="#e7f6fc" />
      <circle cx="100" cy="62" r="22" fill="#00a8e8" />
      <path d="M52 168c8-40 24-58 48-58s40 18 48 58" fill="#0f766e" />
      <rect x="62" y="108" width="76" height="48" rx="4" fill="#f7fbfd" stroke="#0070a1" strokeWidth="4" />
      <path d="M74 122h52M74 136h36" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  "heat-lane": (
    <>
      <rect width="200" height="200" fill="#1b1030" />
      <path d="M30 170L70 30h16L46 170z" fill="#6d28d9" />
      <path d="M92 170l40-140h16l-40 140z" fill="#c084fc" />
      <path d="M154 170l16-140h16L170 170z" fill="#e9d5ff" />
      <circle cx="154" cy="46" r="8" fill="#fb7185" />
    </>
  ),
  "podium-frame": (
    <>
      <rect width="200" height="200" fill="#1b1030" />
      <rect x="36" y="108" width="40" height="52" fill="#6d28d9" />
      <rect x="80" y="78" width="40" height="82" fill="#c084fc" />
      <rect x="124" y="96" width="40" height="64" fill="#6d28d9" />
      <circle cx="100" cy="48" r="18" fill="none" stroke="#f0c24b" strokeWidth="6" />
    </>
  ),
  "sprint-core": (
    <>
      <rect width="200" height="200" fill="#1b1030" />
      <path d="M100 28l52 32v64l-52 32-52-32V60z" fill="#6d28d9" stroke="#e9d5ff" strokeWidth="4" />
      <path d="M100 58l28 18v36l-28 18-28-18V76z" fill="#c084fc" />
      <circle cx="100" cy="100" r="10" fill="#f7fbfd" />
    </>
  ),
  "champion-mount": (
    <>
      <rect width="200" height="200" fill="#1b1030" />
      <path d="M24 132c28-10 40-36 58-36 8 0 16 8 28 8 22 0 36-24 62-16l8 18-20 28H36z" fill="#c084fc" />
      <circle cx="158" cy="86" r="12" fill="#f0c24b" />
      <path d="M146 62l8-20 10 16" fill="#f0c24b" />
      <path d="M40 140l-12 24M78 144l-4 24M120 146l8 22M156 140l14 18" stroke="#e9d5ff" strokeWidth="5" strokeLinecap="round" />
    </>
  ),
};
