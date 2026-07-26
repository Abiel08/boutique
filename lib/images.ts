/**
 * Insère des paramètres d'optimisation dans une URL Cloudinary :
 * - f_auto : format le plus léger selon le navigateur (WebP/AVIF)
 * - q_auto : qualité optimisée automatiquement
 * - w_xxx : redimensionnement à la largeur utile (évite d'envoyer une image trop grande)
 * Les URLs qui ne viennent pas de Cloudinary sont retournées telles quelles.
 */
export function optimiserImage(url: string, largeur?: number): string {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;

  const transformation = largeur ? `f_auto,q_auto,w_${largeur}` : "f_auto,q_auto";
  return url.replace("/upload/", `/upload/${transformation}/`);
}
