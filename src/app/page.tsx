import { DefinitionPage } from "@/components/definition-page";
import { description, title } from "@/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title,
  description,
};

export default function Page() {
  return (
    <main id="main">
      <DefinitionPage />
    </main>
  );
}
