import "./globals.css";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata = {
  title: "Matport — B2B Surplus Materials Marketplace",
  description:
    "Sell leftover construction materials fast. Free up stock. Improve cashflow.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ro" className={manrope.variable}>
      <body className="min-h-screen bg-white text-brand-navy antialiased">
        {children}
      </body>
    </html>
  );
}