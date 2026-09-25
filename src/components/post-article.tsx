import Link from "next/link";
import { ArchitectureStack } from "@/components/architecture-stack";
import type {
  ArticleBlock,
  CalloutTone,
  DefinitionSection,
} from "@/lib/definition";
import type { Post } from "@/lib/posts";

const CALLOUT: Record<
  CalloutTone,
  { wrap: string; kicker: string; label: string }
> = {
  info: {
    wrap: "border-button bg-[#eef5fc]",
    kicker: "text-button",
    label: "Note",
  },
  tip: {
    wrap: "border-tip bg-[#ecfdf8]",
    kicker: "text-tip",
    label: "Tip",
  },
  warn: {
    wrap: "border-warn bg-[#fff7ed]",
    kicker: "text-warn",
    label: "Watch out",
  },
  rust: {
    wrap: "border-rust bg-[#fff4ed]",
    kicker: "text-rust",
    label: "Rust",
  },
  ue: {
    wrap: "border-button bg-[#e8f4fa]",
    kicker: "text-button",
    label: "UE 5.8",
  },
};

function RichText({ text }: { text: string }) {
  const parts = text.split(
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g,
  );
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="rounded bg-[#eef5fc] px-1.5 py-0.5 font-mono text-[0.9em] text-button"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("[") && part.includes("](")) {
          const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
          if (match) {
            const href = match[2];
            const label = match[1];
            const className =
              "font-medium text-button underline decoration-button/40 underline-offset-4 hover:text-button-hover";
            if (href.startsWith("/")) {
              return (
                <Link key={index} href={href} className={className}>
                  {label}
                </Link>
              );
            }
            return (
              <a key={index} href={href} className={className}>
                {label}
              </a>
            );
          }
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function Table({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[28rem] border-collapse text-sm">
        <thead>
          <tr className="bg-[#e8f4fa] text-left">
            {headers.map((header) => (
              <th
                key={header}
                className="border-b border-line px-3 py-2.5 font-semibold text-button"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={`${rowIndex}-${row.join("|")}`}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#f7fbfd]"}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}-${cell}`}
                  className={`px-3 py-2.5 align-top ${rowIndex < rows.length - 1 ? "border-b border-line" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Callout({
  tone,
  title,
  text,
}: {
  tone: CalloutTone;
  title: string;
  text: string;
}) {
  const style = CALLOUT[tone];
  return (
    <aside
      className={`mt-5 rounded-lg border-l-4 px-4 py-3 ${style.wrap}`}
      aria-label={title || style.label}
    >
      <p
        className={`text-[11px] font-semibold tracking-[0.14em] uppercase ${style.kicker}`}
      >
        {title || style.label}
      </p>
      <p className="mt-1.5 text-base leading-7 text-foreground">
        <RichText text={text} />
      </p>
    </aside>
  );
}

function Blocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={`p-${index}`}
              className={
                index === 0
                  ? "mt-3 text-base leading-7"
                  : "mt-4 text-base leading-7"
              }
            >
              <RichText text={block.text} />
            </p>
          );
        }
        if (block.type === "bullets") {
          return (
            <ul
              key={`ul-${index}`}
              className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 marker:text-cyan"
            >
              {block.items.map((item) => (
                <li key={item}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "code") {
          return (
            <figure key={`code-${index}`} className="mt-5 overflow-hidden rounded-lg border border-line">
              {block.label ? (
                <figcaption className="border-b border-line bg-button px-4 py-1.5 font-mono text-xs font-medium tracking-wide text-white">
                  {block.label}
                </figcaption>
              ) : null}
              <pre className="overflow-x-auto bg-[#f4f8fb] px-4 py-3 font-mono text-sm leading-6 text-[#123]">
                {block.text}
              </pre>
            </figure>
          );
        }
        if (block.type === "table") {
          return (
            <Table
              key={`table-${index}`}
              headers={block.table.headers}
              rows={block.table.rows}
            />
          );
        }
        if (block.type === "callout") {
          return (
            <Callout
              key={`callout-${index}`}
              tone={block.tone}
              title={block.title}
              text={block.text}
            />
          );
        }
        if (block.type === "toc") {
          return (
            <nav
              key={`toc-${index}`}
              aria-label="On this page"
              className="mt-6 rounded-xl border border-[#c5ddf5] bg-[#f4f8fd] px-5 py-4"
            >
              <p className="text-[11px] font-semibold tracking-[0.14em] text-button uppercase">
                On this page
              </p>
              <ol className="mt-3 list-none space-y-2 pl-0">
                {block.items.map((item, itemIndex) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="group flex items-baseline gap-3 text-sm leading-6 text-foreground hover:text-button"
                    >
                      <span className="w-6 shrink-0 font-mono text-xs font-semibold text-cyan">
                        {String(itemIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="underline-offset-4 group-hover:underline">
                        {item.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          );
        }
        if (block.type === "subheading") {
          return (
            <h3
              key={`h3-${index}`}
              className="mt-8 text-lg font-semibold tracking-tight text-button"
            >
              {block.text}
            </h3>
          );
        }
        return (
          <ol
            key={`steps-${index}`}
            className="mt-5 list-none space-y-4 pl-0"
          >
            {block.items.map((step, stepIndex) => (
              <li key={step.title} className="flex gap-3">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan text-xs font-semibold text-white"
                  aria-hidden="true"
                >
                  {stepIndex + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-base leading-7">
                    <RichText text={step.title} />
                  </p>
                  {step.bullets ? (
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-base leading-7 marker:text-cyan">
                      {step.bullets.map((item) => (
                        <li key={item}>
                          <RichText text={item} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        );
      })}
    </>
  );
}

export function PostArticle({
  post,
  lead,
  sections,
}: {
  post: Post;
  lead: string[];
  sections: DefinitionSection[];
}) {
  const kicker = post.kicker ?? "Blog";
  const isTutorial = kicker === "Tutorial";

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-10 pb-20">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
        {kicker}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-muted">
        <time dateTime={post.date}>{post.dateLabel}</time>
      </p>
      <div
        className={
          isTutorial
            ? "mt-6 space-y-4 rounded-xl border border-line bg-[#fbfdff] px-5 py-4 text-base leading-7 text-foreground"
            : "mt-6 space-y-4 text-base leading-7 text-foreground"
        }
      >
        {lead.map((paragraph) => (
          <p key={paragraph}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mt-12 scroll-mt-24">
          <h2 className="border-l-4 border-cyan pl-3 text-xl font-semibold tracking-tight">
            {section.title}
          </h2>
          {section.blocks ? <Blocks blocks={section.blocks} /> : null}
          {section.lead ? (
            <p className="mt-3 text-base leading-7">
              <RichText text={section.lead} />
            </p>
          ) : null}
          {section.id === "stack" ? (
            <div className="mt-5">
              <ArchitectureStack />
            </div>
          ) : null}
          {section.bullets ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 marker:text-cyan">
              {section.bullets.map((item) => (
                <li key={item}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          ) : null}
          {section.table ? (
            <Table headers={section.table.headers} rows={section.table.rows} />
          ) : null}
          {section.crates ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 marker:text-cyan">
              {section.crates.map((crate) => (
                <li key={crate.name}>
                  <span className="font-mono text-sm text-button">{crate.name}</span>
                  {crate.role ? (
                    <>
                      {" — "}
                      {crate.role}
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
          {section.body ? (
            <p className="mt-4 text-base leading-7">
              <RichText text={section.body} />
            </p>
          ) : null}
        </section>
      ))}
    </article>
  );
}
