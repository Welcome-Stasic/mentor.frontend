import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import { SITE_BASE_NAME } from '@/constants';


const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}`;

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.ico',
  },
  title: `Главная | ${SITE_BASE_NAME}`,
  description: `Добро пожаловать на главную страницу ${SITE_BASE_NAME}`,
  keywords: ['главная', SITE_BASE_NAME, 'эрис'],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Главная | ${SITE_BASE_NAME}`,
    description: `Добро пожаловать на главную страницу ${SITE_BASE_NAME}`,
    url: pageUrl,
    siteName: SITE_BASE_NAME,
    locale: 'ru_RU',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
