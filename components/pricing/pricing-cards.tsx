"use client";

import { useState } from "react";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { PlanCell, PlanGrid } from "@/components/pricing/plan-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CREDIT_PACKAGES, type PackageType } from "@/lib/constants";
import { cn } from "@/lib/utils";

type PricingCardsProps = {
  isSignedIn: boolean;
};

type FeatureListProps = {
  items: string[];
  popular?: boolean;
  emphasizeFirst?: boolean;
};

function FeatureList({ items, popular = false, emphasizeFirst = false }: FeatureListProps) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item, i) => (
        <li
          key={item}
          className={cn(
            "flex items-start gap-2.5 text-[14px] leading-[1.5]",
            popular ? "text-paper/80" : "text-ink/75",
            emphasizeFirst && i === 0 && "text-[15px] font-medium",
            emphasizeFirst && i === 0 && (popular ? "text-paper" : "text-ink")
          )}
        >
          <Check
            className={cn("mt-0.5 size-4 shrink-0", popular ? "text-ember" : "text-ink")}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function PricingCards({ isSignedIn }: PricingCardsProps) {
  const [loading, setLoading] = useState<PackageType | null>(null);
  const { isLoaded } = useUser();

  const handlePurchase = async (packageType: PackageType) => {
    if (!isSignedIn) return;

    setLoading(packageType);
    try {
      const response = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageType }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session");
        toast.error(
          typeof data.error === "string"
            ? data.error
            : "Could not start checkout. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Could not start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const packages = Object.entries(CREDIT_PACKAGES) as [
    PackageType,
    (typeof CREDIT_PACKAGES)[PackageType]
  ][];

  return (
    <div>
      <PlanGrid>
        {packages.map(([key, pkg], i) => (
          <PlanCell key={key} index={i} popular={pkg.popular}>
            <div className="flex h-6 items-center justify-between gap-3">
              <h3
                className={cn(
                  "font-mono text-[11px] uppercase tracking-[0.2em]",
                  pkg.popular ? "text-paper/70" : "text-ink/65"
                )}
              >
                {pkg.name}
              </h3>
              {pkg.popular && <Badge variant="ember">Most Popular</Badge>}
            </div>
            <p className="font-serif mt-5 text-[56px] leading-none tracking-[-0.02em]">
              {pkg.priceDisplay}
              <span
                className={cn(
                  "font-sans text-[15px] tracking-normal",
                  pkg.popular ? "text-paper/70" : "text-ink/65"
                )}
              >
                {" "}
                one-time
              </span>
            </p>
            <p className={cn("mt-5 text-[14px]", pkg.popular ? "text-paper/70" : "text-ink/65")}>
              {pkg.description}
            </p>
            <FeatureList
              popular={pkg.popular}
              emphasizeFirst
              items={[`${pkg.credits} photo restorations`, ...pkg.features.slice(1)]}
            />
            <div className="mt-auto pt-8">
              {isSignedIn ? (
                <Button
                  tone={pkg.popular ? "dark" : "paper"}
                  className="w-full"
                  onClick={() => handlePurchase(key)}
                  disabled={loading === key}
                >
                  {loading === key ? "Loading..." : `Purchase ${pkg.name}`}
                </Button>
              ) : (
                <SignUpButton mode="modal">
                  <Button tone={pkg.popular ? "dark" : "paper"} className="w-full">
                    {isLoaded ? "Sign Up to Purchase" : "Loading..."}
                  </Button>
                </SignUpButton>
              )}
            </div>
          </PlanCell>
        ))}
      </PlanGrid>
    </div>
  );
}
