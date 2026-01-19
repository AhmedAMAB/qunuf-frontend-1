
import {Cairo, Inter, Open_Sans, Roboto_Mono} from 'next/font/google';
import "../../styles/globals.css";
import Providers from "../ServerProviders";
import { routing } from "@/i18n/routing";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";



export const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap'
});

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap'
});

const arabicFont = Cairo({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap'
});


export async function generateMetadata() {
  const t = await getTranslations("root");

  return {
    title: {
      default: t("siteName"),          // 👈 localized default
      template: `${t("siteName")} | %s`, // 👈 localized template
    },
    description: t("description"),
  };
}


export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <>
      <html lang={locale} className={`${arabicFont.variable} ${openSans.variable} ${robotoMono.variable} ${inter.variable}`} dir={locale == 'en' ? 'ltr' : 'rtl'}>

        <body className={`$ `}>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </>
  );
}
