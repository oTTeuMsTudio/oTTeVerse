import { HomeHero } from "@/components/home-hero";
import { description } from "@/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to oTTeVerse",
  description,
  openGraph: {
    title: "Welcome to oTTeVerse",
    description,
  },
  twitter: {
    title: "Welcome to oTTeVerse",
    description,
  },
};

export default function Page() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <HomeHero />
    </main>
  );
}
