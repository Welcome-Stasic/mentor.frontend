const BASE_URL = 'https://developmentmentor.eriskip.com';

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

//User
const USER = 'User';
const CRM = 'Crm';

const GET_ME = 'Me';

export function getMeUrl() {
  return `${API_URL}/${USER}/${GET_ME}`;
}

export function getCrmUserUrl(userId: string) {
  return `${API_URL}/${USER}/${CRM}/${userId}`;
}
//----