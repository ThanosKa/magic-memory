"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { useMounted } from "@/components/theme/use-mounted";

/** Sonner toasts in the active theme; colours come from the palette tokens. */
export function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  return (
    <Toaster
      theme={mounted && resolvedTheme === "light" ? "light" : "dark"}
      position="top-center"
      toastOptions={{
        classNames: {
          toast: "!bg-surface !text-paper !border-border !rounded-lg !font-sans",
          description: "!text-muted-foreground",
          success: "!text-success",
          error: "!text-destructive",
          actionButton: "!bg-paper !text-ink",
          cancelButton: "!bg-surface-3 !text-paper",
        },
      }}
    />
  );
}
