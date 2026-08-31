"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, useTheme } from "next-themes";
import { useState, type ReactNode } from "react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        <ThemedToaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return (
    <Toaster
      theme={dark ? "dark" : "light"}
      position="bottom-right"
      closeButton
      toastOptions={{
        style: {
          background: dark ? "#111113" : "#FFFFFF",
          color: dark ? "#FAFAFA" : "#000000",
          border: `1px solid ${dark ? "#27272A" : "#D2D2D7"}`,
          boxShadow: "none",
          borderRadius: "2px",
        },
      }}
    />
  );
}
