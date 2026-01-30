import type { Metadata } from "next";
import { Lora, Manrope } from "next/font/google";
import { ThemeProviders } from "@/components/theme-providers";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuthorityTech Blog | Performance PR & AI Visibility",
  description: "Daily insights at the intersection of performance PR and AI visibility. Practical guidance for founders on earned media and how PR actually works.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="antialiased font-ui text-foreground bg-background">
        <ThemeProviders>
          <SiteHeader />
          <div className="relative z-10 pt-14">{children}</div>
        </ThemeProviders>
      </body>
    </html>
  );
}
