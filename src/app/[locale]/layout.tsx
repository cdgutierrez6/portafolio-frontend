import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/ui/Navbar";
import Preloader from "@/components/portfolio/Preloader";
import { portfolioData } from "@/data/portfolio-data";
import { yearsOfExperience } from "@/lib/experience";

/**
 * Archivo (variable): es la grotesca que usan las referencias premium (thepatchsystem
 * lleva su H1 a 270px con ella). Con una fuente de sistema, un titular de 200px se ve
 * barato; con una display de verdad, se ve caro.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://portafolio-frontend-wheat.vercel.app";

const yrs = yearsOfExperience();

const DESCRIPTIONS = {
  en: `Solutions Architect & Senior Full-Stack Engineer with ${yrs}+ years building scalable microservices (.NET, Java, Node.js), high-performance web apps (Angular, React), and AI automation systems for enterprise clients.`,
  es: `Solutions Architect y Senior Full-Stack Engineer con más de ${yrs} años construyendo microservicios escalables (.NET, Java, Node.js), aplicaciones web de alto rendimiento (Angular, React) y sistemas de automatización IA para clientes empresariales.`,
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale === "en" ? "en" : "es";
  const { personalInfo } = portfolioData;
  const name        = locale === "en" ? personalInfo.nameEn  : personalInfo.nameEs;
  const title       = locale === "en" ? personalInfo.titleEn : personalInfo.titleEs;
  const description = DESCRIPTIONS[locale];
  const pageTitle   = `${name} | ${title}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: pageTitle,
    description,
    keywords: ["Solutions Architect", "Senior Full-Stack Engineer", "Microservices", ".NET", "Java", "React", "Angular", "AI Automation", "Colombia"],
    authors: [{ name, url: `${BASE_URL}/${locale}` }],
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: { es: `${BASE_URL}/es`, en: `${BASE_URL}/en` },
    },
    openGraph: {
      type: "profile",
      locale: locale === "en" ? "en_US" : "es_CO",
      alternateLocale: locale === "en" ? "es_CO" : "en_US",
      url: `${BASE_URL}/${locale}`,
      siteName: `${name} | Portfolio`,
      title: pageTitle,
      description,
      // La imagen OG (1200×630) la genera dinámicamente `opengraph-image.tsx`
      // con next/og — Next inyecta og:image y twitter:image automáticamente.
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 3).map(w => w[0].toUpperCase()).join("");
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale === "en" ? "en" : "es";
  const { settings, personalInfo } = portfolioData;
  const initials = getInitials(locale === "en" ? personalInfo.nameEn : personalInfo.nameEs);

  const cssVars = `
    :root {
      --color-primary: ${settings.primaryColor};
      --color-secondary: ${settings.secondaryColor};
      --color-accent: ${settings.accentColor};
      --color-bg: ${settings.bgColor};
      --color-text: ${settings.textColor};
      --color-card: ${settings.cardColor};
      --color-navbar: ${settings.navbarColor};
    }
  `;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: locale === "en" ? personalInfo.nameEn : personalInfo.nameEs,
    jobTitle: locale === "en" ? personalInfo.titleEn : personalInfo.titleEs,
    description: DESCRIPTIONS[locale],
    url: `${BASE_URL}/${locale}`,
    email: personalInfo.email,
    address: { "@type": "PostalAddress", addressLocality: "Manizales", addressCountry: "CO" },
    sameAs: [personalInfo.githubUrl, personalInfo.linkedinUrl].filter(Boolean),
  };

  return (
    <html lang={locale} className={archivo.variable}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Grid punteado + grano: la textura que sustituye a las partículas (cliché). */}
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-grain" aria-hidden="true" />

        <Preloader locale={locale} />
        <Navbar locale={locale} initials={initials} />
        <main>{children}</main>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: settings.cardColor,
              color: settings.textColor,
              border: `1px solid ${settings.primaryColor}40`,
            },
          }}
        />
      </body>
    </html>
  );
}
