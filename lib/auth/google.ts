import { JWT } from "next-auth/jwt";
import { authGoogle } from "../utils/authGoogle";

export async function handleGoogleLogin(token: JWT, accessToken: string) {
  if (!accessToken || !accessToken.trim()) {
    return {
      ...token,
      accessToken: "",
      refreshTokenValid: false,
      error: "MissingAccessToken",
    };
  }
  return await authGoogle(token, { authCode: accessToken });
}
