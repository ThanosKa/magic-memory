"use client";

import Link from "next/link";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { ButtonArrow, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StartButtonProps = {
  label?: string;
  signedInLabel?: string;
  className?: string;
};

type StartButtonWithClerkProps = Required<Omit<StartButtonProps, "className">> &
  Pick<StartButtonProps, "className">;

const PILL_CLASS = buttonVariants({ size: "lg" });
const DEFAULT_LABEL = "Restore a photo free";
const DEFAULT_SIGNED_IN_LABEL = "Restore a photo";

function PillContent({ label }: { label: string }) {
  return (
    <>
      <span>{label}</span>
      <ButtonArrow />
    </>
  );
}

function StartButtonWithClerk({
  label,
  signedInLabel,
  className,
}: StartButtonWithClerkProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (isLoaded && isSignedIn) {
    return (
      <Link href="/restore" className={cn(PILL_CLASS, className)}>
        <PillContent label={signedInLabel} />
      </Link>
    );
  }

  return (
    <SignUpButton mode="modal" forceRedirectUrl="/restore">
      <button type="button" className={cn(PILL_CLASS, className)}>
        <PillContent label={label} />
      </button>
    </SignUpButton>
  );
}

/** The primary pill: opens sign-up for visitors, links to /restore when signed in. */
export function StartButton({
  label = DEFAULT_LABEL,
  signedInLabel = DEFAULT_SIGNED_IN_LABEL,
  className,
}: StartButtonProps) {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!hasClerk) {
    return (
      <Link href="/restore" className={cn(PILL_CLASS, className)}>
        <PillContent label={label} />
      </Link>
    );
  }

  return <StartButtonWithClerk label={label} signedInLabel={signedInLabel} className={className} />;
}
