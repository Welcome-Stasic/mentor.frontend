import { IDepartment } from "./department";

export interface ICurrentUser {
  id: string;
  userName: string;
  Email: string;
  elmaUserId?: string;
  juniorId?: string;
  quizId?: string;
  phoneNumber?: string
  fullName: string
}

export interface ICrmUser {
  id: string,
  userName: string,
  fullName: string,
  status: number,
  eMail: string,
  mobilePhone: string,
  workPhone: string,
  birthDate: string,
  userInfo: {
    id: number,
    userId: number,
    photoAttachmentId: number,
    photo: {
      id: number,
      file: string
    }
    department: IDepartment,
  }
  isMentor: boolean;
  juniorIds: number[];
  photoUrl: string;
}

export interface ICrmUserVm {
  id: string,
  userName: string,
  status: number,
  fullName: string,
  lastName: string;
  firstName: string;
  middleName: string;
}

export interface IApplicationUser {
  id: string;
  elmaUserId?: number;
  birthDay?: string;
  photoUid?: string;
  isWithOutQuiz: boolean;
  quizId?: string;
  acceptedPrivacyAgreement: boolean;
  lastName: string;
  firstName: string;
  middleName: string;
  address: string;
  email: string;
  isEmailConfirmed: boolean;
  phoneNumber: string;
  userName: string;
  isOnline: boolean;
  fullName: string;
}

export interface IUserPhoto{
  key:string;
  url:string;
}

export interface IUserRefLink{
  referralUrl:string;
  qrCodeBase64:string;
}

export interface IJunior{
  id: number;
  name: string;
  mentorId: number | null;
  photoUrl: string;
  email: string;
  phone: string;
  departmentId: number | null;
  departmentName: string;
}

export interface IMentor{
  id: number;
  name: string;
  photoUrl: string;
  emails: string[];
  phones: string[];
  departmentId: number | null;
  departmentName: string;
}

export interface IAssignRoleDto {
  userId: string,
  role: string,
}

export interface IBindingToCrmDto {
  appId: string,
  crmId: string,
}

export interface IGetAllJuniorsDto {
  includeOnly?: boolean | null,
  userIds: number[],
}