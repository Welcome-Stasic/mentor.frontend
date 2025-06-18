import { AUTH_IS_EMAIL_CONFIRMED, AUTH_RESET_PASSWORD } from './../endpoint';
import { handleApiError } from "@/lib/utils/handleApiError";
import axiosInstance from "../axios";
import { AUTH_CRM_LOGIN, AUTH_FORGOT_PASSWORD, AUTH_LOGIN, AUTH_REGISTER } from "../endpoint";
import { IAppLoginDto, ICrmLoginDto, IRegisterDto, IResetPasswordDto } from "../types/auth";
import { IApiResponse } from "../types/base";

export async function login (payload: IAppLoginDto): Promise<IApiResponse<string> | null> {
  try {
    const res = await axiosInstance.post<IApiResponse<string>>(AUTH_LOGIN, payload);
    return res.data;
  } catch (e) {
    handleApiError(e);
    return null;
  }
};

export async function crmLogin (payload: ICrmLoginDto): Promise<IApiResponse<string> | null> {
  try {
    const res = await axiosInstance.post<IApiResponse<string>>(AUTH_CRM_LOGIN, payload);
    return res.data;
  } catch (e) {
    handleApiError(e);
    return null;
  }
};

export async function register (payload: IRegisterDto): Promise<IApiResponse<string> | null> {
  try {
    const res = await axiosInstance.post<IApiResponse<string>>(AUTH_REGISTER, payload);
    return res.data;
  } catch (e) {
    handleApiError(e);
    return null;
  }
};

export async function forgotPassword (email: string): Promise<IApiResponse<string> | null> {
  try {
    const res = await axiosInstance.post<IApiResponse<string>>(AUTH_FORGOT_PASSWORD, { email });
    return res.data;
  } catch (e) {
    handleApiError(e);
    return null;
  }
};

export async function resetPassword (payload: IResetPasswordDto): Promise<IApiResponse<boolean> | null> {
  try {
    const res = await axiosInstance.post<IApiResponse<boolean>>(AUTH_RESET_PASSWORD, payload);
    return res.data;
  } catch (e) {
    handleApiError(e);
    return null;
  }
};

export async function isEmailConfirmed (email: string): Promise<IApiResponse<boolean> | null> {
  try {
    const res = await axiosInstance.post<IApiResponse<boolean>>(AUTH_IS_EMAIL_CONFIRMED, { email });
    return res.data;
  } catch (e) {
    handleApiError(e);
    return null;
  }
};