"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { CREDIT_PACKAGES, type PackageType } from "@/lib/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SignUpButton, useUser } from "@clerk/nextjs";

interface PricingCardsProps {
  isSignedIn: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function PricingCards({ isSignedIn }: PricingCardsProps) {
  const router = useRouter();
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
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      className="mt-16 grid gap-8 lg:grid-cols-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      {/* Free Tier */}
      <motion.div variants={cardVariants}>
        <Card className="relative border-border h-full flex flex-col">
          <CardHeader className="pb-4">
            <h3 className="text-xl font-semibold">Free</h3>
            <div className="mt-4">
              <span className="text-4xl font-bold">€0</span>
              <span className="text-muted-foreground">/day</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Perfect for trying out
            </p>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>1 restoration per day</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>Resets every 24 hours</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>High-quality results</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="mt-auto">
            {isSignedIn ? (
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => router.push("/restore")}
              >
                Go to Restore
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button
                  variant="outline"
                  size="default"
                  className="w-full bg-transparent"
                >
                  Get Started Free
                </Button>
              </SignUpButton>
            )}
          </CardFooter>
        </Card>
      </motion.div>

      {/* Paid Tiers */}
      {(
        Object.entries(CREDIT_PACKAGES) as [
          PackageType,
          (typeof CREDIT_PACKAGES)[PackageType]
        ][]
      ).map(([key, pkg]) => (
        <motion.div key={key} variants={cardVariants}>
          <Card
            className={`relative h-full flex flex-col ${
              pkg.popular
                ? "border-primary shadow-lg ring-1 ring-primary"
                : "border-border"
            }`}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader className="pb-4">
              <h3 className="text-xl font-semibold">{pkg.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">{pkg.priceDisplay}</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {pkg.description}
              </p>
            </CardHeader>
            <CardContent className="pb-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <Check className="h-4 w-4 text-primary" />
                  <span>{pkg.credits} photo restorations</span>
                </li>
                {pkg.features.slice(1).map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              {isSignedIn ? (
                <Button
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handlePurchase(key)}
                  disabled={loading === key}
                >
                  {loading === key ? "Loading..." : `Purchase ${pkg.name}`}
                </Button>
              ) : (
                <SignUpButton mode="modal">
                  <Button
                    variant={pkg.popular ? "default" : "outline"}
                    size="default"
                    className="w-full"
                  >
                    {isLoaded ? "Sign Up to Purchase" : "Loading..."}
                  </Button>
                </SignUpButton>
              )}
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
