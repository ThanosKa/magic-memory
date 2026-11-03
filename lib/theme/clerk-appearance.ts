import type { ComponentProps } from "react"
import type { ClerkProvider } from "@clerk/nextjs"

type Appearance = NonNullable<ComponentProps<typeof ClerkProvider>["appearance"]>

/** Clerk theme: every colour reads from the darkroom palette in app/globals.css. */
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "var(--primary)",
    colorBackground: "var(--card)",
    colorText: "var(--foreground)",
    colorTextSecondary: "var(--muted-foreground)",
    colorTextOnPrimaryBackground: "var(--primary-foreground)",
    colorInputBackground: "var(--surface-2)",
    colorInputText: "var(--foreground)",
    colorNeutral: "var(--paper)",
    colorDanger: "var(--destructive)",
    colorSuccess: "var(--success)",
    colorShimmer: "var(--surface-3)",
    fontFamily: "var(--font-sans)",
    borderRadius: "var(--radius)",
  },
  elements: {
    card: "border border-border shadow-none",
    formFieldInput: "focus:ring-2 focus:ring-ember focus:border-ember",
    formButtonPrimary: "hover:bg-paper-deep",
    footerActionLink: "text-ember hover:text-ember",
    userButtonPopoverCard: "border border-border",
  },
}
