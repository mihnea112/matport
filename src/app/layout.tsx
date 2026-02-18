import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "MatPort - Piață de Materiale de Construcții",
  description:
    "Piața pentru surplusuri de materiale de construcții: vânzători verificați, prețuri transparente, tranzacții sigure."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&family=Noto+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light text-[#111418] antialiased overflow-x-hidden min-h-screen">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
