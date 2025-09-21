"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-slate-900/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="font-semibold tracking-tight text-white">
          <span className="text-lg">Bookstore</span>{" "}
          <span className="rounded bg-sky-500/15 px-2 py-0.5 text-sky-300">Andes</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? "text-white" : "text-slate-300 hover:text-white"}
              >
                {item.label}
              </Link>
            );
          })}

          {/* CTA (usa la que te convenga) */}
          <Link
            href="/authors/crear"   // o "/books/crear" si el CTA es para libros
            className="rounded-xl bg-sky-600 px-3 py-1.5 font-medium text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            Agregar libro
          </Link>
        </nav>
      </div>
    </header>
  );
}
