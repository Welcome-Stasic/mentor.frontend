import { API } from "@/lib/axios";
import { IGetApproveTimeDto } from "@/lib/axios/types/time";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export const useApproveTimeInfo = (params: IGetApproveTimeDto) => {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  return useQuery({
    queryKey: ['approveTimeInfo', {...params}],
    queryFn: () => API.time.getApproveTimeInfo(params, accessToken),
    enabled: !!accessToken,
    select: (data) => data?.Result || null,
  });
};