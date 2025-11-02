import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Conivra Orbit Gold",
  description: "Conivra Orbit Gold ile erişimi, etkileşimi ve iş akışınızı tek ekranda yönetin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${cairo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
