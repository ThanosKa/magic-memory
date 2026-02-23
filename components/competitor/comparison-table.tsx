import type { CompetitorFeature } from "@/lib/competitors/data";

type ComparisonTableProps = {
  competitorName: string;
  features: CompetitorFeature[];
};

export function ComparisonTable({ competitorName, features }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-6 py-4 text-left font-semibold text-muted-foreground">Feature</th>
            <th className="px-6 py-4 text-center font-semibold">Magic Memory</th>
            <th className="px-6 py-4 text-center font-semibold text-muted-foreground">
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((row, i) => (
            <tr
              key={row.label}
              className={`border-b border-border last:border-0 ${
                i % 2 === 0 ? "bg-background" : "bg-muted/20"
              }`}
            >
              <td className="px-6 py-4 font-medium">{row.label}</td>
              <td className="px-6 py-4 text-center text-primary font-medium">{row.magicMemory}</td>
              <td className="px-6 py-4 text-center text-muted-foreground">{row.competitor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
