// src/app/authors/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthors } from "@/modules/authors/hooks/useAuthors";

export default function AuthorsPage() {
  const router = useRouter();
  const { authors, loading, error, deleteAuthor } = useAuthors();

  const handleDelete = async (id: number) => {
    const shouldDelete = window.confirm("¿Deseas eliminar este autor?");
    if (!shouldDelete) return;

    const success = await deleteAuthor(id);
    if (!success) {
      window.alert("No se pudo eliminar el autor. Intenta nuevamente.");
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-600">
            Panel de Autores
          </p>
          <h1 className="text-3xl font-bold text-white">Autores registrados</h1>
          <p className="text-sm text-slate-500">
            Gestiona la lista de autores disponibles en la plataforma.
          </p>
        </div>

        {/* antes: href="/crear" */}
        <Link
          href="/authors/crear"
          className="inline-flex items-center justify-center rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          Crear autor
        </Link>
      </header>

      {loading && <p className="text-sm text-slate-500">Cargando autores...</p>}
      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && authors.length === 0 && (
        <div className="rounded border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-slate-500">
            No hay autores registrados todavía. Crea el primero desde el botón superior.
          </p>
        </div>
      )}

      <ul className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {authors.map((author) => (
          <li
            key={author.id}
            className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="relative h-64 w-full bg-slate-100">
              <Image
                alt={`Retrato de ${author.name}`}
                src={author.image}
                fill
                className="object-cover object-top"
                sizes="(min-width: 1280px) 33vw, (min-width: 1024px) 50vw, 100vw"
                priority={false}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4 p-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{author.name}</h2>
                <p className="text-sm text-sky-600 mt-1">
                  Nació el{" "}
                  {new Date(author.birthDate).toLocaleDateString("es-ES", {
                    dateStyle: "medium",
                  })}
                </p>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4">
                {author.description}
              </p>

              <div className="flex items-center justify-end gap-3">
                {/* antes: `/editar/${author.id}` */}
                <button
                  type="button"
                  onClick={() => router.push(`/authors/${author.id}`)}
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(author.id)}
                  className="rounded bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
