import { crmLogin, forgotPassword, getRefreshToken, isEmailConfirmed, isValidAccessToken, login, logOut, refreshToken, register, resetPassword } from './requests/auth';
import { me } from './requests/me';
import { addAnswersToQuestions, getAll, getAllQuizStatues, getAnswersToQuestions, getById, quizCrmProcessing, quizDelete, quizDownload, update, updateFirstStage } from './requests/quiz';
import { getDepartmentAll } from './requests/department';
import { getCrmUserById, getJuniors, getMentor, getReferralLink, getReportTime, getUserById, getUserPhoto, getWorkTime, updatePhotoCurrentUser } from './requests/user';
import { getAllInstitution, getByIdInstitution } from './requests/institution';
import { approveTime, cancelApproveTime, createTime, deleteTime, getApproveTimeInfo, updateTime } from './requests/time';

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
    isValidAccessToken
  },
  user: {
    me,
    getCrmUserById,
    getUserById,
    updatePhotoCurrentUser,
    getUserPhoto,
    getReferralLink,
    getReportTime,
    getWorkTime,
    getJuniors,
    getMentor
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
  },
  time: {
    updateTime,
    createTime,
    deleteTime,
    cancelApproveTime,
    approveTime,
    getApproveTimeInfo
  }
};
