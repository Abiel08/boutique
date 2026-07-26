"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartItem {
  produitId: string;
  nom: string;
  prix: number;
  image?: string;
  taille?: string;
  quantite: number;
}

interface CartContextType {
  items: CartItem[];
  ajouterAuPanier: (item: CartItem) => void;
  retirerDuPanier: (produitId: string, taille?: string) => void;
  modifierQuantite: (produitId: string, taille: string | undefined, quantite: number) => void;
  viderPanier: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "boutique_panier";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {}
    }
    setCharge(true);
  }, []);

  useEffect(() => {
    if (charge) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, charge]);

  function ajouterAuPanier(item: CartItem) {
    setItems((prev) => {
      const existant = prev.find(
        (i) => i.produitId === item.produitId && i.taille === item.taille
      );
      if (existant) {
        return prev.map((i) =>
          i === existant ? { ...i, quantite: i.quantite + item.quantite } : i
        );
      }
      return [...prev, item];
    });
  }

  function retirerDuPanier(produitId: string, taille?: string) {
    setItems((prev) => prev.filter((i) => !(i.produitId === produitId && i.taille === taille)));
  }

  function modifierQuantite(produitId: string, taille: string | undefined, quantite: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.produitId === produitId && i.taille === taille ? { ...i, quantite } : i
      )
    );
  }

  function viderPanier() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.prix * i.quantite, 0);

  return (
    <CartContext.Provider
      value={{ items, ajouterAuPanier, retirerDuPanier, modifierQuantite, viderPanier, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans un CartProvider");
  return ctx;
}
