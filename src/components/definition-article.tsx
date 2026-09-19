import { ArchitectureStack } from "@/components/architecture-stack";
import { lead, sections } from "@/lib/definition";
import { featuredPost } from "@/lib/posts";

function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function DefinitionArticle() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-10 pb-20">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
        Blog
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {featuredPost.title}
      </h1>
      <p className="mt-3 text-sm text-muted">
        <time dateTime={featuredPost.date}>{featuredPost.dateLabel}</time>
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
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[28rem] border-collapse text-sm">
                <thead>
                  <tr className="bg-[#f4f4f4] text-left">
                    {section.table.headers.map((header) => (
                      <th
                        key={header}
                        className="border border-line px-3 py-2 font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row) => (
                    <tr key={row.join("|")}>
                      {row.map((cell) => (
                        <td
                          key={cell}
                          className="border border-line px-3 py-2 align-top"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
