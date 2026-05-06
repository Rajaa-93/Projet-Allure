"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Search, Sparkles, Heart, User } from "lucide-react";

const items = [
  { href: "/", label: "Accueil", icon: House },
  { href: "/catalogue", label: "Recherche", icon: Search },
  { href: "/essayage", label: "Créer", icon: Sparkles },
  { href: "/panier", label: "Favoris", icon: Heart },
  { href: "/login", label: "Profil", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 border-t border-[#d7cab2] bg-[#f6f1e7]/96 backdrop-blur">
      <div className="grid grid-cols-5 px-2 pb-3 pt-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1"
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  active
                    ? "bg-[#1b1712] text-[#d7bf8a] shadow-[0_8px_20px_rgba(27,23,18,0.22)]"
                    : "text-[#746a5c]"
                }`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`text-[11px] ${
                  active ? "font-semibold text-[#1b1712]" : "text-[#746a5c]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}