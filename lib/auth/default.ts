import { User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

export function handleDefaultLogin(token: JWT, user: User | AdapterUser, now: number) {
  return {
    ...token,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    refreshTokenExpires: user.refreshTokenExpires,
    refreshTokenValid: true,
    justLoggedIn: true,
    lastChecked: now,
  };
}