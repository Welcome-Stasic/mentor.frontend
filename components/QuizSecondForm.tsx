'use client';

import { DepartmentQuestions, Questions, RequestDepartments } from '@/constants';
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
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
  [key: string]: string;
};

export default function QuizSecondForm() {
  const session = useSession()
  const accessToken = session.data?.user.accessToken || '';

  const currentQuiz = useCurrentUserStore((state) => state.quiz);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const selectedDepartmentValue = watch('q14');

  const selectedDepartmentLabel =
    RequestDepartments.find((d) => d.value === Number(selectedDepartmentValue))?.label || '';

  const deptQuestions = selectedDepartmentLabel
    ? DepartmentQuestions[selectedDepartmentLabel] || []
    : [];

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const mainQuestions = Questions.map((q) => ({
      question: q.question,
      answer:
        q.type === 'select' && q.options
          ? q.options.find((opt) => opt.value === Number(data[`q${q.number}`]))?.label || ''
          : data[`q${q.number}`] || '',
    }));

    const additionalQuestions = deptQuestions.map((q) => ({
      question: q.question,
      answer:
        q.type === 'select' && q.options
          ? q.options.find((opt) => opt.value === Number(data[`dept_q${q.number}`]))?.label || ''
          : data[`dept_q${q.number}`] || '',
    }));

    const allQuestions = mainQuestions.concat(additionalQuestions);

    const body = {
      quizId: currentQuiz?.id,
      questions: allQuestions.map((i, index) => ({
        question: i.question,
        answer: i.answer,
        number: index + 1,
      })),
    } as IAddAnswersToQuestionsDto;
    
    const response = await API.quiz.addAnswersToQuestions(body, accessToken);

    reset();

    const isSuccess = response?.Result ?? false;

    if(isSuccess){
      redirect('/');
    }
  };

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={2}
      onSubmit={handleSubmit(onSubmit)}>
      {Questions.map((q) => {
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
            <TextField multiline minRows={2} {...register(name, validationRules)} error={!!error} />
            <FormHelperText>{error?.message}</FormHelperText>
          </FormControl>
        );
      })}

      <Button variant="contained" type="submit">
        Далее
      </Button>
    </Box>
  );
}
