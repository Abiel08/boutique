"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/shop/CartContext";
import { optimiserImage } from "@/lib/images";

interface SiteHeaderProps {
  nom: string;
  logoUrl?: string | null;
  categories: { slug: string; nom: string }[];
}

export function SiteHeader({ nom, logoUrl, categories }: SiteHeaderProps) {
  const { items } = useCart();
  const pathname = usePathname();
  const nbArticles = items.reduce((s, i) => s + i.quantite, 0);

  const liens = [{ href: "/", label: "Tout" }, ...categories.map((c) => ({ href: `/categorie/${c.slug}`, label: c.nom }))];

  return (
    <header className="sticky top-0 z-10 bg-ink text-paper shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={optimiserImage(logoUrl, 72)}
              alt={nom}
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-semibold text-paper">
              {nom.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-lg font-semibold tracking-tight text-paper">{nom}</span>
        </Link>

        <nav className="hidden gap-1 text-sm sm:flex">
          {liens.map((lien) => {
            const actif = pathname === lien.href;
            return (
              <Link
                key={lien.href}
                href={lien.href}
                className={`rounded-full px-3.5 py-1.5 transition-colors ${
                  actif ? "bg-accent text-paper" : "text-paper/70 hover:bg-paper/10 hover:text-paper"
                }`}
              >
                {lien.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/panier" className="relative flex items-center gap-2 text-sm font-medium text-paper">
          <span className="hidden sm:inline">Panier</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
            <path d="M6 6h15l-1.5 9h-12L6 3H3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="17" cy="20" r="1.4" />
          </svg>
          {nbArticles > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-paper">
              {nbArticles}
            </span>
          )}
        </Link>
      </div>

      {/* Nav catégories mobile - scroll horizontal, style pilules */}
      <nav className="flex gap-2 overflow-x-auto border-t border-paper/10 px-6 py-2.5 sm:hidden">
        {liens.map((lien) => {
          const actif = pathname === lien.href;
          return (
            <Link
              key={lien.href}
              href={lien.href}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition-colors ${
                actif ? "bg-accent text-paper" : "bg-paper/10 text-paper/70"
              }`}
            >
              {lien.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
