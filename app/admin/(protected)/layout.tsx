import { prisma } from "@/lib/prisma";
import { AdminNavLinks } from "@/components/admin/AdminNavLinks";
import { SignOutButton } from "@/components/admin/SignOutButton";

// Ce layout ne couvre que les pages protégées (dashboard, produits, commandes, parametres).
// Le middleware garantit déjà qu'on ne peut pas y accéder sans être connecté,
// donc pas besoin de re-vérifier la session ici : le menu s'affiche toujours.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } }).catch(() => null);
  const nom = config?.nom ?? "Ma Boutique";

  return (
    <div className="min-h-screen bg-muted/40 md:flex">
      {/* Menu latéral - visible seulement à partir de la taille tablette */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-ink/10 bg-paper p-5 md:flex">
        <div className="mb-8 flex items-center gap-2 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
            {nom.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-ink">{nom}</p>
            <p className="text-xs text-ink/40">Espace admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <AdminNavLinks />
        </nav>

        <div className="mt-4 border-t border-ink/10 pt-4">
          <SignOutButton />
        </div>
      </aside>

      {/* Barre de navigation horizontale scrollable - visible seulement sur mobile */}
      <nav className="sticky top-0 z-10 flex items-center gap-1 overflow-x-auto border-b border-ink/10 bg-paper px-3 py-2 md:hidden">
        <AdminNavLinks orientation="horizontal" />
        <div className="ml-auto shrink-0">
          <SignOutButton />
        </div>
      </nav>

      <main className="flex-1 p-5 md:p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
