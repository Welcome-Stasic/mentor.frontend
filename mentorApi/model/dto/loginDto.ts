type baseLoginDto = {
  password: string;
}

export interface crmLoginDto extends baseLoginDto  {
  login: string;
  password: string;
}
export interface  appLoginDto extends baseLoginDto  {
  email: string
  password: string;
}
