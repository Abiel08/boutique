import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function CategoriesAdminPage() {
  const categories = await prisma.categorie.findMany({ orderBy: { ordre: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="Catégories"
        description="Ajoute ou retire les catégories affichées sur le site"
      />
      <CategoriesManager categoriesInitiales={categories} />
    </div>
  );
}
