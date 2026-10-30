import type { Metadata } from "next";
import { Epilogue, Kantumruy_Pro } from "next/font/google";
import Link from "next/link";
import { LogoMark } from "@/components/layout/Logo";
import { buttonClasses } from "@/components/ui/Button";
import "./globals.css";

const epilogue = Epilogue({ subsets: ["latin"], variable: "--font-epilogue" });
const kantumruy = Kantumruy_Pro({ subsets: ["khmer", "latin"], variable: "--font-kantumruy" });

export const metadata: Metadata = {
  title: "Page not found · Book in Cambodia",
  robots: { index: false },
};

/** Shown for any unknown URL. The locale isn't known here, so it is bilingual. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${epilogue.variable} ${kantumruy.variable}`}>
      <body>
        <main className="flex min-h-screen items-center justify-center p-4">
          <div className="flex max-w-xl flex-col items-center gap-5 rounded-lg bg-primary-tint px-6 py-14 text-center">
            <LogoMark size={48} />
            <h1 className="text-4xl tracking-tightest md:text-5xl">
              Page not found <span className="text-primary">· 404</span>
            </h1>
            <p lang="km" className="text-xl text-body-strong">
              រកមិនឃើញទំព័រនេះទេ
            </p>
            <p>The page may have moved, or the book or store was removed.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/en" className={buttonClasses("primary")}>
                Go to the home page
              </Link>
              <Link href="/km" lang="km" className={buttonClasses("outline")}>
                ទៅទំព័រដើម
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
