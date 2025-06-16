'use client';

import { DepartmentQuestions, Questions, RequestDepartments } from '@/constants';
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
import { useForm, SubmitHandler } from 'react-hook-form';

type FormData = {
  [key: string]: string;
};

export default function QuizSecondForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  
  const selectedDepartmentValue = watch('q14');
  
  const selectedDepartmentLabel =
    RequestDepartments.find((d) => d.value === Number(selectedDepartmentValue))
      ?.label || '';
  
  const deptQuestions = selectedDepartmentLabel
    ? DepartmentQuestions[selectedDepartmentLabel] || []
    : [];

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const mainQuestions = Questions.map((q) => ({
      question: q.question,
      answer: data[`q${q.number}`] || '',
    }));

    const additionalQuestions = deptQuestions.map((q) => ({
      question: q.question,
      answer: data[`dept_q${q.number}`] || '',
    }));

    console.log('Main Questions:', mainQuestions);
    console.log('Additional Questions:', additionalQuestions);
    reset();
  };

  return (
    <Box
      component="form"
      display="flex"
      flexDirection="column"
      gap={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      {Questions.map((q) => {
        const name = `q${q.number}`;
        const isRequired = !!q.requiredMessage;
        const validationRules = isRequired
          ? { required: q.requiredMessage }
          : {};
        const error = errors[name];

        return (
          <FormControl key={name} fullWidth error={!!error}>
            <FormLabel sx={{ mb: 1}}>{q.question}</FormLabel>
            {q.type === 'select' ? (
              <Select
                defaultValue=""
                {...register(name, validationRules)}
              >
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
        const validationRules = isRequired
          ? { required: q.requiredMessage }
          : {};
        const error = errors[name];

        return (
          <FormControl key={name} fullWidth error={!!error}>
            <FormLabel sx={{ mb: 1}}>{q.question}</FormLabel>
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

      <Button variant="contained" type="submit">
        Далее
      </Button>
    </Box>
  );
}

