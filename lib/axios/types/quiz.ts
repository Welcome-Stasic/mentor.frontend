export interface IQuiz  {
  id: string;
  creationDate: Date;
  finishDate: Date;
  isCompleted: boolean;
  stage: number;
  questions: string[];
  applicationUserId: string
}

export interface IAddAnswersToQuestionsDto {
  quizId: string;
  questions: IQuestion[];
}

export interface IQuestion {
  question: string;
  answer: string; 
  number: number;
}