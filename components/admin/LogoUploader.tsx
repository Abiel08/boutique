"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface LogoUploaderProps {
  logoUrl: string;
  onChange: (url: string) => void;
}

export function LogoUploader({ logoUrl, onChange }: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  async function handleFichierSelectionne(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;

    if (!uploadPreset || !cloudName) {
      setErreur("Upload d'images non configuré (variables Cloudinary manquantes dans .env).");
      return;
    }

    setEnCours(true);
    setErreur("");

    try {
      const formData = new FormData();
      formData.append("file", fichier);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Échec de l'upload");
      const data = await res.json();
      onChange(data.secure_url);
    } catch (err) {
      setErreur("Une erreur est survenue pendant l'envoi du logo. Réessaie.");
    } finally {
      setEnCours(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (!uploadPreset || !cloudName) {
    return (
      <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50 p-4 text-sm text-amber-700">
        L'upload d'images n'est pas encore configuré. Ajoute <code>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</code> et{" "}
        <code>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</code> dans ton fichier <code>.env</code>, puis redémarre le serveur
        (<code>npm run dev</code>).
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-muted">
        {logoUrl ? (
          <Image src={logoUrl} alt="Logo" width={64} height={64} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-ink/40">Aucun</span>
        )}
      </div>

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFichierSelectionne}
          className="hidden"
          id="upload-logo-input"
        />
        <label
          htmlFor="upload-logo-input"
          className={`inline-block cursor-pointer rounded-lg border border-ink/20 px-4 py-2 text-sm font-medium text-ink/60 hover:border-ink/40 hover:bg-muted ${
            enCours ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {enCours ? "Envoi en cours..." : logoUrl ? "Changer le logo" : "Choisir un logo"}
        </label>
        {erreur && <p className="mt-1 text-xs text-red-500">{erreur}</p>}
      </div>
    </div>
  );
}
