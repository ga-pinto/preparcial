"use client";

import { useEffect, useState } from "react";

export type AuthorFormData = {
  name: string;
  birthDate: string;  
  description: string;
  image: string;       
};

type AuthorFormProps = {
  defaultValues?: AuthorFormData;
  submitLabel: string;
  onSubmit: (values: AuthorFormData) => Promise<boolean | void> | boolean | void;
  onCancel?: () => void;
};

export function AuthorForm({ defaultValues, submitLabel, onSubmit, onCancel }: AuthorFormProps) {
  const [name, setName] = useState<string>(defaultValues?.name ?? "");
  const [birthDate, setBirthDate] = useState<string>(defaultValues?.birthDate ?? "");
  const [description, setDescription] = useState<string>(defaultValues?.description ?? "");
  const [image, setImage] = useState<string>(defaultValues?.image ?? "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setName(defaultValues?.name ?? "");
    setBirthDate(defaultValues?.birthDate ?? "");
    setDescription(defaultValues?.description ?? "");
    setImage(defaultValues?.image ?? "");
  }, [defaultValues]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const result = await onSubmit({
        name: name.trim(),
        birthDate,
        description: description.trim(),
        image: image.trim(),
      });

      if (result !== false) setFeedback("Cambios guardados con éxito");
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo completar la acción";
      setFeedback(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          placeholder="Nombre del autor"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="birthDate">Fecha de nacimiento</label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          required
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[120px] rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          placeholder="Breve descripción del autor"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-2">
        <label className="font-semibold" htmlFor="image">URL de la imagen</label>
        <input
          id="image"
          name="image"
          type="url"
          required
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
          placeholder="https://"
          disabled={isSubmitting}
        />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        ) : null}
      </div>

      {feedback ? <p className="text-sm text-slate-500">{feedback}</p> : null}
    </form>
  );
}
