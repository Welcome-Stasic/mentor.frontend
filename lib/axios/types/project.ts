export interface IProjectVm {
  id: string;
  creationDate: string;
  name: string;
  createUserId: string;
  createUserFullName: string;
  createUserName: string;
  status: number;
}

export interface ICreateProjectDto {
  name: string;
  userId: string;
}

export interface IUpdateProjectCommand {
  id: string;
  name: string;
  status?: number;
}