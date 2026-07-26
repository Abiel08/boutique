"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, ClipboardList, Users, Settings } from "lucide-react";

const liens = [
  { href: "/admin/dashboard", label: "Tableau de bord", Icon: LayoutDashboard },
  { href: "/admin/produits", label: "Produits", Icon: Package },
  { href: "/admin/categories", label: "Catégories", Icon: Tag },
  { href: "/admin/commandes", label: "Commandes", Icon: ClipboardList },
  { href: "/admin/utilisateurs", label: "Utilisateurs", Icon: Users },
  { href: "/admin/parametres", label: "Paramètres", Icon: Settings },
];

export function AdminNavLinks({ orientation = "vertical" }: { orientation?: "vertical" | "horizontal" }) {
  const pathname = usePathname();

  if (orientation === "horizontal") {
    return (
      <>
        {liens.map(({ href, label, Icon }) => {
          const actif = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                actif ? "bg-ink text-paper" : "text-ink/70 hover:bg-muted"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <>
      {liens.map(({ href, label, Icon }) => {
        const actif = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
              actif ? "bg-ink text-paper" : "text-ink/70 hover:bg-muted hover:text-ink"
            }`}
          >
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
    </>
  );
}
