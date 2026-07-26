import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UtilisateursManager } from "@/components/admin/UtilisateursManager";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export const dynamic = "force-dynamic";

export default async function UtilisateursPage() {
  const session = await getServerSession(authOptions);
  const utilisateurs = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <AdminPageHeader title="Utilisateurs admin" description="Gère qui a accès à cet espace d'administration" />
      <UtilisateursManager
        utilisateursInitiaux={JSON.parse(JSON.stringify(utilisateurs))}
        idConnecte={(session?.user as any)?.id ?? ""}
      />
    </div>
  );
}
