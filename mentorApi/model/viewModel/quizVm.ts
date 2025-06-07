export interface IQuizVm  {
  id: string;
  creationDate: Date;
  finishDate: Date;
  isCompleted: boolean;
  stage: number;
  questions: string[];
  applicationUserId: string
}