import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { StackedSection } from "@/components/layout/stacked-section";
import { SectionLabel } from "@/components/layout/section-label";

const AUDIENCES = [
  {
    who: "Families",
    body: "Grandparents’ portraits, wedding prints, school photos. Bring the faces back before the paper fades any further.",
    href: "/restore-family-photos",
    link: "Restoring family photos",
  },
  {
    who: "Genealogists",
    body: "Clearer ancestor portraits for your family tree, reunion slideshows and research notes.",
    href: "/for/genealogists",
    link: "Magic Memory for genealogists",
  },
  {
    who: "Photographers",
    body: "Offer restoration as a quick add-on when clients bring in old scans or a box of prints.",
    href: "/for/photographers",
    link: "Magic Memory for photographers",
  },
];

export function AudienceSection() {
  return (
    <StackedSection>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <div>
          <SectionLabel index="03">Who it&rsquo;s for</SectionLabel>
        </div>
        <div>
          <h2 className="font-serif text-[clamp(2.5rem,4.8vw,4.75rem)] leading-[1] tracking-[-0.02em] text-paper">
            <span className="sm:block">For the shoebox,</span>{" "}
            <span className="sm:block">the family tree</span>{" "}
            <span className="italic text-paper/55 sm:block">and the client folder.</span>
          </h2>
        </div>
      </div>

      <ul className="mt-16 grid gap-x-10 gap-y-12 md:mt-24 md:grid-cols-3">
        {AUDIENCES.map((item) => (
          <li key={item.who} className="border-t border-paper/15 pt-6">
            <h3 className="text-[22px] font-medium tracking-[-0.01em] text-paper">{item.who}</h3>
            <p className="mt-3 max-w-[34ch] text-[15px] leading-[1.65] text-paper/60">{item.body}</p>
            <Link
              href={item.href}
              className="group mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-paper/85 transition-colors hover:text-paper"
            >
              <span className="mm-underline">{item.link}</span>
              <ArrowUpRight
                className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-20 grid gap-px overflow-hidden rounded-[20px] bg-paper/10 md:mt-28 md:grid-cols-2">
        <div className="bg-surface p-7 sm:p-9">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ember">Works best on</p>
          <p className="mt-4 text-[17px] leading-[1.6] text-paper/85">
            Photos where faces are visible: portraits, couples, family groups,
            old ID and school pictures.
          </p>
        </div>
        <div className="bg-surface p-7 sm:p-9">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/45">Less helpful for</p>
          <p className="mt-4 text-[17px] leading-[1.6] text-paper/65">
            Landscapes, buildings or documents with no people in them. The
            model is built to restore faces, so that&rsquo;s where it shines.
          </p>
        </div>
      </div>
    </StackedSection>
  );
}
