import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/post-article";
import {
  lead as definitionLead,
  sections as definitionSections,
} from "@/lib/definition";
import {
  lead as parallelLead,
  sections as parallelSections,
} from "@/lib/parallel-execution";
import {
  lead as mvccLead,
  sections as mvccSections,
} from "@/lib/mvcc-implementation";
import {
  featuredPost,
  getPost,
  mvccPost,
  parallelPost,
  posts,
} from "@/lib/posts";

const content = {
  [featuredPost.slug]: { lead: definitionLead, sections: definitionSections },
  [parallelPost.slug]: { lead: parallelLead, sections: parallelSections },
  [mvccPost.slug]: { lead: mvccLead, sections: mvccSections },
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return {};
  }
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
    twitter: {
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  const article = content[slug];
  if (!post || !article) {
    notFound();
  }
  return (
    <main id="main">
      <PostArticle post={post} lead={article.lead} sections={article.sections} />
    </main>
  );
}
