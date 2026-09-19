import { canIndex, resolveSiteUrl } from "@/lib/site-url.mjs";

export const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "oTTeVerse";
export const title =
  process.env.NEXT_PUBLIC_TITLE || "What oTTeVerse is building";
export const description =
  process.env.NEXT_PUBLIC_DESCRIPTION ||
  "oTTeVerse will and is building a modern Rust blockchain for games and metaverse economies.";
export const baseURL = resolveSiteUrl(process.env);
export const indexable = canIndex(process.env);
