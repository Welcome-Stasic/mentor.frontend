import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  id: string;
  email: string;
  [key: string]: unknown;
}

export function decodeToken(token: string): DecodedToken {
  return jwtDecode<DecodedToken>(token);
}