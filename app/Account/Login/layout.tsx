import { SITE_BASE_NAME } from "@/app/constants";
import { Metadata } from "next";

export const metadata: Metadata  = {
  title: `Авторизация | ${SITE_BASE_NAME}`,
  description: `Авторизация пользователя в системе ${SITE_BASE_NAME}`,
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
