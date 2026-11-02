"use client";

import Link from "next/link";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StartButtonProps = {
  label?: string;
  signedInLabel?: string;
  className?: string;
};

const pillClass =
  "group inline-flex h-12 items-center gap-2.5 rounded-full bg-paper px-6 text-[15px] font-medium text-ink transition-[filter,transform] duration-200 hover:brightness-105 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

function PillContent({ label }: { label: string }) {
  return (
    <>
      <span>{label}</span>
      <ArrowRight
        className="size-4 transition-transform duration-200 group-hover:translate-x-1"
        aria-hidden="true"
      />
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
