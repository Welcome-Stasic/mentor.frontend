export const SITE_BASE_NAME: string = 'ЭРИС. Наставничество';
import HomeIcon from '@mui/icons-material/Home';
import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import ContactsIcon from '@mui/icons-material/Contacts';

export type Question = {
  question: string;
  number: number;
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
  { label: 'Подработка', value: '' },
  { label: 'Практика', value: '' }
]

export const Questions: Question[] = [
  {
    question: 'Цель обращения?',
    number: 1,
    type: 'select',
    options: TypeWork,
    requiredMessage: 'Пожалуйста, выберите цель обращения',
  },
  {
    question: 'Расскажите немного о себе. Чем увлекаетесь, чем любите заниматься?',
    number: 2,
    type: 'text',
    requiredMessage: 'Это поле обязательно для заполнения',
  },
  {
    question: 'Что знаете о компании?',
    number: 3,
    type: 'text',
    requiredMessage: 'Напишите, что вы знаете о компании',
  },
  {
    question: 'Почему решили обратиться именно к нам? Что привлекло в нашей компании?',
    number: 4,
    type: 'text',
    requiredMessage: 'Расскажите, что вас привлекло в компании',
  },
  {
    question: 'Где вы сейчас живете и с кем? Это ваш выбор или обстоятельства?',
    number: 5,
    type: 'text',
    requiredMessage: 'Опишите вашу текущую ситуацию с жильем',
  },
  {
    question: 'Читаете ли вы книги? Если да, то какие жанры или авторов предпочитаете?',
    number: 6,
    type: 'text',
    requiredMessage: 'Расскажите о своих читательских предпочтениях',
  },
  {
    question: 'Есть ли у вас представление о том, сколько бы вы хотели зарабатывать? Какой доход считаете комфортным?',
    number: 7,
    type: 'text',
    requiredMessage: 'Укажите желаемый доход',
  },
  {
    question: 'Какие у вас цели на ближайшее время? Кем видите себя через год или два?',
    number: 8,
    type: 'text',
    requiredMessage: 'Опишите свои краткосрочные цели',
  },
  {
    question: 'Есть ли долгосрочные цели? Чего вы хотите достичь в жизни?',
    number: 9,
    type: 'text',
    requiredMessage: 'Опишите ваши долгосрочные цели',
  },
  {
    question: 'Интересующая вас профессия?',
    number: 10,
    type: 'text',
    requiredMessage: 'Укажите интересующую профессию',
  },
  {
    question: 'К чему вы стремитесь в профессиональном плане?',
    number: 11,
    type: 'text',
    requiredMessage: 'Опишите ваши профессиональные стремления',
  },
  {
    question: 'Работали ли вы ранее? Если да, где и какой был заработок?',
    number: 12,
    type: 'text',
    requiredMessage: 'Расскажите о предыдущем опыте работы',
  },
  {
    question: 'Какими своими достижениями гордитесь? Что считаете важным рассказать о себе?',
    number: 13,
    type: 'text',
    requiredMessage: 'Укажите ваши достижения',
  },
  {
    question: 'В какое подразделение вы бы хотели попасть? Если затрудняетесь с выбором, это поле можно оставить пустым.',
    number: 14,
    type: 'select',
    requiredMessage: '',
    options: []
  },
];

export const DepartmentQuestions: Record<string, Question[]> = {
  'Отдел информационных технологий и связи': [
    {
      question: 'Знание языков программирования? Оцените свой уровень по 5-ти бальной шкале',
      number: 1,
      type: 'text',
      requiredMessage: 'Это поле обязательно для заполнения',
    }
  ],
  'Отдел разработок': [
    {
      question: 'Знание языков программирования? Оцените свой уровень по 5-ти бальной шкале',
      number: 1,
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
  }
}

type KeyUserRole = "ADMIN" | "JUNIOR" | "PENDING_APPROVAL"

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
    roles: [USER_ROLES.ADMIN.name],
    icon: ContactsIcon
  }
}

export interface IPage {
  name: string,
  pathPrefix: string;
  roles: string[],
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>
}

type KeyPage = "HOME" | "REQUEST"