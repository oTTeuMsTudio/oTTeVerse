import { SiteMenu } from "@/components/site-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 shadow-[0_0_14px_rgba(0,0,0,0.5)]">
      <SiteMenu />
    </header>
  );
}
