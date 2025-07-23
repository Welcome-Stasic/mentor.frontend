import { SITE_BASE_NAME } from '@/constants';
import { Metadata } from 'next';

const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/Account/Login`;

export const metadata: Metadata = {
  title: `Авторизация | ${SITE_BASE_NAME}`,
  description: `Авторизация пользователя в системе ${SITE_BASE_NAME}`,
  keywords: ['вход', 'авторизация', 'вход в аккаунт', SITE_BASE_NAME],
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: `Авторизация | ${SITE_BASE_NAME}`,
    description: `Вход в личный кабинет ${SITE_BASE_NAME}`,
    url: pageUrl,
    siteName: SITE_BASE_NAME,
    locale: 'ru_RU',
    type: 'website',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
