import type { CompetitorFeature } from "@/lib/competitors/data";

type ComparisonTableProps = {
  competitorName: string;
  features: CompetitorFeature[];
};

/** Feature table on ink. The Magic Memory column is tinted ember; scrolls sideways on narrow screens. */
export function ComparisonTable({ competitorName, features }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[34rem] text-sm">
        <thead>
          <tr className="border-b border-border">
            <th
              scope="col"
              className="px-5 py-4 text-left font-mono text-[11px] font-normal uppercase tracking-[0.18em] text-paper/60 sm:px-6"
            >
              Feature
            </th>
            <th scope="col" className="bg-ember/10 px-5 py-4 text-left font-semibold text-ember sm:px-6">
              Magic Memory
            </th>
            <th scope="col" className="px-5 py-4 text-left font-semibold text-paper/80 sm:px-6">
              {competitorName}
            </th>
          </tr>
        </thead>
        <tbody>
          {features.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th scope="row" className="px-5 py-4 text-left font-medium text-paper sm:px-6">
                {row.label}
              </th>
              <td className="bg-ember/5 px-5 py-4 font-medium text-paper sm:px-6">{row.magicMemory}</td>
              <td className="px-5 py-4 text-paper/70 sm:px-6">{row.competitor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
