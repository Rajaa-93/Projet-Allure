"use client";

import { useRouter } from "next/navigation";
import AllureLogo from "@/components/AllureLogo";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/lib/useAuth";
import { LockKeyhole, Mail, UserRound } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  return (
    <>
      <main className="relative min-h-full overflow-hidden bg-[#f6f1e7] px-4 pb-28 pt-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-18%] top-12 h-40 w-[130%] rotate-[-10deg] bg-[radial-gradient(ellipse_at_center,rgba(201,174,114,0.2),transparent_60%)]" />
          <div className="absolute right-[-15%] top-48 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(214,190,138,0.18),transparent_65%)]" />
        </div>

        <section className="relative z-10">
          <div className="mb-5">
            <AllureLogo className="relative mb-2 h-16 w-32" priority />
            <h1 className="text-xl font-semibold text-[#1b1712]">Inscription</h1>
            <p className="text-sm text-[#7a6d5b]">
              Creez votre compte avec vos informations personnelles.
            </p>
          </div>

          <section className="rounded-[28px] border border-[#d7cab2] bg-[#fbf8f1] p-5 shadow-[0_12px_28px_rgba(55,43,28,0.08)]">
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-[12px] font-medium text-[#3b3127]">Prenom</span>
                <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#ddd1bd] bg-white px-4">
                  <UserRound size={16} className="text-[#8a7a63]" />
                  <input
                    id="firstName"
                    defaultValue="Alice"
                    className="w-full bg-transparent text-sm text-[#2a241d] outline-none"
                  />
                </div>
              </label>

              <label className="space-y-1">
                <span className="text-[12px] font-medium text-[#3b3127]">Nom</span>
                <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#ddd1bd] bg-white px-4">
                  <UserRound size={16} className="text-[#8a7a63]" />
                  <input
                    id="lastName"
                    defaultValue="Martin"
                    className="w-full bg-transparent text-sm text-[#2a241d] outline-none"
                  />
                </div>
              </label>
            </div>

            <label className="mt-3 block space-y-1">
              <span className="text-[12px] font-medium text-[#3b3127]">Email</span>
              <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#ddd1bd] bg-white px-4">
                <Mail size={16} className="text-[#8a7a63]" />
                <input
                  id="email"
                  defaultValue="alice.allure@gmail.com"
                  className="w-full bg-transparent text-sm text-[#2a241d] outline-none"
                />
              </div>
            </label>

            <label className="mt-3 block space-y-1">
              <span className="text-[12px] font-medium text-[#3b3127]">Mot de passe</span>
              <div className="flex h-12 items-center gap-2 rounded-2xl border border-[#ddd1bd] bg-white px-4">
                <LockKeyhole size={16} className="text-[#8a7a63]" />
                <input
                  type="password"
                  defaultValue="Mypassword123"
                  className="w-full bg-transparent text-sm text-[#2a241d] outline-none"
                />
              </div>
            </label>

            <button
              type="button"
              onClick={() => {
                const firstNameInput = document.getElementById(
                  "firstName"
                ) as HTMLInputElement | null;
                const lastNameInput = document.getElementById(
                  "lastName"
                ) as HTMLInputElement | null;
                const emailInput = document.getElementById(
                  "email"
                ) as HTMLInputElement | null;

                register({
                  firstName: firstNameInput?.value || "Alice",
                  lastName: lastNameInput?.value || "Martin",
                  email: emailInput?.value || "alice.allure@gmail.com",
                  premium: false,
                });
                router.push("/login");
                router.refresh();
              }}
              className="mt-5 w-full rounded-full bg-[linear-gradient(180deg,#d8b66b_0%,#b68436_100%)] px-6 py-3.5 text-[17px] font-semibold text-[#201811] shadow-[0_0_0_1px_rgba(123,89,35,0.3),0_10px_24px_rgba(190,140,62,0.35),0_0_28px_rgba(214,175,95,0.35)]"
            >
              Creer mon compte
            </button>
          </section>
        </section>
      </main>

      <BottomNav />
    </>
  );
}
