import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-4 px-6 py-8 text-sm">
        <div className="flex flex-wrap gap-5">
          <Link href="/a-propos" className="text-paper/70 hover:text-accent">À propos</Link>
          <Link href="/conditions" className="text-paper/70 hover:text-accent">Conditions de vente</Link>
          <Link href="/suivi" className="text-paper/70 hover:text-accent">Suivre ma commande</Link>
        </div>
        <p className="text-paper/50">Paiement à la livraison</p>
      </div>
    </footer>
  );
}
