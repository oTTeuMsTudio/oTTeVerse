import { architectureLayers } from "@/lib/definition";

export function ArchitectureStack() {
  return (
    <ol className="space-y-2 rounded-lg border border-line p-4">
      {architectureLayers.map((layer, index) => (
        <li key={layer.title ?? layer.columns?.map((column) => column.title).join("|")}>
          {layer.columns ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {layer.columns.map((column) => (
                <div
                  key={column.title}
                  className="rounded-md border border-foreground bg-white px-4 py-3"
                >
                  <p className="text-sm font-semibold tracking-tight">{column.title}</p>
                  <p className="mt-1 whitespace-pre-line text-sm text-muted">
                    {column.detail}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-foreground bg-white px-4 py-3">
              <p className="text-sm font-semibold tracking-tight">{layer.title}</p>
              {layer.detail ? (
                <p className="mt-1 whitespace-pre-line text-sm text-muted">
                  {layer.detail}
                </p>
              ) : null}
            </div>
          )}
          {index < architectureLayers.length - 1 ? (
            <p className="py-1 text-center text-xs text-muted">
              {layer.edge ? `↓  ${layer.edge}` : "↓"}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
