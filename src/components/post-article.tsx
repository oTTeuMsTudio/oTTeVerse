import { ArchitectureStack } from "@/components/architecture-stack";
import type { ArticleBlock, DefinitionSection } from "@/lib/definition";
import type { Post } from "@/lib/posts";

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
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
              className="rounded bg-[#f4f4f4] px-1 py-0.5 font-mono text-[0.9em]"
            >
              {part.slice(1, -1)}
            </code>
          );
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
    <div className="mt-5 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-sm">
        <thead>
          <tr className="bg-[#f4f4f4] text-left">
            {headers.map((header) => (
              <th key={header} className="border border-line px-3 py-2 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")}>
              {row.map((cell) => (
                <td key={cell} className="border border-line px-3 py-2 align-top">
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

function Blocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p
              key={`p-${index}`}
              className={index === 0 ? "mt-3 text-base leading-7" : "mt-4 text-base leading-7"}
            >
              <RichText text={block.text} />
            </p>
          );
        }
        if (block.type === "bullets") {
          return (
            <ul
              key={`ul-${index}`}
              className="mt-4 list-disc space-y-2 pl-5 text-base leading-7"
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
            <pre
              key={`code-${index}`}
              className="mt-4 overflow-x-auto rounded-md border border-line bg-[#f4f4f4] px-4 py-3 font-mono text-sm leading-6"
            >
              {block.text}
            </pre>
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
        return (
          <ol
            key={`steps-${index}`}
            className="mt-4 list-decimal space-y-3 pl-5 text-base leading-7"
          >
            {block.items.map((step) => (
              <li key={step.title}>
                <RichText text={step.title} />
                {step.bullets ? (
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    {step.bullets.map((item) => (
                      <li key={item}>
                        <RichText text={item} />
                      </li>
                    ))}
                  </ul>
                ) : null}
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
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-10 pb-20">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
        Blog
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-muted">
        <time dateTime={post.date}>{post.dateLabel}</time>
      </p>
      <div className="mt-6 space-y-4 text-base leading-7 text-foreground">
        {lead.map((paragraph) => (
          <p key={paragraph}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mt-12 scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
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
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7">
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
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7">
              {section.crates.map((crate) => (
                <li key={crate.name}>
                  <span className="font-mono text-sm">{crate.name}</span>
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
