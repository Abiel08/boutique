import { prisma } from "@/lib/prisma";
import { CommandesList } from "@/components/admin/CommandesList";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CommandesAdminPage() {
  const commandes = await prisma.commande.findMany({
    orderBy: { createdAt: "desc" },
    include: { lignes: { include: { produit: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Commandes"
        description={`${commandes.length} commande${commandes.length > 1 ? "s" : ""} reçue${commandes.length > 1 ? "s" : ""}`}
        action={
          <a
            href="/api/commandes/export"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Download size={16} />
            Exporter CSV / Excel
          </a>
        }
      />
      <CommandesList commandes={JSON.parse(JSON.stringify(commandes))} />
    </div>
  );
}
