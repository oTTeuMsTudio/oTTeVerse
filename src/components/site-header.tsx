import { SiteMenu } from "@/components/site-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <SiteMenu />
    </header>
  );
}
