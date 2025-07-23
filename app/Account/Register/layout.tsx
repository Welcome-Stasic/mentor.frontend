import { SITE_BASE_NAME } from "@/constants";
import { Metadata } from "next";

const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/Account/Register`;

export const metadata: Metadata = {
  title: `Регистрация | ${SITE_BASE_NAME}`,
  description: `Создание нового аккаунта в системе ${SITE_BASE_NAME}`,
  keywords: ['регистрация', 'создать аккаунт', 'новый пользователь', SITE_BASE_NAME],
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Регистрация | ${SITE_BASE_NAME}`,
    description: `Создание нового аккаунта в системе ${SITE_BASE_NAME}`,
    url: pageUrl,
    siteName: SITE_BASE_NAME,
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
