import { getAuthAxios } from "../authAxios";
import { WORKFLOW_INSTANCE_GET_STATUS } from "../endpoint";
import { IApiResponse } from "../types/base";
import { WorkflowInstanceStatus } from "../types/workflowInstance";

export async function getWorkflowInstanceStatus(id: number, token: string): Promise<IApiResponse<WorkflowInstanceStatus> | null> {
  try {
    if (!token) return null;

    const authAxios = await getAuthAxios(token);
    const res = await authAxios.get<IApiResponse<WorkflowInstanceStatus>>(`${WORKFLOW_INSTANCE_GET_STATUS}/${id}`);

    return res.data as IApiResponse<WorkflowInstanceStatus>;
  } catch (error) {
    console.error(error);
    return null;
  }
}
