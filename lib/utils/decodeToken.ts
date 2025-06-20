import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  id: string;
  email: string;
  isWithOutQuiz: string;
  [key: string]: unknown;
}

export function decodeToken(token: string): DecodedToken & { roles: string[] } {
  const decoded = jwtDecode<DecodedToken>(token);

  const rawRoles = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  let roles: string[] = [];

  if (typeof rawRoles === "string") {
    roles = [rawRoles];
  } else if (Array.isArray(rawRoles)) {
    roles = rawRoles.filter(role => typeof role === "string");
  }

  return {
    ...decoded,
    roles,
  };
}
