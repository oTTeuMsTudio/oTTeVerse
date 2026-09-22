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
  lead as schedulerLead,
  sections as schedulerSections,
} from "@/lib/block-stm-scheduler";
import {
  lead as moveVmLead,
  sections as moveVmSections,
} from "@/lib/move-vm-execution";
import {
  lead as blockStmSuiLead,
  sections as blockStmSuiSections,
} from "@/lib/comparing-block-stm-sui";
import {
  lead as mysticetiLead,
  sections as mysticetiSections,
} from "@/lib/mysticeti-consensus";
import {
  lead as belugaLead,
  sections as belugaSections,
} from "@/lib/beluga-synchronizer";
import {
  lead as ue58Lead,
  sections as ue58Sections,
} from "@/lib/ue58-game-rust-blockchain";
import {
  lead as modernNftsLead,
  sections as modernNftsSections,
} from "@/lib/modern-nfts";
import {
  belugaPost,
  blockStmSuiPost,
  featuredPost,
  getPost,
  moveVmPost,
  modernNftsPost,
  mysticetiPost,
  mvccPost,
  parallelPost,
  posts,
  schedulerPost,
  ue58Post,
} from "@/lib/posts";

const content = {
  [featuredPost.slug]: { lead: definitionLead, sections: definitionSections },
  [parallelPost.slug]: { lead: parallelLead, sections: parallelSections },
  [mvccPost.slug]: { lead: mvccLead, sections: mvccSections },
  [schedulerPost.slug]: { lead: schedulerLead, sections: schedulerSections },
  [moveVmPost.slug]: { lead: moveVmLead, sections: moveVmSections },
  [blockStmSuiPost.slug]: {
    lead: blockStmSuiLead,
    sections: blockStmSuiSections,
  },
  [mysticetiPost.slug]: {
    lead: mysticetiLead,
    sections: mysticetiSections,
  },
  [belugaPost.slug]: {
    lead: belugaLead,
    sections: belugaSections,
  },
  [ue58Post.slug]: {
    lead: ue58Lead,
    sections: ue58Sections,
  },
  [modernNftsPost.slug]: {
    lead: modernNftsLead,
    sections: modernNftsSections,
  },
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
