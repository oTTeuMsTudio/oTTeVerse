import { architectureLayers } from "@/lib/definition";

export function ArchitectureStack() {
  return (
    <ol className="space-y-2">
      {architectureLayers.map((layer, index) => (
        <li key={layer.title}>
          <div className="rounded-md border border-foreground bg-white px-4 py-3">
            <p className="text-sm font-semibold tracking-tight">{layer.title}</p>
            <p className="mt-1 text-sm text-muted">{layer.detail}</p>
          </div>
          {index < architectureLayers.length - 1 ? (
            <p className="py-1 text-center text-xs text-muted">
              {layer.edge ?? "↓"}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
