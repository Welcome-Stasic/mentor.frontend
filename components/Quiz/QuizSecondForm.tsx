'use client';

import { DepartmentQuestions } from '@/constants';
import { API } from '@/lib/axios';
import { IAddAnswersToQuestionsDto } from '@/lib/axios/types/quiz';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  FormLabel,
  Typography,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import BackdropLoader from '../BackdropLoader';
import { useQuestions } from '@/hooks/useQuestions';

interface IFormData {
  [key: string]: string;
}

export default function QuizSecondForm() {
  const session = useSession();
  const accessToken = session.data?.user.accessToken || '';

  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const currentQuiz = useCurrentUserStore((state) => state.quiz);
  const setQuiz = useCurrentUserStore((i) => i.setQuiz);

  const { questions, departments } = useQuestions();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormData>();

  const selectedDepartmentValue = watch('q14');

  const selectedDepartmentLabel =
    departments.find((d) => d.value === selectedDepartmentValue)?.label || '';

  const deptQuestions = selectedDepartmentLabel
    ? DepartmentQuestions[selectedDepartmentLabel] || []
    : [];

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setErrorMessages([]);

    if (!accessToken || !currentQuiz) return;

    const mainQuestions = questions.map((q) => ({
      question: q.question,
      answer:
        q.type === 'select' && q.options
          ? q.options.find((opt) => opt.value === data[`q${q.number}`])?.label || ''
          : data[`q${q.number}`] || '',
    }));

    const additionalQuestions = deptQuestions.map((q) => ({
      question: q.question,
      answer:
        q.type === 'select' && q.options
          ? q.options.find((opt) => opt.value === data[`dept_q${q.number}`])?.label || ''
          : data[`dept_q${q.number}`] || '',
    }));

    const allQuestions = mainQuestions.concat(additionalQuestions);

    try {
      setLoading(true);

      const body = {
        quizId: currentQuiz?.id,
        questions: allQuestions.map((i, index) => ({
          question: i.question,
          answer: i.answer,
          number: index + 1,
        })),
      } as IAddAnswersToQuestionsDto;

      const newErrors: string[] = [];

      const [questionResponse] = await Promise.all([
        API.quiz.addAnswersToQuestions(body, accessToken),
        API.quiz.update({ quizId: currentQuiz?.id, departmentId: '' }, accessToken),
      ]);

      if (questionResponse?.Errors?.length) {
        newErrors.push(
          `${questionResponse.Message ?? 'questionResponse error'} (${questionResponse.Errors.join(
            ', ',
          )})`,
        );
      }

      if (newErrors.length) setErrorMessages((prev) => [...prev, ...newErrors]);

      if (!newErrors.length && questionResponse?.Result) setQuiz(questionResponse?.Result);
    } catch (error) {
      setErrorMessages((prev) => [
        ...prev,
        'Произошла ошибка при отправке данных. Попробуйте снова.',
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackdropLoader open={loading} />
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        gap={2}
        onSubmit={handleSubmit(onSubmit)}>
        {questions.map((q) => {
          const name = `q${q.number}`;
          const isRequired = !!q.requiredMessage;
          const validationRules = isRequired ? { required: q.requiredMessage } : {};
          const error = errors[name];

          return (
            <FormControl key={name} fullWidth error={!!error}>
              <FormLabel sx={{ mb: 1 }}>{q.question}</FormLabel>
              {q.type === 'select' ? (
                <Select defaultValue="" {...register(name, validationRules)}>
                  {q.options?.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value ?? ''}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <TextField
                  multiline
                  minRows={2}
                  {...register(name, validationRules)}
                  error={!!error}
                />
              )}

              <FormHelperText>{error?.message}</FormHelperText>
            </FormControl>
          );
        })}

        {/* Рендер дополнительных вопросов для выбранного отдела */}
        {deptQuestions.map((q) => {
          const name = `dept_q${q.number}`;
          const isRequired = !!q.requiredMessage;
          const validationRules = isRequired ? { required: q.requiredMessage } : {};
          const error = errors[name];

          return (
            <FormControl key={name} fullWidth error={!!error}>
              <FormLabel sx={{ mb: 1 }}>{q.question}</FormLabel>
              <TextField
                multiline
                minRows={2}
                {...register(name, validationRules)}
                error={!!error}
              />
              <FormHelperText>{error?.message}</FormHelperText>
            </FormControl>
          );
        })}
        {errorMessages.length > 0 && (
          <Typography color="error" variant="body2">
            {errorMessages.join(', ')}
          </Typography>
        )}
        <Button variant="contained" type="submit">
          Далее
        </Button>
      </Box>
    </>
  );
}
