import Link from "next/link";
import Image from "next/image";
import { SEUIL_STOCK_FAIBLE } from "@/lib/categories";
import { optimiserImage } from "@/lib/images";

interface ProductCardProps {
  id: string;
  nom: string;
  prix: number;
  image?: string;
  categorie: { nom: string; couleur: string };
  quantite?: number;
}

export function ProductCard({ id, nom, prix, image, categorie, quantite }: ProductCardProps) {
  const rupture = quantite !== undefined && quantite <= 0;
  const stockFaible = quantite !== undefined && quantite > 0 && quantite <= SEUIL_STOCK_FAIBLE;

  return (
    <Link href={`/produit/${id}`} className="group block">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        {image ? (
          <Image
            src={optimiserImage(image, 400)}
            alt={nom}
            width={400}
            height={533}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/20">Pas d'image</div>
        )}
        {rupture && (
          <span className="absolute left-2 top-2 rounded-full bg-ink/85 px-2 py-1 text-[11px] font-medium text-paper">
            Épuisé
          </span>
        )}
        {stockFaible && (
          <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-1 text-[11px] font-medium text-white">
            Dernières pièces
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1.5">
        <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${categorie.couleur}`}>
          {categorie.nom}
        </span>
        <h3 className="text-sm font-medium text-ink">{nom}</h3>
        <p className="text-sm font-semibold text-ink">{prix.toLocaleString()} FCFA</p>
      </div>
    </Link>
  );
}
