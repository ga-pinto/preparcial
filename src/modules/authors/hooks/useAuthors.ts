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

const API_ENDPOINT = "http://127.0.0.1:8080/api/authors";

export function useAuthors(): CrudReturn {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleResponseError = useCallback(async (response: Response) => {
    let details = "Error inesperado";

    try {
      const body = await response.json();
      if (body?.message) {
        details = body.message;
      }
    } catch {
      // ignoramos errores de parseo
    }

    throw new Error(details);
  }, []);

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT, { cache: "no-store" });
      if (!response.ok) {
        await handleResponseError(response);
        return;
      }

      const data = (await response.json()) as Author[];
      setAuthors(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo cargar la lista";
      setError(message);
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
        const response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          await handleResponseError(response);
          return null;
        }

        const created = (await response.json()) as Author;
        setAuthors((prev) => [...prev, created]);
        return created;
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo crear el autor";
        setError(message);
        return null;
      }
    },
    [handleResponseError],
  );

  const updateAuthor = useCallback(
    async (id: number, values: AuthorFormData) => {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...values }),
        });

        if (!response.ok) {
          await handleResponseError(response);
          return null;
        }

        const updated = (await response.json()) as Author;
        setAuthors((prev) => prev.map((author) => (author.id === id ? updated : author)));
        return updated;
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo actualizar el autor";
        setError(message);
        return null;
      }
    },
    [handleResponseError],
  );

  const deleteAuthor = useCallback(
    async (id: number) => {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          await handleResponseError(response);
          return false;
        }

        setAuthors((prev) => prev.filter((author) => author.id !== id));
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo eliminar el autor";
        setError(message);
        return false;
      }
    },
    [handleResponseError],
  );

  const value = useMemo<CrudReturn>(
    () => ({ authors, loading, error, createAuthor, updateAuthor, deleteAuthor, refresh: fetchAuthors }),
    [authors, loading, error, createAuthor, updateAuthor, deleteAuthor, fetchAuthors],
  );

  return value;
}
