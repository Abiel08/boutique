import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/shop/CartContext";
import { WhatsAppButton } from "@/components/shop/WhatsAppButton";
import { prisma } from "@/lib/prisma";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } }).catch(() => null);
  const nom = config?.nom ?? "Ma Boutique";
  const description = config?.description ?? "Vêtements, bijoux et chaussures";
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(base),
    title: { default: nom, template: `%s | ${nom}` },
    description,
    openGraph: {
      title: nom,
      description,
      type: "website",
      images: config?.logoUrl ? [config.logoUrl] : [],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await prisma.siteConfig.findUnique({ where: { id: "main" } }).catch(() => null);

  return (
    <html lang="fr">
      <body className={`${inter.variable} min-h-screen bg-paper font-sans text-ink antialiased`}>
        <CartProvider>
          {children}
          <WhatsAppButton numero={config?.whatsappNumero} />
        </CartProvider>
      </body>
    </html>
  );
}
