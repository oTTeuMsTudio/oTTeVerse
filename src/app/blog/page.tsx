import type { Metadata } from "next";
import { DefinitionArticle } from "@/components/definition-article";
import { featuredPost } from "@/lib/posts";

export const metadata: Metadata = {
  title: featuredPost.title,
  description: featuredPost.description,
  openGraph: {
    type: "article",
    title: featuredPost.title,
    description: featuredPost.description,
    publishedTime: featuredPost.date,
  },
  twitter: {
    title: featuredPost.title,
    description: featuredPost.description,
  },
};

export default function BlogPage() {
  return (
    <main id="main">
      <DefinitionArticle />
    </main>
  );
}
