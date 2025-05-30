'use client'

import { useAutoLogout } from "@/hooks/useAutoLogout"

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  useAutoLogout()
  return <>{children}</>
}
