import { getAuthAxios } from "../authAxios";
import { USER_ME } from "../endpoint";
import { IApiResponse } from "../types/base";
import { ICurrentUser } from "../types/user";

export async function me(token: string): Promise<IApiResponse<ICurrentUser> | null> {
  try {
    if(!token) return null;

    const authAxios = await getAuthAxios(token);
    const res = await authAxios.get<IApiResponse<ICurrentUser>>(USER_ME);

    return res.data as IApiResponse<ICurrentUser>;
  } catch (error) {
    console.error(error);
    return null;
  }
}
