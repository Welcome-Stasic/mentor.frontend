import { SITE_BASE_NAME } from "@/constants";
import { Metadata } from "next";

const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/Account/PhoneLogin`;

export const metadata: Metadata = {
  title: `Войти по номеру телефона | ${SITE_BASE_NAME}`,
  description: `Вход по СМС на номер телефона ${SITE_BASE_NAME}`,
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Войти по номеру телефона | ${SITE_BASE_NAME}`,
    description: `Вход по СМС на номер телефона ${SITE_BASE_NAME}`,
    url: pageUrl,
    siteName: SITE_BASE_NAME,
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function PhoneLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
