export interface IProjectVm {
  id: string;
  creationDate: string;
  name: string;
  createUserId: string;
  status: number;
}

export interface ICreateProjectDto {
  name: string;
}

export interface IUpdateProjectCommand {
  id: string;
  name: string;
  status?: number;
}