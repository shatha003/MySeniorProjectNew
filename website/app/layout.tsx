import type { Metadata } from "next";
import { Fredoka, Nunito, Balsamiq_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { I18nProvider } from "./components/i18n-provider";

const fredoka = Fredoka({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const balsamiqSans = Balsamiq_Sans({
  variable: "--font-comic",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "CHEA - Your Cyber-Defender Toolkit",
  description: "The ultimate digital shield built for the next generation. Master the internet, protect your data, and level up your security skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1" 
        />
      </head>
      <body className={`${fredoka.variable} ${nunito.variable} ${balsamiqSans.variable} antialiased`}>
        <I18nProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
