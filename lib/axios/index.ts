import { crmLogin, forgotPassword, isEmailConfirmed, login, register, resetPassword } from './requests/auth';
import { me } from './requests/me';
import { refreshToken } from './requests/refreshToken';
import { addAnswersToQuestions, getAll, getById } from './requests/quiz';
import { getCrmUserById } from './requests/user';

export const API = {
  auth: {
    login,
    crmLogin,
    refreshToken,
    register,
    forgotPassword,
    resetPassword,
    isEmailConfirmed
  },
  user: {
    me,
    getCrmUserById,
  },
  quiz: {
    getById,
    getAll,
    addAnswersToQuestions
  }
};
