"use client";

import { AuthorsProvider } from "@/context/AuthorsContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return <AuthorsProvider>{children}</AuthorsProvider>;
}
