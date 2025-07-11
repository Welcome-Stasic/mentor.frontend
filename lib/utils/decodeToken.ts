import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  exp: number;
  id: string; // will be replaced with the value from the name‑identifier claim
  email: string;
  isWithOutQuiz: string;
  [claim: string]: unknown;
}

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role' as const;
const ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier' as const;

type Roles = string[];

export function decodeToken(token: string): DecodedToken & { roles: Roles } {
  const decoded = jwtDecode<DecodedToken>(token);

  const rawRoles = decoded[ROLE_CLAIM] as unknown;
  const rawId = decoded[ID_CLAIM] as unknown;

  const roles: Roles = Array.isArray(rawRoles)
    ? rawRoles.filter((role): role is string => typeof role === 'string')
    : typeof rawRoles === 'string'
    ? [rawRoles]
    : [];

  const id = typeof rawId === 'string' ? rawId : '';

  return {
    ...decoded,
    roles,
    id,
  };
}
