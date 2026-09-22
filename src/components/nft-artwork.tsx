import type { ReactNode } from "react";

const frame = "h-full w-full bg-[#e8f7fc]";

export function NftArtwork({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={frame}
    >
      {scenes[id] ?? scenes["harbor-plot"]}
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
      <path
        d="M100 24l58 34v68l-58 34-58-34V58z"
        fill="#f7fbfd"
        stroke="#0070a1"
        strokeWidth="5"
      />
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
      <path
        d="M28 58h144v28a12 12 0 0 0 0 24v28H28v-28a12 12 0 0 0 0-24z"
        fill="#f7fbfd"
        stroke="#0070a1"
        strokeWidth="4"
      />
      <path d="M48 58v84" stroke="#00a8e8" strokeWidth="4" strokeDasharray="6 6" />
      <path d="M78 92h62M78 108h40" stroke="#0070a1" strokeWidth="6" strokeLinecap="round" />
      <circle cx="152" cy="100" r="8" fill="#c2410c" />
    </>
  ),
};
