import { SITE_BASE_NAME } from "@/constants";
import { Metadata } from "next";

export const metadata: Metadata  = {
  title: `Регистрация | ${SITE_BASE_NAME}`,
  description: `Регистрация пользователя в системе ${SITE_BASE_NAME}`,
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
