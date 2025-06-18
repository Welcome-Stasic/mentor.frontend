import { handleApiError } from "@/lib/utils/handleApiError";
import { AUTH_REFRESH_TOKEN } from "../endpoint";
import { IApiResponse } from "../types/base";
import { getAuthAxios } from "../authAxios";

export async function refreshToken(token: string): Promise<IApiResponse<string> | null> {
  try {
    const authAxios = await getAuthAxios(token);

    const res = await authAxios.post<IApiResponse<string>>(AUTH_REFRESH_TOKEN);
    
    return res.data;
  } catch (e) {
    handleApiError(e);
    return null;
  }
};