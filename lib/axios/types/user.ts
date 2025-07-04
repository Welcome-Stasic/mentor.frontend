export interface ICurrentUser {
  id: string;
  userName: string;
  Email: string;
  elmaUserId?: string;
  juniorId?: string;
  quizId?: string;
  phoneNumber?: string
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
  }
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
}