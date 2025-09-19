"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthorForm } from "@/components/AuthorForm";
import { useAuthorsContext } from "@/context/AuthorsContext";
import { useMemo, use } from "react";

export default function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { authors, loading, error, updateAuthor } = useAuthorsContext();
  const resolvedParams = use(params);

  const author = useMemo(() => authors.find((item) => item.id === Number(resolvedParams.id)), [authors, resolvedParams.id]);

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
        <Link
          href="/authors"
          className="text-sm font-semibold text-sky-600 transition hover:text-sky-500"
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  const handleSubmit = async (values: Parameters<typeof updateAuthor>[1]) => {
    const result = await updateAuthor(author.id, values);
    if (!result) {
      return false;
    }

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
        <p className="text-sm text-slate-500">
          Modifica los datos necesarios y guarda los cambios.
        </p>
      </header>

      {error ? (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <AuthorForm
        defaultValues={author}
        submitLabel="Guardar cambios"
        onSubmit={handleSubmit}
        onCancel={() => router.push("/authors")}
      />

      <Link
        href="/authors"
        className="text-sm font-semibold text-sky-600 transition hover:text-sky-500"
      >
        Volver al listado
      </Link>
    </section>
  );
}
