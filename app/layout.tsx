import type { Metadata, Viewport } from "next";
import { Archivo, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Display: athletic wide grotesk for the departure-board hero, fixtures, wordmark.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

// Body / UI: clean humanist grotesk.
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kickoff — World Cup 26 Miami",
  description:
    "Get to the match, not the traffic. The match-day arrival router for the FIFA World Cup 26 at Hard Rock Stadium, Miami.",
};

export const viewport: Viewport = {
  themeColor: "#10131c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
