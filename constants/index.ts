export const SITE_BASE_NAME: string = 'ЭРИС. Наставничество';
import HomeIcon from '@mui/icons-material/Home';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import ContactsIcon from '@mui/icons-material/Contacts';
import AddLinkIcon from '@mui/icons-material/AddLink';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonIcon from '@mui/icons-material/Person';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupsIcon from '@mui/icons-material/Groups';

export type Question = {
  question: string;
  number: number;
  section?: number;
  type: 'text' | 'select';
  options?: QuestionOption[];
  requiredMessage?: string;
}

export type QuestionOption = {
  label: string;
  value: string | null;
}

export const TypeWork: QuestionOption[] = [
  { label: '', value: null },
  { label: 'Работа', value: '1' },
  { label: 'Подработка', value: '2' },
  { label: 'Практика', value: '3' }
]

export const Questions: Question[] = [
  {
    question: 'Цель обращения? (Какую цель Вы преследуете, подавая резюме в нашу компанию?)',
    number: 1,
    section: 1,
    type: 'select',
    options: TypeWork,
    requiredMessage: 'Пожалуйста, выберите цель обращения',
  },
  {
    question: 'Почему Вы решили обратиться именно к нам? Что привлекло в нашей компании?',
    number: 2,
    section: 1,
    type: 'text',
    requiredMessage: 'Расскажите, почему вас заинтересовала наша компания',
  },
  {
    question: 'Что Вы уже знаете о компании ЭРИС? Назовите три ключевых факта о наших продуктах или услугах, которые Вы узнали при подготовке.',
    number: 3,
    section: 1,
    type: 'text',
    requiredMessage: 'Назовите три ключевых факта, которые вы знаете о компании ЭРИС',
  },
  {
    question: 'В каком подразделение Вы бы хотели пройти стажировку? ( Если затрудняетесь с выбором, оставьте поле пустым)',
    number: 14,
    section: 1,
    type: 'select',
    requiredMessage: '',
    options: []
  },
  {
    question: 'Интересующая вас профессия? На какую профессию или специальность Вы планируете обучиться – или попрактиковаться?',
    number: 5,
    section: 2,
    type: 'text',
    requiredMessage: 'Укажите интересующую вас профессию или специальность',
  },
  {
    question: 'Опишите своими словами, чем именно вы можете быть полезны компании?',
    number: 6,
    section: 2,
    type: 'text',
    requiredMessage: 'Опишите, чем именно вы можете быть полезны компании',
  },
  {
    question: 'Какие 2–3 навыка из Вашего прошлого опыта Вы сможете применить на практике уже в первую неделю без дополнительного обучения?',
    number: 7,
    section: 2,
    type: 'text',
    requiredMessage: 'Перечислите 2–3 навыка, которые сможете применить уже в первую неделю',
  },
  {
    question: 'Был ли у Вас ранее опыт работы или производственной практики? Если да, то в какой сфере и какой был средний уровень дохода?  ',
    number: 8,
    section: 2,
    type: 'text',
    requiredMessage: 'Расскажите о предыдущем опыте работы или практики, если он был',
  },
  {
    question: 'Какими своими личными и профессиональными достижениями гордитесь? Что считаете важным рассказать о себе?',
    number: 9,
    section: 2,
    type: 'text',
    requiredMessage: 'Расскажите, какими личными и профессиональными достижениями вы гордитесь',
  },
  {
    question: 'Расскажите немного о себе. Чем Вы увлекаетесь? Какое у Вас хобби, чем любите заниматься?',
    number: 10,
    section: 3,
    type: 'text',
    requiredMessage: 'Расскажите о себе, своих увлечениях и хобби',
  },
  {
    question: 'Какое среднее учебное заведение (школу) Вы окончили?  ',
    number: 11,
    section: 3,
    type: 'text',
    requiredMessage: 'Укажите среднее учебное заведение, которое вы окончили',
  },
  {
    question: 'Где Вы сейчас проживаете и с кем? Это Ваш выбор или обстоятельства?',
    number: 12,
    section: 3,
    type: 'text',
    requiredMessage: 'Укажите, где и с кем вы проживаете, и это ваш выбор или обстоятельства',
  },
  {
    question: 'Как вы оцениваете возможности для жизни в городе Чайковском?',
    number: 13,
    section: 3,
    type: 'text',
    requiredMessage: 'Поделитесь, как вы оцениваете возможности для жизни в Чайковском',
  },
  {
    question: 'Какие у Вас планы после окончания вуза или ссуза? С чем связан выбор места дальнейшего проживания?',
    number: 15,
    section: 3,
    type: 'text',
    requiredMessage: 'Расскажите о планах после окончания учёбы и о выборе места проживания',
  },
  {
    question: 'Читаете ли Вы книги? Если да, то какие авторы или жанры Вам интересны?',
    number: 16,
    section: 4,
    type: 'text',
    requiredMessage: 'Расскажите, читаете ли вы книги и какие авторы или жанры вам интересны',
  },
  {
    question: 'К чему Вы стремитесь в профессиональном плане? Готовы ли Вы постоянно обучаться и осваивать новые навыки?',
    number: 17,
    section: 4,
    type: 'text',
    requiredMessage: 'Опишите, к чему вы стремитесь профессионально и готовы ли постоянно обучаться',
  },
  {
    question: 'Какие у Вас цели на ближайшее время? Кем и где Вы видите себя через 1-2 года?',
    number: 18,
    section: 4,
    type: 'text',
    requiredMessage: 'Расскажите о целях на ближайшее время и кем вы видите себя через 1–2 года',
  },
  {
    question: 'Есть ли у Вас глобальные, долгосрочные цели? Чего Вы хотите достигнуть в жизни?',
    number: 19,
    section: 4,
    type: 'text',
    requiredMessage: 'Опишите свои долгосрочные цели и чего вы хотите достичь в жизни',
  },
  {
    question: 'Какой уровень дохода Вы считаете комфортным? Есть ли у вас представление о том, сколько бы вы хотели зарабатывать в начале карьеры и в будущем?',
    number: 20,
    section: 4,
    type: 'text',
    requiredMessage: 'Укажите комфортный для вас уровень дохода в начале карьеры и в будущем',
  },
];
export const DepartmentQuestions: Record<string, Question[]> = {
  'Отдел информационных технологий и связи': [
    {
      question: 'Знание языков программирования? Оцените свой уровень по 5-ти бальной шкале',
      number: 1,
      section: 1,
      type: 'text',
      requiredMessage: 'Это поле обязательно для заполнения',
    }
  ],
  'Отдел разработок': [
    {
      question: 'Знание языков программирования? Оцените свой уровень по 5-ти бальной шкале',
      number: 1,
      section: 1,
      type: 'text',
      requiredMessage: 'Это поле обязательно для заполнения',
    },
  ],
};

export const USER_ROLES: Record<KeyUserRole, IUserRole> = {
  ADMIN: {
    name: 'Admin',
    description: 'Полный доступ'
  },
  JUNIOR: {
    name: 'Junior',
    description: 'Базовая роль для одобренного пользователя'
  },
  PENDING_APPROVAL: {
    name: 'PendingApproval',
    description: 'Пользователь ожидающий подтверждения'
  },
  MODERATOR: {
    name: 'Moderator',
    description: 'Модератор'
  },
  QUIZ_MODERATOR: {
    name: 'QuizModerator',
    description: 'Модератор анкет'
  }
}

type KeyUserRole = "ADMIN" | "JUNIOR" | "PENDING_APPROVAL" | "MODERATOR" | "QUIZ_MODERATOR"

export interface IUserRole {
  name: string,
  description: string;
}

export const PAGE: Record<KeyPage, IPage> = {
  HOME: {
    name: 'Главная',
    pathPrefix: '/',
    roles: [],
    icon: HomeIcon
  },
  REQUEST: {
    name: 'Анкеты',
    pathPrefix: '/Request',
    roles: [USER_ROLES.ADMIN.name, USER_ROLES.QUIZ_MODERATOR.name, USER_ROLES.MODERATOR.name],
    icon: ContactsIcon
  },
  TIME_TRACKING: {
    name: 'Учет времени',
    pathPrefix: '/TimeTracking',
    roles: [],
    icon: AccessTimeIcon
  },
  PROJECTS: {
    name: 'Проекты',
    pathPrefix: '/Projects',
    roles: [],
    icon: FolderSharedIcon
  },
  MY_MENTOR: {
    name: 'Мой наставник',
    pathPrefix: '/MyMentor',
    roles: [],
    icon: PersonIcon
  },
  MY_JUNIORS: {
    name: 'Мои стажёры',
    pathPrefix: '/MyJuniors',
    roles: [],
    icon: ChildCareIcon
  },
  USERS: {
    name: 'Пользователи',
    pathPrefix: '/Users',
    roles: [USER_ROLES.ADMIN.name, USER_ROLES.MODERATOR.name],
    icon: GroupsIcon
  },
  USER: {
    name: 'Информация о пользователе',
    pathPrefix: '/User',
    roles: [USER_ROLES.ADMIN.name, USER_ROLES.MODERATOR.name],
    icon: GroupsIcon
  },
  REFERRAL: {
    name: 'Рефералы',
    pathPrefix: '/Referral',
    roles: [USER_ROLES.ADMIN.name],
    icon: AddLinkIcon
  },
  SIGNIN_TOKEN: {
    name: 'Вход по id ELMA',
    pathPrefix: '/SignInId',
    roles: [USER_ROLES.ADMIN.name],
    icon: PersonIcon
  }
}

export interface IPage {
  name: string,
  pathPrefix: string;
  roles: string[],
  icon: OverridableComponent<SvgIconTypeMap>
}

type KeyPage = "HOME" | "REQUEST" | "TIME_TRACKING" | "SIGNIN_TOKEN" | "REFERRAL" | "MY_JUNIORS" | "MY_MENTOR" | "PROJECTS" | "USERS" | "USER"