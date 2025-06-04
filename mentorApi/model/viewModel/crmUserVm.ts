export interface ICrmUserVm {
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