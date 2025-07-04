import { crmLogin, forgotPassword, getRefreshToken, isEmailConfirmed, login, refreshToken, register, resetPassword } from './requests/auth';
import { me } from './requests/me';
import { addAnswersToQuestions, getAll, getById, update, updateFirstStage } from './requests/quiz';
import { getDepartmentAll } from './requests/department';
import { getCrmUserById, getUserById, updatePhotoCurrentUser } from './requests/user';

export const API = {
  auth: {
    login,
    crmLogin,
    refreshToken,
    register,
    forgotPassword,
    resetPassword,
    isEmailConfirmed,
    getRefreshToken,
  },
  user: {
    me,
    getCrmUserById,
    getUserById,
    updatePhotoCurrentUser
  },
  quiz: {
    getById,
    getAll,
    addAnswersToQuestions,
    updateFirstStage,
    update
  },
  department: {
    getAll: getDepartmentAll
  }
};
