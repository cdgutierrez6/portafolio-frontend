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

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale === "en" ? "en" : "es";
  const { personalInfo } = portfolioData;
  const name  = locale === "en" ? personalInfo.nameEn  : personalInfo.nameEs;
  const title = locale === "en" ? personalInfo.titleEn : personalInfo.titleEs;
  return {
    title: `${name} | Portfolio`,
    description: title,
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: { es: `${BASE_URL}/es`, en: `${BASE_URL}/en` },
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

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
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
