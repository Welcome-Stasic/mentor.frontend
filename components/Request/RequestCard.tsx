'use client';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
  Typography,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useState } from 'react';
import { IAnswerOnQuestion, IQuiz, IQuizStatus } from '@/lib/axios/types/quiz';
import { API } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { IDepartment } from '@/lib/axios/types/department';
import { useUpdateQuiz } from '@/hooks/useUpdateQuiz';
import { UserPhoto } from '../UserPhoto';
import { DownloadRequestBtn } from './DownloadRequestBtn';
import { DeleteRequestBtn } from './DeleteRequestBtn';
import { CmrProcessingBtn } from './CmrProcessingBtn';
import { useUserById } from '@/hooks/useUserById';
import { useInstitution } from '@/hooks/useInstitutions';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import UpdateStatusRequest from './UpdateStatusRequest';

interface IRequestCardProps {
  quiz: IQuiz;
  departments: IDepartment[];
  statues: IQuizStatus[];
}

export const RequestCard = ({ quiz, departments, statues }: IRequestCardProps) => {
  const isAdmin = useCurrentUserStore((store) => store.isAdmin);
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  const isPermission = isAdmin || session.data?.user?.roles?.includes('QuizModerator');

  const updateQuiz = useUpdateQuiz();
  const institutionResult = useInstitution(quiz.institutionId);

  const userResult = useUserById(quiz.applicationUserId);
  const user = userResult?.data ?? null;

  const [questionListOpen, setQuestionListOpen] = useState(false);
  const [answersToQuestions, setAnswersToQuestions] = useState<IAnswerOnQuestion[]>([]);

  const handleDepartmentChange = async (event: SelectChangeEvent) => {
    if (!user) return;

    const departmentId = event.target.value;

    await updateQuiz.mutateAsync({ quizId: quiz.id, departmentId });
  };

  const handleViewResults = async () => {
    const response = await API.quiz.getAnswersToQuestions(quiz.id, accessToken);
    const resultItems = response?.Result || [];

    setAnswersToQuestions(resultItems);

    setQuestionListOpen(true);
  };

  return (
    <>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: 2,
        }}>
        <CardHeader
          avatar={<UserPhoto userId={user?.id ?? ''} isOnline={user?.isOnline ?? false} />}
          title={<Typography variant="subtitle1">{user?.fullName}</Typography>}
          subheader={
            <Typography variant="body2">
              {user?.email}
              {quiz.crmWorkflowinstance > 0 && (
                <>
                  <br />
                  <Link
                    href={`https://elma.eriskip.com/Processes/WorkflowInstance/Info/${quiz.crmWorkflowinstance}`}
                    target="_blank"
                    rel="noopener">
                    Заявка отправлена по маршруту
                  </Link>
                </>
              )}
            </Typography>
          }
        />
        <Divider />
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}>
          <Typography variant="body2">
            <strong>Дата рождения:</strong>{' '}
            {user?.birthDay && new Date(user.birthDay).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            <strong>Телефон:</strong> {user?.phoneNumber}
          </Typography>
          <Typography variant="body2">
            <strong>Учебное заведение:</strong> {institutionResult?.data?.name}
          </Typography>
          <Typography variant="body2">
            <strong>Класс/Курс:</strong> {quiz.course}
          </Typography>
          <Typography variant="body2">
            <strong>Специальность:</strong> {quiz.specialty}
          </Typography>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Подразделение:</strong>
            </Typography>
            <Select
              value={quiz.selectedDepartmentId || ''}
              onChange={handleDepartmentChange}
              size="small"
              fullWidth
              disabled={quiz.crmWorkflowinstance > 0 || !isPermission}>
              {departments?.map((dep) => (
                <MenuItem key={dep.id} value={dep.id}>
                  {dep.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <UpdateStatusRequest quiz={quiz} statues={statues} />
        </CardContent>
        <CardActions
          sx={{
            justifyContent: 'space-between',
            px: 2,
            pb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            mt: 'auto',
          }}>
          <Tooltip title="Открыть результаты тестирования">
            <Button
              variant="contained"
              onClick={handleViewResults}
              sx={{
                background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                color: '#fff',
                textTransform: 'none',
                px: 3,
                transition: '0.3s',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1e88e5, #1de9b6)',
                },
              }}
              startIcon={<Visibility />}>
              Результаты
            </Button>
          </Tooltip>
          <Box>
            <DownloadRequestBtn quiz={quiz} />
            <CmrProcessingBtn
              quiz={quiz}
              disable={!isPermission}
              crmWorkflowinstance={quiz.crmWorkflowinstance}
            />
            <DeleteRequestBtn quiz={quiz} disable={!isPermission} />
          </Box>
        </CardActions>
      </Card>

      {/* Модальное окно с вопросами */}
      {quiz.questions.length > 0 && (
        <Dialog open={questionListOpen} onClose={() => setQuestionListOpen(false)} maxWidth="md">
          <DialogContent>
            <List>
              {answersToQuestions
                ?.sort((a, b) => a.number - b.number)
                ?.map((item) => (
                  <div key={item.number}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography
                            component="p"
                            variant="subtitle1"
                            sx={{ marginBottom: '5px' }}>
                            {item.number}. {item.questionText}
                          </Typography>
                        }
                        secondary={
                          <Typography component="p" variant="subtitle2">
                            {item.answerText}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </div>
                ))}
            </List>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
