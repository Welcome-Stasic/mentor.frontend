import { useEffect } from 'react'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

export function useAutoLogout() {
  const router = useRouter()

  useEffect(() => {
    const token = getCookie('token') as string

    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]))
    const timeout = payload.exp * 1000 - Date.now()

    if (timeout > 0) {
      const timer = setTimeout(() => {
        router.replace('/Account/Login')
      }, timeout)

      return () => clearTimeout(timer)
    } else {
      router.replace('/Account/Login')
    }
  }, [router])
}
