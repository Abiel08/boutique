"use client";

import { useState } from "react";

interface Avis {
  id: string;
  nom: string;
  note: number;
  commentaire: string | null;
  createdAt: string;
}

function Etoiles({ note, taille = "text-base" }: { note: number; taille?: string }) {
  return (
    <span className={`${taille} text-amber-400`}>
      {"★".repeat(note)}
      <span className="text-ink/10">{"★".repeat(5 - note)}</span>
    </span>
  );
}

export function AvisSection({ produitId, avisInitiaux }: { produitId: string; avisInitiaux: Avis[] }) {
  const [avis, setAvis] = useState<Avis[]>(avisInitiaux);
  const [afficherForm, setAfficherForm] = useState(false);
  const [nom, setNom] = useState("");
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [envoi, setEnvoi] = useState(false);

  const moyenne = avis.length > 0 ? avis.reduce((s, a) => s + a.note, 0) / avis.length : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nom.trim()) return;
    setEnvoi(true);

    const res = await fetch(`/api/produits/${produitId}/avis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, note, commentaire: commentaire || undefined }),
    });

    if (res.ok) {
      const nouvelAvis = await res.json();
      setAvis([nouvelAvis, ...avis]);
      setNom("");
      setCommentaire("");
      setNote(5);
      setAfficherForm(false);
    }
    setEnvoi(false);
  }

  return (
    <div className="mt-12 border-t border-ink/10 pt-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Avis clients</h2>
          {avis.length > 0 ? (
            <div className="mt-1 flex items-center gap-2 text-sm text-ink/50">
              <Etoiles note={Math.round(moyenne)} />
              <span>{moyenne.toFixed(1)}/5 · {avis.length} avis</span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-ink/40">Aucun avis pour le moment</p>
          )}
        </div>
        <button
          onClick={() => setAfficherForm(!afficherForm)}
          className="rounded-lg border border-ink px-4 py-2 text-sm font-medium"
        >
          Laisser un avis
        </button>
      </div>

      {afficherForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-3 rounded-lg border border-ink/10 p-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Ton nom</label>
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="input-field text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Note</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNote(n)}
                  className={`text-2xl ${n <= note ? "text-amber-400" : "text-ink/10"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Commentaire (optionnel)</label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={2}
              className="input-field text-sm"
            />
          </div>
          <button type="submit" disabled={envoi} className="btn-primary text-sm disabled:opacity-50">
            {envoi ? "Envoi..." : "Publier mon avis"}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {avis.map((a) => (
          <div key={a.id} className="border-b border-ink/5 pb-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{a.nom}</p>
              <Etoiles note={a.note} taille="text-sm" />
            </div>
            {a.commentaire && <p className="mt-1 text-sm text-ink/60">{a.commentaire}</p>}
            <p className="mt-1 text-xs text-ink/30">
              {new Date(a.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
