import CredentialsProvider from "next-auth/providers/credentials";
import { decodeToken } from "@/lib/utils/decodeToken";

export const TokenProvider = CredentialsProvider({
  id: "token",
  name: "Token Provider",
  credentials: {
    token: { label: "Token", type: "text" }
  },
  async authorize(credentials) {
    const token = credentials?.token;
    
    if (!token) return null;

    try {
      const decoded = decodeToken(token);

      if (!decoded?.id) return null;

      return {
        id: decoded.id,
        email: decoded.email,
        accessToken: token,
        refreshToken: token,
        accessTokenExpires: decoded.exp * 1000
      };
    } catch (error) {
      console.error("TokenProvider Error:", error);
      return null;
    }
  }
});
