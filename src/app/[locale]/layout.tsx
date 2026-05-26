import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/ui/Navbar";
import IntroScreen from "@/components/portfolio/IntroScreen";
import { portfolioData } from "@/data/portfolio-data";

export async function generateStaticParams() {
  return [{ locale: "es" }, { locale: "en" }];
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://portafolio-frontend-wheat.vercel.app";

const DESCRIPTIONS = {
  en: "Solutions Architect & Senior Full-Stack Engineer with 15+ years building scalable microservices (.NET, Java, Node.js), high-performance web apps (Angular, React), and AI automation systems for enterprise clients.",
  es: "Solutions Architect y Senior Full-Stack Engineer con más de 15 años construyendo microservicios escalables (.NET, Java, Node.js), aplicaciones web de alto rendimiento (Angular, React) y sistemas de automatización IA para clientes empresariales.",
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale === "en" ? "en" : "es";
  const { personalInfo } = portfolioData;
  const name        = locale === "en" ? personalInfo.nameEn  : personalInfo.nameEs;
  const title       = locale === "en" ? personalInfo.titleEn : personalInfo.titleEs;
  const description = DESCRIPTIONS[locale];
  const pageTitle   = `${name} | ${title}`;

  return {
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
      images: [
        {
          url: `${BASE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [`${BASE_URL}/og-image.png`],
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
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <IntroScreen />
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
