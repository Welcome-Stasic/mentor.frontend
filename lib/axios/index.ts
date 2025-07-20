import { crmLogin, forgotPassword, getRefreshToken, isEmailConfirmed, isValidRefreshToken, login, logOut, refreshToken, register, resetPassword } from './requests/auth';
import { me } from './requests/me';
import { addAnswersToQuestions, getAll, getAllQuizStatues, getAnswersToQuestions, getById, quizCrmProcessing, quizDelete, quizDownload, update, updateFirstStage } from './requests/quiz';
import { getDepartmentAll } from './requests/department';
import { getCrmUserById, getReferralLink, getUserById, getUserPhoto, updatePhotoCurrentUser } from './requests/user';
import { getAllInstitution, getByIdInstitution } from './requests/institution';

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
    getUserPhoto,
    getReferralLink
  },
  quiz: {
    getById,
    getAll,
    addAnswersToQuestions,
    updateFirstStage,
    update,
    getAllQuizStatues,
    getAnswersToQuestions,
    quizDelete,
    quizDownload,
    quizCrmProcessing
  },
  department: {
    getAll: getDepartmentAll
  },
  institution: {
    getAllInstitution,
    getByIdInstitution
  }
};
