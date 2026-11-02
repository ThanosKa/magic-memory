import Image from "next/image";
import { Download, ImageUp } from "lucide-react";
import { StackedSection } from "@/components/layout/stacked-section";
import { SectionLabel } from "@/components/layout/section-label";

function Sprockets() {
  return <div className="mm-sprockets h-[14px] w-full" aria-hidden="true" />;
}

function UploadVisual() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[3px] border border-dashed border-paper/25 bg-paper/[0.03] px-4 text-center">
      <ImageUp className="size-7 text-paper/70" strokeWidth={1.5} aria-hidden="true" />
      <p className="text-[14px] text-paper/80">Drop a photo here</p>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
        JPEG · PNG · WebP · up to 10&nbsp;MB
      </p>
    </div>
  );
}

function RestoreVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-[3px]">
      <Image
        src="/couple-after.png"
        alt=""
        fill
        sizes="(max-width: 768px) 90vw, 30vw"
        className="object-cover object-[60%_40%]"
      />
      <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-[200%]">
          <Image
            src="/couple-before.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 90vw, 30vw"
            className="object-cover object-[60%_40%]"
          />
        </div>
      </div>
      <div className="absolute inset-y-0 left-1/2 w-px bg-ember" aria-hidden="true" />
      <span className="font-mono absolute bottom-2.5 left-2.5 rounded-full bg-ink/70 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-paper/90">
        Rebuilding faces
      </span>
    </div>
  );
}

function DownloadVisual() {
  return (
    <div className="relative h-full overflow-hidden rounded-[3px]">
      <Image
        src="/couple-after.png"
        alt=""
        fill
        sizes="(max-width: 768px) 90vw, 30vw"
        className="origin-[46%_48%] scale-[1.7] object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
      <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[12px] font-medium text-ink">
        <Download className="size-3.5" aria-hidden="true" />
        Download
      </span>
    </div>
  );
}

const STEPS = [
  {
    frame: "01A",
    title: "Upload a photo",
    body: "A phone snap of an old print works. So does a proper scan, which gives the AI more to work with.",
    Visual: UploadVisual,
  },
  {
    frame: "02A",
    title: "AI restores the faces",
    body: "GFPGAN, a face-restoration model from Tencent ARC research, sharpens eyes, skin and hair. Usually 5 to 15 seconds.",
    Visual: RestoreVisual,
  },
  {
    frame: "03A",
    title: "Compare and download",
    body: "Slide between before and after, then save the full-resolution result. Keep it, print it, send it to the family chat.",
    Visual: DownloadVisual,
  },
];

export function HowItWorks() {
  return (
    <StackedSection tone="paper" id="how-it-works">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <SectionLabel index="02" tone="paper">
            How it works
          </SectionLabel>
        </div>
        <div>
          <h2 className="font-serif text-[clamp(2.75rem,5.6vw,5.5rem)] leading-[0.95] tracking-[-0.02em]">
            Upload. <span className="italic text-ink/55">Breathe.</span> Download.
          </h2>
        </div>
      </div>

      <div className="mt-16 md:mt-20">
        <div className="rounded-[6px] bg-ink px-3 py-2 shadow-[0_30px_60px_-30px_rgba(13,11,9,0.55)] sm:px-4">
          <Sprockets />
          <ol className="grid gap-3 py-2 md:grid-cols-3">
            {STEPS.map(({ frame, title, body, Visual }) => (
              <li key={frame} className="flex flex-col gap-5 rounded-[3px] bg-surface-2 p-4 sm:p-5">
                <div className="aspect-[4/3]">
                  <Visual />
                </div>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ember">
                    Frame {frame}
                  </p>
                  <h3 className="mt-2 text-[20px] font-medium tracking-[-0.01em] text-paper">
                    {title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-paper/60">{body}</p>
                </div>
              </li>
            ))}
          </ol>
          <Sprockets />
        </div>
      </div>
    </StackedSection>
  );
}
