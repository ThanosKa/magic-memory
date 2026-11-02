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
  "group inline-flex h-12 items-center gap-3 rounded-full bg-[#f1eadf] pl-6 pr-2 text-[15px] font-medium text-[#0d0b09] transition-[background-color,transform] duration-200 hover:bg-white active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a36] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0b09]";

function PillContent({ label }: { label: string }) {
  return (
    <>
      <span>{label}</span>
      <span className="flex size-8 items-center justify-center rounded-full bg-[#0d0b09] text-[#f1eadf]">
        <ArrowRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
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
