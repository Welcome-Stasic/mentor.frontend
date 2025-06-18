import { getAuthAxios } from "../authAxios";
import { USER_CRM } from "../endpoint";
import { IApiResponse } from "../types/base";
import { ICrmUser } from "../types/user";

export async function getCrmUserById(crmUserId: string, token: string): Promise<IApiResponse<ICrmUser> | null> {
  try {
    if(!token) return null;

    const authAxios = await getAuthAxios(token);
    const res = await authAxios.get<IApiResponse<ICrmUser>>(`${USER_CRM}/${crmUserId}`);

    return res.data as IApiResponse<ICrmUser>;
  } catch (error) {
    console.error(error);
    return null;
  }
}
