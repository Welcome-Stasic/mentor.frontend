import { SITE_BASE_NAME } from "@/constants";
import { Metadata } from "next";

export const metadata: Metadata  = {
  title: `Cмена пароля | ${SITE_BASE_NAME}`,
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
