
"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useMemo } from "react";
import { AuthorForm } from "@/modules/authors/ui/AuthorForm";
import { useAuthors } from "@/modules/authors/hooks/useAuthors";

export default function EditAuthorPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { authors, loading, error, updateAuthor } = useAuthors();

  const authorId = Number(id);
  const author = useMemo(
    () => authors.find((a) => a.id === authorId),
    [authors, authorId]
  );

  if (loading) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <p className="text-sm text-slate-500">Cargando información del autor...</p>
      </section>
    );
  }

  if (!author) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">
            Autor no encontrado
          </p>
          <h1 className="text-3xl font-bold text-slate-900">No pudimos cargar este autor</h1>
          <p className="text-sm text-slate-500">
            Revisa que el enlace sea correcto o vuelve al listado para seleccionar otro autor.
          </p>
        </header>
        <Link href="/authors" className="text-sm font-semibold text-sky-600 hover:text-sky-500">
          Volver al listado
        </Link>
      </section>
    );
  }

  const handleSubmit = async (values: Parameters<typeof updateAuthor>[1]) => {
    const ok = await updateAuthor(author.id, values);
    if (!ok) return false;
    router.push("/authors");
    return true;
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-white bg-sky-600 px-3 py-1 rounded">
          Editar autor
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Actualiza la información</h1>
        <p className="text-sm text-slate-500">Modifica los datos necesarios y guarda los cambios.</p>
      </header>

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <AuthorForm
        defaultValues={author}
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/authors")}
      />

      <Link href="/authors" className="text-sm font-semibold text-sky-600 hover:text-sky-500">
        Volver al listado
      </Link>
    </section>
  );
}
