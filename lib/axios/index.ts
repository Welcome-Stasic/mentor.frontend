import { crmLogin, forgotPassword, getRefreshToken, isEmailConfirmed, isValidRefreshToken, login, logOut, refreshToken, register, resetPassword } from './requests/auth';
import { me } from './requests/me';
import { addAnswersToQuestions, getAll, getAllQuizStatues, getAnswersToQuestions, getById, update, updateFirstStage } from './requests/quiz';
import { getDepartmentAll } from './requests/department';
import { getCrmUserById, getUserById, getUserPhoto, updatePhotoCurrentUser } from './requests/user';

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
    logOut,
    isValidRefreshToken
  },
  user: {
    me,
    getCrmUserById,
    getUserById,
    updatePhotoCurrentUser,
    getUserPhoto
  },
  quiz: {
    getById,
    getAll,
    addAnswersToQuestions,
    updateFirstStage,
    update,
    getAllQuizStatues,
    getAnswersToQuestions
  },
  department: {
    getAll: getDepartmentAll
  }
};
