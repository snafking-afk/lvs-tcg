"use client";

import { useState } from "react";
import Link from "next/link";
import { CartCount } from "@/components/cart/CartCount";

// ============================================================
//  En-tête du site : logo, navigation, panier et menu hamburger
//  responsive (mobile). Client Component pour gérer l'ouverture
//  du menu mobile. Le compteur panier (CartCount) lit le panier
//  côté client via le contexte.
// ============================================================

const NAV_LINKS = [
  { href: "/", label: "Boutique" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/** Petit logo "placeholder" propre : pastille dégradée + mot-clé. */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-lg shadow-sm">
        🎴
      </span>
      <span className="font-sans text-lg tracking-tight text-zinc-900">
        <span className="font-semibold">POKÉ </span>
        <span className="font-bold">LVS</span>{" "}
        <span className="font-medium tracking-[0.25em] text-zinc-400">TCG</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Navigation desktop */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
          <CartCount />
        </nav>

        {/* Actions mobile : panier + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <CartCount />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            {/* Icône hamburger / croix */}
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-all ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Menu déroulant mobile */}
      {open && (
        <nav className="border-t border-zinc-200 bg-white px-4 py-3 sm:px-6 md:hidden">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
