import { Upload, Sparkles, Download } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { SectionLabel } from "@/components/layout/section-label";

const steps = [
  {
    icon: Upload,
    step: "1",
    title: "Upload Your Photo",
    description: "Upload a JPEG, PNG, or WebP photo up to 10MB.",
  },
  {
    icon: Sparkles,
    step: "2",
    title: "AI Restores It",
    description: "GFPGAN AI restores faces and enhances photo quality in 5–15 seconds.",
  },
  {
    icon: Download,
    step: "3",
    title: "Download Your Result",
    description: "Download your restored photo in full resolution, ready to share or print.",
  },
];

export function UseCaseHowItWorks() {
  return (
    <section className="border-t border-paper/10">
      <PageContainer className="py-24 md:py-32">
        <div>
          <SectionLabel index="02">Process</SectionLabel>
          <h2 className="font-serif mt-6 text-[clamp(2.25rem,4.4vw,4rem)] leading-[1] tracking-[-0.02em] text-paper">
            How it works
          </h2>
          <p className="mt-4 text-lg text-paper/70">
            Three steps to restore your photo in seconds.
          </p>
        </div>
        <ol className="mt-14 grid gap-3 md:grid-cols-3">
          {steps.map((item) => (
            <li key={item.step}>
              <div className="h-full rounded-[6px] bg-surface-2 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <item.icon className="size-7 text-ember" strokeWidth={1.5} aria-hidden="true" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">
                    0{item.step}
                  </span>
                </div>
                <h3 className="mt-8 text-[20px] font-medium tracking-[-0.01em] text-paper">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-paper/70">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </PageContainer>
    </section>
  );
}
