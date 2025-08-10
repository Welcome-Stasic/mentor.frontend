type baseLoginDto = {
  password: string;
}

export interface ICrmLoginDto extends baseLoginDto  {
  login: string;
  password: string;
}

export interface IAppLoginDto extends baseLoginDto  {
  email: string;
  password: string;
}

export interface IYandexLoginDto {
  authCode: string;
}

export interface IRegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export type IResetPasswordDto = {
  email: string;
  password: string;
  confirmPassword: string;
  token: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpires: string
}

export interface IRefreshToken {
  token: string;
  id: string;
  expires: string
}