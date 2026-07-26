"use client";

import { useState } from "react";
import Image from "next/image";
import { optimiserImage } from "@/lib/images";

export function ProductGallery({ images, nom }: { images: string[]; nom: string }) {
  const [actif, setActif] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-xl bg-ink/[0.04] text-ink/20">
        Pas d'image
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-[3/4] overflow-hidden rounded-xl bg-ink/[0.04]">
        <Image
          src={optimiserImage(images[actif], 600)}
          alt={`${nom} - photo ${actif + 1}`}
          width={600}
          height={800}
          className="h-full w-full object-cover"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActif(i)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                actif === i ? "border-accent" : "border-transparent"
              }`}
            >
              <Image src={optimiserImage(img, 100)} alt={`Vignette ${i + 1}`} width={100} height={100} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
