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
const LOGIN = 'Login';
const POST_REGISTER = 'Register';
const REFRESH_TOKEN = 'RefreshToken'

export function getCrmLoginUrl() {
  return `${API_URL}/${AUTH}/${POST_CRM_LOGIN}`;
}

export function getRegisterUrl() {
  return `${API_URL}/${AUTH}/${POST_REGISTER}`;
}

export function getLoginUrl() {
  return `${API_URL}/${AUTH}/${LOGIN}`;
}

export function getRefreshTokenUrl() {
  return `${API_URL}/${AUTH}/${REFRESH_TOKEN}`;
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

//Quiz
const QUIZ = 'Quiz'
const QUIZ_GET_ALL = 'GetAll'

export function getQuizByIdUrl(id: string) {
  return `${API_URL}/${QUIZ}/${id}`;
}

export function getGetAllQuiz(applicationUserId: string) {
  const url = new URL(`${API_URL}/${QUIZ}/${QUIZ_GET_ALL}`);

  url.searchParams.append('applicationUserId', applicationUserId);

  return url.toString();
}
//----