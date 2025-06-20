import { crmLogin, forgotPassword, getRefreshToken, isEmailConfirmed, login, refreshToken, register, resetPassword } from './requests/auth';
import { me } from './requests/me';
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
    isEmailConfirmed,
    getRefreshToken
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
