import { JWT } from "next-auth/jwt";
import { API } from "../axios";
import { decodeToken } from "./decodeToken";

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await API.auth.refreshToken(token.accessToken);

    const accessToken = response?.Result || null;

    if (!accessToken) return { ...token, error: 'RefreshAccessTokenError' };
    
    const refreshToken = accessToken;

    const decoded = decodeToken(accessToken);

    return {
      ...token,
      accessToken,
      refreshToken,
      accessTokenExpires: decoded.exp * 1000,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { ...token, error: 'RefreshTokenError' };
  }
}