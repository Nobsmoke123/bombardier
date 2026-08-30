"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="light"
        position="bottom-right"
        closeButton
        toastOptions={{
          style: {
            background: "#FFFBF4",
            color: "#1C1915",
            border: "1px solid #D8D0C2",
            boxShadow: "none",
            borderRadius: "2px",
          },
        }}
      />
    </QueryClientProvider>
  );
}
