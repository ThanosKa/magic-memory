"use client";

import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

export function ConditionalClerkProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      signInFallbackRedirectUrl="/restore"
      signUpFallbackRedirectUrl="/restore"
    >
      {children}
    </ClerkProvider>
  );
}
