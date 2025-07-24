export interface IWorkTime {
  entityId: number;
  workedTimeType: number;
  minutes?: number
  dateTime: string;
  task: string;
  comment: string;
}

export interface IReportTime {
  minutes: number;
  factMinutes: number;
  workDays: number;
  etcDays: number;
  holidays: number;
  fullWorkHours: number;
  workHours: number;
  etcHours: number;
}