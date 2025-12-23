import { useWorkTime } from "@/hooks/useWorkTime";

export const useProjectTime = (userId: string, dateFrom: string, dateTo: string) => {
  const workTime = useWorkTime(userId, dateFrom, dateTo);
  
  const projectTimeMap = new Map<string, number>();
  
  if (workTime.data) {
    workTime.data.forEach((item) => {
      const projectName = item.project?.trim() || "Без проекта";
      const current = projectTimeMap.get(projectName) || 0;
      projectTimeMap.set(projectName, current + (item.minutes || 0));
    });
  }
  
  return {
    ...workTime,
    projectTimeMap,
  };
};