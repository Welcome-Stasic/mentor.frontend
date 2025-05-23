const BASE_URL = 'https://devmentor.eriskip.com:6443';
const API_ROUTE = 'api';
const VERSION = 'v1';
const API_URL = `${BASE_URL}/${API_ROUTE}/${VERSION}`;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//ExpireToken
const EXPIRE_TOKEN = 'ExpireToken';

export function getExpireTokenUrl(token: string) {
  return `${API_URL}/${EXPIRE_TOKEN}/${token}`;
}
//----

//Auth
const AUTH = 'Auth';

const POST_CRM_LOGIN = 'CrmLogin';

export function getCrmLoginUrl() {
  return `${API_URL}/${AUTH}/${POST_CRM_LOGIN}`;
}
//----