"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/lib/useAuth";
import {
  Crown,
  Bell,
  ChevronRight,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  LogOut,
  Settings,
  Shield,
  UserRound,
} from "lucide-react";

const profileSections = [
  {
    title: "Abonnement styliste",
    description: "Souscrivez au service premium et profitez d'un accompagnement.",
    icon: Crown,
    href: "/styliste",
  },
  {
    title: "Parametres",
    description: "Informations personnelles, adresse et preferences.",
    icon: Settings,
  },
  {
    title: "Favoris",
    description: "Retrouvez vos pieces enregistrees et vos envies.",
    icon: Heart,
    href: "/panier",
  },
  {
    title: "Confidentialite",
    description: "Gerer les donnees, permissions et securite du compte.",
    icon: Shield,
  },
  {
    title: "Notifications",
    description: "Alertes panier, disponibilites et recommandations.",
    icon: Bell,
  },
];

function AuthenticationView({
  onLogin,
}: {
  onLogin: () => void;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="relative z-10 flex min-h-[760px] flex-col">
      <div className="pt-6 text-center">
        <div className="mx-auto mb-3 flex justify-center">
          <Image
            src="/allure-login-logo.png"
            alt="Logo Allure"
            width={280}
            height={220}
            className="h-auto w-[220px]"
            priority
          />
        </div>

        <h1
          className="mt-4 text-[30px] font-semibold tracking-[-0.02em] text-[#1d1914]"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Connectez-vous
        </h1>
      </div>

      <div className="mt-10 space-y-6">
        <div className="space-y-4">
          <div className="flex h-14 items-center rounded-full border border-[#ddd1bd] bg-[#fbf8f1] px-5 shadow-[0_6px_14px_rgba(60,45,25,0.08)]">
            <UserRound size={18} className="mr-3 text-[#8a7a63]" />
            <input
              type="email"
              placeholder="Adresse mail"
              className="w-full bg-transparent text-[17px] text-[#2a241d] outline-none"
            />
          </div>

          <div className="flex h-14 items-center rounded-full border border-[#ddd1bd] bg-[#fbf8f1] px-5 shadow-[0_6px_14px_rgba(60,45,25,0.08)]">
            <LockKeyhole size={18} className="mr-3 text-[#8a7a63]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              className="w-full bg-transparent text-[17px] text-[#2a241d] outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-[#9a886f]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <button className="text-[15px] text-[#332b23]">
            Mot de passe oublie ?
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            onLogin();
            router.push("/login");
          }}
          className="mx-auto block w-[78%] rounded-2xl bg-[linear-gradient(180deg,#d8b66b_0%,#b68436_100%)] px-6 py-3.5 text-[18px] font-semibold text-[#201811] shadow-[0_0_0_1px_rgba(123,89,35,0.3),0_10px_24px_rgba(190,140,62,0.35),0_0_28px_rgba(214,175,95,0.45)]"
        >
          Se connecter
        </button>

        <div className="flex items-center gap-4 pt-3">
          <div className="h-px flex-1 bg-[#b9ab94]" />
          <span className="text-[18px] font-medium text-[#3a3127]">OU</span>
          <div className="h-px flex-1 bg-[#b9ab94]" />
        </div>

        <div className="pt-2 text-center">
          <p className="text-[16px] text-[#51463a]">
            Vous n&apos;avez pas de compte ?
          </p>
          <Link
            href="/signup"
            className="mt-3 inline-block text-[18px] font-semibold text-[#1f1a15]"
          >
            Inscrivez vous !
          </Link>
        </div>
      </div>

      <div className="mt-auto pt-10 text-center">
        <p className="text-xs text-[#7d705e]">Version 1.1</p>
      </div>
    </section>
  );
}

function ProfileView({
  firstName,
  lastName,
  email,
  premium,
  onLogout,
}: {
  firstName: string;
  lastName: string;
  email: string;
  premium: boolean;
  onLogout: () => void;
}) {
  const router = useRouter();

  return (
    <section className="relative z-10">
      <div className="mb-5">
        <p
          className="text-[15px] tracking-[0.18em] text-[#b79a63]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Allure
        </p>
        <h1 className="text-xl font-semibold text-[#1b1712]">Profil</h1>
        <p className="text-sm text-[#7a6d5b]">
          Votre espace personnel, vos reglages et votre securite.
        </p>
      </div>

      <section className="rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#d8cab2] bg-[linear-gradient(180deg,#f4e7c5_0%,#d7bb80_100%)] text-[#2b241d] shadow-[0_10px_20px_rgba(188,150,77,0.2)]">
            <UserRound size={30} />
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a804b]">
              Compte principal
            </p>
            <h2 className="mt-1 text-[1.15rem] font-semibold text-[#1d1813]">
              {firstName} {lastName}
            </h2>
            <p className="truncate text-sm text-[#6f6250]">{email}</p>
            <div className="mt-2">
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                  premium
                    ? "bg-[#1b1712] text-[#f1dfb2]"
                    : "bg-[#efe5cf] text-[#8f7244]"
                }`}
              >
                {premium ? "Premium styliste" : "Compte standard"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[20px] bg-[#f4ecdf] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#1d1813]">
                {premium ? "Abonnement premium actif" : "Profil verifie"}
              </p>
              <p className="text-sm text-[#6f6250]">
                {premium
                  ? "Vous beneficiez d'un accompagnement styliste personnalise."
                  : "Compte securise et synchronise avec votre avatar."}
              </p>
            </div>
            <span className="rounded-full bg-[#1b1712] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#f1dfb2]">
              {premium ? "Premium" : "Actif"}
            </span>
          </div>
        </div>
      </section>

      <section className="mt-4 space-y-3">
        {profileSections.map((section) => {
          const Icon = section.icon;
          const content = (
            <div className="flex items-center gap-3 rounded-[24px] border border-[#d8cab2] bg-[#fbf8f1] p-4 shadow-[0_10px_22px_rgba(55,43,28,0.06)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#efe5cf] text-[#8f7244]">
                <Icon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[#1d1813]">{section.title}</p>
                <p className="text-sm text-[#6f6250]">{section.description}</p>
              </div>

              <ChevronRight size={18} className="text-[#9b8b74]" />
            </div>
          );

          if (section.href) {
            return (
              <Link key={section.title} href={section.href}>
                {content}
              </Link>
            );
          }

          return <div key={section.title}>{content}</div>;
        })}
      </section>

      <section className="mt-4 rounded-[24px] border border-[#d8cab2] bg-[#fbf8f1] p-4 shadow-[0_10px_22px_rgba(55,43,28,0.06)]">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1b1712] text-[#f1dfb2]">
            <Shield size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1d1813]">Connexion et sécurité</p>
            <p className="text-sm text-[#6f6250]">
              Gérez l&apos;accès à votre compte, votre mot de passe et vos sessions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="w-full rounded-full border border-[#d8cab2] bg-white px-4 py-3 text-sm font-semibold text-[#1d1813]"
        >
          Gérer l&apos;authentification
        </button>
      </section>

      <button
        type="button"
        onClick={onLogout}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#1b1712] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-[#f6f1e7] shadow-[0_12px_24px_rgba(22,17,12,0.24)]"
      >
        <LogOut size={16} />
        Déconnexion
      </button>
    </section>
  );
}

export default function LoginPage() {
  const { ready, user, login, logout } = useAuth();

  return (
    <>
      <main className="px-4 pb-28 pt-14">
        {!ready ? (
          <div className="rounded-[24px] border border-[#d8cab2] bg-[#fbf8f1] p-4 text-sm text-[#6f6250]">
            Chargement du profil...
          </div>
        ) : user ? (
          <ProfileView
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
            premium={user.premium}
            onLogout={logout}
          />
        ) : (
          <AuthenticationView onLogin={login} />
        )}
      </main>

      {ready && user ? <BottomNav /> : null}
    </>
  );
}
