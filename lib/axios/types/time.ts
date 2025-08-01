export interface IWorkTime {
  entityId: number;
  type: number;
  minutes: number | null;
  dateTime: string;
  project: string;
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

export interface IGetApproveTimeDto {
  crmUserId: string;
  year: number;
  month: number;
}

export interface ICancelApproveTimeDto {
  id: string;
}

export interface IApproveTimeDto {
  crmUserId: string;
  year: number;
  month: number;
  approveCrmUserId: string;
  comment: string;
}

export interface IApproveTime {
  id: string;
  userId: string;
  year: number;
  month: number;
  approveUser: string;
  comment: string;
  date: string;
}