import Image from "next/image";
import { ArchitectureStack } from "@/components/architecture-stack";
import {
  documentKicker,
  documentTitle,
  lead,
  sections,
} from "@/lib/definition";

export function DefinitionPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-10 pb-20">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-cyan uppercase">
        {documentKicker}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {documentTitle}
      </h1>
      <figure className="mt-6">
        <Image
          src="/banner.jpg"
          alt="oTTeVerse — Build Your Digital Economy in The Metaverse"
          width={1776}
          height={576}
          className="h-auto w-full rounded-md object-cover"
          sizes="(min-width: 768px) 768px, 100vw"
          priority
        />
      </figure>
      <div className="mt-6 space-y-4 text-base leading-7 text-foreground">
        {lead.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mt-12 scroll-mt-24">
          <h2 className="text-xl font-semibold tracking-tight">{section.title}</h2>
          {section.lead ? (
            <p className="mt-3 text-base leading-7">{section.lead}</p>
          ) : null}
          {section.id === "stack" ? (
            <div className="mt-5">
              <ArchitectureStack />
            </div>
          ) : null}
          {section.bullets ? (
            <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
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
                        <td key={cell} className="border border-line px-3 py-2 align-top">
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
                  {" — "}
                  {crate.role}
                </li>
              ))}
            </ul>
          ) : null}
          {section.body ? (
            <p className="mt-4 text-base leading-7">{section.body}</p>
          ) : null}
        </section>
      ))}
    </article>
  );
}
