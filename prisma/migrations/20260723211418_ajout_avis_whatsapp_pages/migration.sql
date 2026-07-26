-- AlterTable
ALTER TABLE "SiteConfig" ADD COLUMN     "aPropos" TEXT,
ADD COLUMN     "conditionsVente" TEXT,
ADD COLUMN     "whatsappNumero" TEXT;

-- CreateTable
CREATE TABLE "Avis" (
    "id" TEXT NOT NULL,
    "produitId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Avis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Avis" ADD CONSTRAINT "Avis_produitId_fkey" FOREIGN KEY ("produitId") REFERENCES "Produit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
