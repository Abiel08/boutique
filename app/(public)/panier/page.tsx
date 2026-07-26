"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/shop/CartContext";
import { optimiserImage } from "@/lib/images";

export default function PanierPage() {
  const { items, retirerDuPanier, modifierQuantite, total } = useCart();

  return (
    <>
      <header className="border-b border-ink/10 px-6 py-4">
        <Link href="/" className="text-sm text-ink/50 hover:text-ink">← Continuer mes achats</Link>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-8 text-2xl text-ink">Mon panier</h1>

        {items.length === 0 ? (
          <p className="text-ink/40">Ton panier est vide.</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.produitId}-${item.taille}`}
                  className="flex flex-wrap items-center gap-3 border-b border-ink/10 pb-4 sm:flex-nowrap sm:gap-4"
                >
                  <div className="h-20 w-16 overflow-hidden rounded-lg bg-ink/[0.04]">
                    {item.image && (
                      <Image src={optimiserImage(item.image, 128)} alt={item.nom} width={64} height={80} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-ink">{item.nom}</p>
                    {item.taille && <p className="text-sm text-ink/40">Taille : {item.taille}</p>}
                    <p className="text-sm font-semibold text-ink">{item.prix.toLocaleString()} FCFA</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => modifierQuantite(item.produitId, item.taille, Math.max(1, item.quantite - 1))}
                      className="h-8 w-8 rounded-full border border-ink/15 text-ink hover:border-ink/40"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-ink">{item.quantite}</span>
                    <button
                      onClick={() => modifierQuantite(item.produitId, item.taille, item.quantite + 1)}
                      className="h-8 w-8 rounded-full border border-ink/15 text-ink hover:border-ink/40"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => retirerDuPanier(item.produitId, item.taille)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between text-lg text-ink">
              <span>Total</span>
              <span>{total.toLocaleString()} FCFA</span>
            </div>

            <Link href="/commande" className="btn-primary mt-6 block text-center">
              Passer la commande
            </Link>
          </>
        )}
      </main>
    </>
  );
}
