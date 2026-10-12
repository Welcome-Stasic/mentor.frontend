import { FilterKey } from "./types";

export type FilterConfig = {
  key: FilterKey;
  label: string;
};

export const QUIZ_FILTERS: FilterConfig[] = [
  { key: "isCurrentlyWorking", label: "Работают в настоящее время" },
];
