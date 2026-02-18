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

const SITE_URL = "https://blog.authoritytech.io";

export const metadata: Metadata = {
  title: "Machine Relations (MR) Insights | AuthorityTech Blog",
  description:
    "The definitive source for Machine Relations (MR) and GEO. Daily strategic intelligence on securing persistent AI citations for venture-backed founders.",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  icons: { icon: "/favicon.png" },
  robots: { index: true, follow: true },
};

const rootJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Blog", "Periodical", "DataFeed"],
      "@id": `${SITE_URL}/#blog`,
      name: "Machine Relations (MR) Insights",
      url: SITE_URL,
      description:
        "Daily high-frequency intelligence on Machine Relations (MR) and Generative Engine Optimization (GEO) authored by Jaxon Parrott.",
      keywords: "Machine Relations, MR, GEO, AI-Native, AI Search Citations",
      publisher: {
        "@type": "Organization",
        "@id": "https://authoritytech.io/#organization",
        name: "AuthorityTech",
        alternateName: "The First AI-Native Machine Relations Agency",
        url: "https://authoritytech.io",
        logo: "https://storage.googleapis.com/authoritytech-prod-assets/public/logos/authoritytech-white-logo.png",
        sameAs: [
          "https://curated.authoritytech.io",
          "https://blog.authoritytech.io",
          "https://machinerelations.ai",
          "https://app.authoritytech.io/visibility-audit",
          "https://www.linkedin.com/company/authoritytech",
          "https://x.com/authoritytechio",
          "https://github.com/AuthorityTech",
          "https://www.crunchbase.com/organization/authoritytech",
          "https://medium.com/authoritytech",
          "https://www.inc.com/profile/AuthorityTech",
          "https://theorg.com/org/authoritytech",
        ],
      },
      author: [
        {
          "@type": "Person",
          "@id": "https://jaxonparrott.com/#person",
          name: "Jaxon Parrott",
          url: "https://jaxonparrott.com",
          jobTitle: "CEO & Machine Relations Architect",
          worksFor: { "@id": "https://authoritytech.io/#organization" },
          sameAs: [
            "https://jaxonparrott.com",
            "https://www.entrepreneur.com/author/jaxon-parrott",
            "https://medium.com/@jaxon-parrott",
            "https://www.linkedin.com/in/jaxon-parrott-b91838128/",
            "https://x.com/jaxonparrott",
            "https://github.com/jaxonparrott",
          ],
        },
        {
          "@type": "Person",
          "@id": "https://authoritytech.io/#christian",
          name: "Christian Lehman",
          url: "https://authoritytech.io",
          jobTitle: "CGO & MR Growth Strategist",
          worksFor: { "@id": "https://authoritytech.io/#organization" },
          sameAs: [
            "https://www.linkedin.com/in/christianhlehman/",
            "https://x.com/christianlehman",
            "https://medium.com/@christian-lehman",
          ],
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased font-ui text-foreground bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootJsonLd) }}
        />
        <ThemeProviders>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <SiteHeader />
            <main className="flex-1 pt-14">{children}</main>
          </div>
        </ThemeProviders>
      </body>
    </html>
  );
}
