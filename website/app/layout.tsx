import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "CHEA - Comprehensive Cybersecurity Suite",
  description: "A powerful desktop cybersecurity application featuring encrypted password vaults, real-time threat scanning, and advanced security analysis tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#05050a" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
