"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/50 hover:bg-muted hover:text-ink"
    >
      <LogOut size={16} strokeWidth={1.8} />
      Se déconnecter
    </button>
  );
}
