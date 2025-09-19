"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthorForm } from "@/components/AuthorForm";
import { useAuthorsContext } from "@/context/AuthorsContext";

export default function CreateAuthorPage() {
  const router = useRouter();
  const { createAuthor } = useAuthorsContext();

  const handleSubmit = async (values: Parameters<typeof createAuthor>[0]) => {
    const result = await createAuthor(values);
    if (!result) {
      return false;
    }

    router.push("/authors");
    return true;
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
          Crear autor
        </p>
        <h1 className="text-3xl font-bold text-white">Nuevo autor</h1>
        <p className="text-sm text-slate-500">
          Completa el formulario con la información del nuevo autor.
        </p>
      </header>

      <AuthorForm submitLabel="Guardar autor" onSubmit={handleSubmit} />

      <Link
        href="/authors"
        className="text-sm font-semibold text-sky-600 transition hover:text-sky-500"
      >
        Volver al listado
      </Link>
    </section>
  );
}