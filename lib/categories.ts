export interface CategorieInfo {
  id: string;
  nom: string;
  slug: string;
  couleur: string;
}

export const SEUIL_STOCK_FAIBLE = 3;

// Palette utilisée pour attribuer automatiquement une couleur à chaque nouvelle catégorie
export const PALETTE_CATEGORIES = [
  "bg-blue-50 text-blue-700",
  "bg-amber-50 text-amber-700",
  "bg-rose-50 text-rose-700",
  "bg-emerald-50 text-emerald-700",
  "bg-purple-50 text-purple-700",
  "bg-cyan-50 text-cyan-700",
  "bg-orange-50 text-orange-700",
  "bg-teal-50 text-teal-700",
];

export function slugifier(texte: string): string {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
