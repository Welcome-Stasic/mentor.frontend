export interface IWorkTime {
  entityId: number;
  type: number;
  minutes: number | null;
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
  timeItems: IReportTimeItem[]
}

export  interface IReportTimeItem {
  timeIn: string;
  timeOut: string;
  fullTime: number;
}

export interface ICreateTimeDto {
  crmUserId: number;
  project: string;
  task: string;
  comment: string;
  minutes: number;
  date: string;
}

export interface IUpdateTimeDto {
  entityId: number;
  type: number;
  minutes: number | null
  task: string;
  comment: string;
}

export interface IDeleteTimeDto {
  entityId: number;
  type: number;
}