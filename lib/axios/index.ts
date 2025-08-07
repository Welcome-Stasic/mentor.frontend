import { crmLogin, forgotPassword, getRefreshToken, isEmailConfirmed, isValidAccessToken, login, logOut, refreshToken, register, resetPassword } from './requests/auth';
import { me } from './requests/me';
import { addAnswersToQuestions, getAll, getAllQuizStatues, getAnswersToQuestions, getById, quizCrmProcessing, quizDelete, quizDownload, update, updateFirstStage } from './requests/quiz';
import { getDepartmentAll } from './requests/department';
import { allLogOutUser, assignUserRole, bindingToCrm, deleteUser, getAllCrmUsers, getAllUsers, getCrmUserById, getJuniors, getMentor, getReferralLink, getReportTime, getUserById, getUserPhoto, getUserRoles, getWorkTime, removeUserRole, updatePhotoCurrentUser } from './requests/user';
import { getAllInstitution, getByIdInstitution } from './requests/institution';
import { approveTime, cancelApproveTime, createTime, deleteTime, getApproveTimeInfo, updateTime } from './requests/time';
import { deleteProject, getAllProjects, getCreateProject, getUpdateProject } from './requests/project';

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
    getMentor,
    getAllUsers,
    getUserRoles,
    assignUserRole,
    removeUserRole,
    getAllCrmUsers,
    bindingToCrm
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
  },
  project: {
    getAllProjects,
    getCreateProject,
    getUpdateProject,
    deleteProject
  },
  admin: {
    deleteUser,
    allLogOutUser
  }
};
