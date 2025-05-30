import { jwtDecode } from "jwt-decode";

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode(token)

    if (!decoded || !decoded.exp) return true

    const now = new Date().getTime();
    
    return decoded.exp * 1000 < now
  } catch {
    return true
  }
}
