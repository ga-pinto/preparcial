"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type Author = {
  id: number;
  name: string;
  birthDate: string;
  description: string;
  image: string;
};

export type AuthorFormData = Omit<Author, "id">;

type CrudReturn = {
  authors: Author[];
  loading: boolean;
  error: string | null;
  createAuthor: (values: AuthorFormData) => Promise<Author | null>;
  updateAuthor: (id: number, values: AuthorFormData) => Promise<Author | null>;
  deleteAuthor: (id: number) => Promise<boolean>;
  refresh: () => Promise<void>;
};

// ✅ Usa el proxy del App Router para evitar CORS
const API_BASE = "/api/authors";

export function useAuthors(): CrudReturn {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleResponseError = useCallback(async (response: Response) => {
    let details = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      if (body?.message) details = body.message;
      if (body?.error) details = body.error;
    } catch {
      /* ignore parse errors */
    }
    throw new Error(details);
  }, []);

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, { cache: "no-store" });
      if (!res.ok) {
        await handleResponseError(res);
        return;
      }
      const data = (await res.json()) as Author[];
      setAuthors(data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cargar la lista");
    } finally {
      setLoading(false);
    }
  }, [handleResponseError]);

  useEffect(() => {
    void fetchAuthors();
  }, [fetchAuthors]);

  const createAuthor = useCallback(
    async (values: AuthorFormData) => {
      try {
        const res = await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          await handleResponseError(res);
          return null;
        }
        const created = (await res.json()) as Author;
        setAuthors((prev) => [...prev, created]);
        return created;
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo crear el autor");
        return null;
      }
    },
    [handleResponseError],
  );

  const updateAuthor = useCallback(
    async (id: number, values: AuthorFormData) => {
      try {
        // Si tu backend usa PUT completo, cambia method a "PUT"
        const res = await fetch(`${API_BASE}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          await handleResponseError(res);
          return null;
        }
        // Algunas APIs devuelven el objeto actualizado, otras no:
        const updated = (await res.json().catch(() => null)) as Author | null;
        setAuthors((prev) =>
          prev.map((a) => (a.id === id ? (updated ?? { ...a, ...values, id }) : a)),
        );
        return updated ?? { ...values, id };
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo actualizar el autor");
        return null;
      }
    },
    [handleResponseError],
  );

  const deleteAuthor = useCallback(
    async (id: number) => {
      try {
        // ❗ No envíes body en DELETE; usa la URL con /:id
        const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
        if (!res.ok && res.status !== 204) {
          await handleResponseError(res);
          return false;
        }
        setAuthors((prev) => prev.filter((a) => a.id !== id));
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo eliminar el autor");
        return false;
      }
    },
    [handleResponseError],
  );

  const value = useMemo<CrudReturn>(
    () => ({
      authors,
      loading,
      error,
      createAuthor,
      updateAuthor,
      deleteAuthor,
      refresh: fetchAuthors,
    }),
    [authors, loading, error, createAuthor, updateAuthor, deleteAuthor, fetchAuthors],
  );

  return value;
}
