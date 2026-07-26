"use client";

import { usePathname } from "next/navigation";

interface WhatsAppButtonProps {
  numero?: string | null;
}

export function WhatsAppButton({ numero }: WhatsAppButtonProps) {
  const pathname = usePathname();
  if (!numero || pathname?.startsWith("/admin")) return null;

  const message = encodeURIComponent("Bonjour, j'ai une question sur un produit de votre boutique.");

  return (
    <a
      href={`https://wa.me/${numero}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105"
      aria-label="Contacter sur WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7">
        <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.85 1h.01a7.94 7.94 0 0 0 5.54-13.58ZM12.05 18.5a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.6 6.6 0 1 1 12.24-3.5 6.56 6.56 0 0 1-6.65 6.59Zm3.6-4.93c-.2-.1-1.17-.58-1.35-.64s-.31-.1-.44.1-.5.63-.62.77-.23.15-.43.05a5.4 5.4 0 0 1-1.6-.98 5.99 5.99 0 0 1-1.1-1.37c-.12-.2 0-.3.09-.4s.2-.23.29-.35.13-.2.2-.33a.36.36 0 0 0-.02-.35c-.05-.1-.44-1.06-.6-1.45s-.32-.33-.44-.33h-.38a.72.72 0 0 0-.52.24 2.2 2.2 0 0 0-.68 1.63c0 .96.7 1.9.8 2.03s1.37 2.1 3.32 2.94a11.2 11.2 0 0 0 1.11.41 2.67 2.67 0 0 0 1.22.08c.37-.06 1.17-.48 1.33-.94s.17-.86.12-.94-.18-.13-.38-.24Z" />
      </svg>
    </a>
  );
}
