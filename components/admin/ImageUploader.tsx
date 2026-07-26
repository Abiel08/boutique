"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  function retirerImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  async function handleFichiersSelectionnes(e: React.ChangeEvent<HTMLInputElement>) {
    const fichiers = e.target.files;
    if (!fichiers || fichiers.length === 0) return;

    if (!uploadPreset || !cloudName) {
      setErreur("Upload d'images non configuré (variables Cloudinary manquantes dans .env).");
      return;
    }

    setEnCours(true);
    setErreur("");
    const nouvellesUrls: string[] = [];

    try {
      for (const fichier of Array.from(fichiers)) {
        const formData = new FormData();
        formData.append("file", fichier);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Échec de l'upload");
        const data = await res.json();
        nouvellesUrls.push(data.secure_url);
      }

      onChange([...images, ...nouvellesUrls]);
    } catch (err) {
      setErreur("Une erreur est survenue pendant l'envoi des photos. Réessaie.");
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
    <div>
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-4 gap-3">
          {images.map((url, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => retirerImage(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                title="Retirer cette image"
              >
                ×
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFichiersSelectionnes}
        className="hidden"
        id="upload-images-input"
      />
      <label
        htmlFor="upload-images-input"
        className={`block w-full cursor-pointer rounded-lg border border-dashed border-ink/20 py-4 text-center text-sm font-medium text-ink/60 hover:border-ink/40 hover:bg-muted ${
          enCours ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {enCours ? "Envoi en cours..." : "+ Choisir des photos depuis l'appareil"}
      </label>

      {erreur && <p className="mt-2 text-xs text-red-500">{erreur}</p>}

      <p className="mt-2 text-xs text-ink/40">
        La première image sera utilisée comme photo principale. Tu peux sélectionner plusieurs photos à la fois.
      </p>
    </div>
  );
}
