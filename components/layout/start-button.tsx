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

/** The primary pill: opens sign-up for visitors, links to /restore when signed in. */
const pillClass = buttonVariants({ size: "lg" });

function PillContent({ label }: { label: string }) {
  return (
    <>
      <span>{label}</span>
      <ButtonArrow />
    </>
  );
}

function StartButtonWithClerk({
  label = "Restore a photo free",
  signedInLabel = "Restore a photo",
  className,
}: StartButtonProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (isLoaded && isSignedIn) {
    return (
      <Link href="/restore" className={cn(pillClass, className)}>
        <PillContent label={signedInLabel} />
      </Link>
    );
  }

  return (
    <SignUpButton mode="modal" forceRedirectUrl="/restore">
      <button type="button" className={cn(pillClass, className)}>
        <PillContent label={label} />
      </button>
    </SignUpButton>
  );
}

export function StartButton(props: StartButtonProps) {
  const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!hasClerk) {
    return (
      <Link href="/restore" className={cn(pillClass, props.className)}>
        <PillContent label={props.label ?? "Restore a photo free"} />
      </Link>
    );
  }

  return <StartButtonWithClerk {...props} />;
}
