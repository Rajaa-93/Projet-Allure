import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Allure",
  description: "Allure - version iPhone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${cormorant.variable}`}>
        <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-6">
          <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[42px] border-[6px] border-[#c9ae72] bg-[#f6f1e7] shadow-[0_25px_80px_rgba(0,0,0,0.55)]">
            <div className="absolute left-1/2 top-2 z-50 h-7 w-40 -translate-x-1/2 rounded-full bg-[#0b0b0b]" />

            <div className="h-full overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}