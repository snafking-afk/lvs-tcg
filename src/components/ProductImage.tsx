"use client";

import Image from "next/image";
import { useState } from "react";

// ============================================================
//  Image produit robuste : si l'URL distante échoue (404, CDN
//  indisponible...), on affiche un fallback propre au lieu d'une
//  image cassée. Composant client car il gère l'état d'erreur.
// ============================================================

export function ProductImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-zinc-100 text-zinc-400">
        <span className="text-3xl">🃏</span>
        <span className="text-xs">Image indisponible</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
      onError={() => setHasError(true)}
    />
  );
}
