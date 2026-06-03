"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="relative min-h-full overflow-hidden bg-[#f6f1e7] px-6 pb-10 pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-[36%] h-40 w-[140%] rotate-[-10deg] bg-[radial-gradient(ellipse_at_center,rgba(201,174,114,0.28),transparent_60%)]" />
        <div className="absolute left-[-10%] top-[42%] h-28 w-[130%] rotate-[8deg] bg-[radial-gradient(ellipse_at_center,rgba(214,190,138,0.22),transparent_62%)]" />
        <div className="absolute inset-x-0 top-[30%] h-px bg-gradient-to-r from-transparent via-[#d8c08a]/60 to-transparent" />
      </div>

      <section className="relative z-10 flex min-h-[760px] flex-col">
        <div className="pt-6 text-center">
          <div className="mx-auto mb-3 flex h-20 w-16 items-center justify-center">
            <div className="relative h-16 w-10">
              <div className="absolute bottom-0 left-1/2 h-10 w-7 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#f0deb3_0%,#c79d47_55%,#8f6a2d_100%)] blur-[0.2px]" />
              <div className="absolute left-1/2 top-1 h-10 w-5 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#fff2cf_0%,#dbb86a_60%,#a37731_100%)] [clip-path:polygon(48%_0%,78%_16%,92%_40%,74%_70%,55%_100%,39%_75%,17%_52%,24%_25%)]" />
              <div className="absolute left-[52%] top-0 h-8 w-4 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#fff7dc_0%,#e2c57b_65%,#ae8440_100%)] [clip-path:polygon(48%_0%,80%_22%,88%_48%,69%_76%,46%_100%,28%_79%,20%_50%,26%_24%)]" />
            </div>
          </div>

          <p
            className="text-6xl leading-none text-[#b89a61]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Allure
          </p>

          <h1 className="mt-5 text-[26px] font-medium text-[#1d1914]">
            Connectez-vous
          </h1>
        </div>

        <div className="mt-10 space-y-6">
          <div className="space-y-4">
            <div className="flex h-14 items-center rounded-full border border-[#ddd1bd] bg-[#fbf8f1] px-5 shadow-[0_6px_14px_rgba(60,45,25,0.08)]">
              <UserRound size={18} className="mr-3 text-[#8a7a63]" />
              <input
                type="email"
                defaultValue="alice.allure@gmail.com"
                placeholder="Adresse mail"
                className="w-full bg-transparent text-[17px] text-[#2a241d] outline-none"
              />
            </div>

            <div className="flex h-14 items-center rounded-full border border-[#ddd1bd] bg-[#fbf8f1] px-5 shadow-[0_6px_14px_rgba(60,45,25,0.08)]">
              <LockKeyhole size={18} className="mr-3 text-[#8a7a63]" />
              <input
                type={showPassword ? "text" : "password"}
                defaultValue="Mypassword123"
                placeholder="Mot de passe"
                className="w-full bg-transparent text-[17px] text-[#2a241d] outline-none"
              />

              <span className="mr-3 rounded-full bg-[#e7d2a0] px-2 py-1 text-[10px] font-semibold text-[#7d5e23]">
                IA Vérifié
              </span>

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
              Mot de passe oublié ?
            </button>
          </div>

          <button className="mx-auto block w-[78%] rounded-2xl bg-[linear-gradient(180deg,#d8b66b_0%,#b68436_100%)] px-6 py-3.5 text-[18px] font-semibold text-[#201811] shadow-[0_0_0_1px_rgba(123,89,35,0.3),0_10px_24px_rgba(190,140,62,0.35),0_0_28px_rgba(214,175,95,0.45)]">
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
              href="#"
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
    </main>
  );
}