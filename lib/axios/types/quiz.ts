export interface IQuiz  {
  id: string;
  creationDate: Date;
  finishDate: Date;
  isCompleted: boolean;
  stage: number;
  questions: string[];
  applicationUserId: string;
  selectedDepartmentId: string;
  institution: string;
  course: string;
  specialty: string;
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

export interface IUpdateFirstStageDto {
  quizId: string;
  lastName: string;
  firstName: string;
  middleName: string;
  place: string;
  phoneNumber: string;
  birthDate: Date;
  isAccepted: boolean;
  specialty: string;
  institution: string;
  course: number;
}

export interface IUpdateQuizDto {
  quizId: string;
  stage?: number;
  IsCompleted?: boolean;
  finishDate?: Date
  departmentId?: string;
}