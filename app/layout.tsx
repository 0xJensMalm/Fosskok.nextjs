import type { Metadata } from "next";
import { Josefin_Sans, Rammetto_One } from "next/font/google";
import "./globals.css";
import Navbar from "../src/components/Navbar";
import Footer from "../src/components/Footer";
import { ThemeProvider } from "../src/context/ThemeContext";
import { Analytics } from "@vercel/analytics/react";
import PromoPopup from "../src/components/PromoPopup";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-josefin",
  display: "swap"
});
const rammetto = Rammetto_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-rammetto",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Fosskok",
  description: "Fosskok Art Collective",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" suppressHydrationWarning>
      <body className={`${josefin.className} ${rammetto.variable}`} suppressHydrationWarning>
        <ThemeProvider>
          <PromoPopup />
          <div className="page-container">
            <Navbar />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
