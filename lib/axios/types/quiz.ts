export interface IQuiz  {
  id: string;
  creationDate: Date;
  finishDate: Date;
  isCompleted: boolean;
  stage: number;
  questions: string[];
  applicationUserId: string;
  selectedDepartmentId: string;
  institutionId?: number;
  course: string;
  specialty: string;
  status: string;
  crmWorkflowinstance: number;
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
  institutionId?: number;
  course?: number;
}

export interface IUpdateQuizDto {
  quizId: string;
  stage?: number;
  IsCompleted?: boolean;
  finishDate?: Date
  departmentId?: string;
}

export interface IQuizStatus {
  id: string;
  name: string;
  quizCount: number
}

export interface IAnswerOnQuestion {
  questionText: string;
  answerText: string; 
  number: number;
}