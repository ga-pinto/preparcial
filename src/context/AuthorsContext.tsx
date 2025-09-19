"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuthors, type Author, type AuthorFormData } from "@/hooks/useAuthors";

type AuthorsContextValue = ReturnType<typeof useAuthors>;

const AuthorsContext = createContext<AuthorsContextValue | null>(null);

export function AuthorsProvider({ children }: { children: ReactNode }) {
  const value = useAuthors();
  const contextValue = useMemo(() => value, [value]);

  return <AuthorsContext.Provider value={contextValue}>{children}</AuthorsContext.Provider>;
}

export function useAuthorsContext(): AuthorsContextValue {
  const context = useContext(AuthorsContext);
  if (!context) {
    throw new Error("useAuthorsContext debe usarse dentro de AuthorsProvider");
  }

  return context;
}

export type { Author, AuthorFormData };
