/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  Autocomplete,
  Link,
} from '@mui/material';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { PhoneNumberMaskCustom } from '../PhoneNumberMaskCustom';
import { PhotoDropzone } from '../PhotoDropzone'; // ⬅️ импортируем компонент
import { API } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { IUpdateFirstStageDto } from '@/lib/axios/types/quiz';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { useEffect, useState } from 'react';
import BackdropLoader from '../BackdropLoader';
import { useInstitutions } from '@/hooks/useInstitutions';
import { IInstitution } from '@/lib/axios/types/institution';

interface IFormData {
  lastName: string;
  firstName: string;
  middleName?: string;
  place: string;
  phoneNumber: string;
  birthDate: string;
  photo: File | null;
  isAccepted: boolean;
  specialty: string;
  institutionId?: number;
  course?: number;
}

function getCourseLabel(institutionType: string) {
  const selectedInstitutionType = institutionType?.toLowerCase().trim();
  const courseLabel =
    selectedInstitutionType?.includes('вуз') || selectedInstitutionType?.includes('суз')
      ? 'Курс'
      : selectedInstitutionType?.includes('школа')
      ? 'Класс'
      : 'Класс/Курс';

  return courseLabel;
}

export default function QuizFirstForm() {
  const currentQuiz = useCurrentUserStore((i) => i.quiz);
  const setQuiz = useCurrentUserStore((i) => i.setQuiz);
  const institutionResult = useInstitutions();

  const [loading, setLoading] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<IInstitution | null>(null);

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const session = useSession();
  const accessToken = session.data?.user.accessToken;

  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<IFormData>({
    defaultValues: {
      photo: null,
    },
  });

  const selectedInstitutionValue = watch('institutionId');

  useEffect(() => {
    const selectedInstitution =
      institutionResult?.data?.find((d) => d.id === selectedInstitutionValue) || null;

    setSelectedInstitution(selectedInstitution);
  }, [selectedInstitutionValue]);

  useEffect(() => {
    if (!selectedInstitution) {
      clearErrors(['course', 'specialty']);
      setValue('course', undefined);
      setValue('specialty', '');
    }
  }, [selectedInstitution]);

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    setErrorMessages([]);

    if (!data.photo || !accessToken || !currentQuiz) return;

    try {
      setLoading(true);

      const body: IUpdateFirstStageDto = {
        quizId: currentQuiz.id,
        lastName: data.lastName,
        firstName: data.firstName,
        middleName: data.middleName || '',
        place: data.place,
        phoneNumber: data.phoneNumber,
        birthDate: new Date(data.birthDate),
        isAccepted: data.isAccepted,
        specialty: data.specialty,
        institutionId: data.institutionId,
        course: data.course,
      };

      const [photoResponse, quizResponse] = await Promise.all([
        API.user.updatePhotoCurrentUser(data.photo, accessToken),
        API.quiz.updateFirstStage(body, accessToken),
      ]);

      const newErrors: string[] = [];

      if (photoResponse?.Errors?.length) {
        newErrors.push(
          `${photoResponse.Message ?? 'Photo error'} (${photoResponse.Errors.join(', ')})`,
        );
      }

      if (quizResponse?.Errors?.length) {
        newErrors.push(
          `${quizResponse.Message ?? 'Quiz error'} (${quizResponse.Errors.join(', ')})`,
        );
      }

      if (newErrors.length) setErrorMessages((prev) => [...prev, ...newErrors]);

      if (!newErrors.length && quizResponse?.Result) setQuiz(quizResponse.Result);
    } catch (error) {
      setErrorMessages((prev) => [
        ...prev,
        'Произошла ошибка при отправке данных. Попробуйте снова.',
      ]);
    } finally {
      if (!errorMessages.length) reset();

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
        <TextField
          {...register('lastName', { required: 'Поле обязательно' })}
          label="Фамилия"
          fullWidth
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
        <TextField
          {...register('firstName', { required: 'Поле обязательно' })}
          label="Имя"
          fullWidth
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
        <TextField {...register('middleName')} label="Отчество" fullWidth />
        <TextField
          {...register('place', {
            required: 'Поле обязательно',
            minLength: { value: 3, message: 'Минимум 3 символа' },
          })}
          label="Место проживания"
          fullWidth
          error={!!errors.place}
          helperText={errors.place?.message}
        />
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ required: 'Поле обязательно' }}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.phoneNumber}>
              <InputLabel htmlFor="phone-input">Номер телефона</InputLabel>
              <OutlinedInput
                id="phone-input"
                label="Номер телефона"
                inputComponent={PhoneNumberMaskCustom as any}
                {...field}
              />
            </FormControl>
          )}
        />
        <TextField
          {...register('birthDate', { required: 'Поле обязательно' })}
          label="Дата рождения"
          type="date"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!errors.birthDate}
          helperText={errors.birthDate?.message}
        />

        <Controller
          name="institutionId"
          control={control}
          render={({ field }) => {
            const selectedInstitution =
              institutionResult?.data?.find((inst) => inst.id === field.value) ?? null;

            return (
              <Autocomplete
                disablePortal
                options={institutionResult?.data ?? []}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={selectedInstitution}
                onChange={(_, value) => field.onChange(value?.id ?? '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Учебное заведение"
                    error={!!errors.institutionId}
                    helperText={errors.institutionId?.message}
                  />
                )}
              />
            );
          }}
        />
        <TextField
          {...register('course', {
            validate: (value) => {
              if (selectedInstitution && !value) {
                return 'Поле обязательно';
              }

              return true;
            },
          })}
          label={getCourseLabel(selectedInstitution?.type ?? '')}
          type="number"
          fullWidth
          error={!!errors.course}
          helperText={errors.course?.message}
        />
        <TextField
          {...register('specialty', {
            validate: (value) => {
              if (
                selectedInstitution &&
                !selectedInstitution?.type.toLocaleLowerCase().trim().includes('школа') &&
                !value
              ) {
                return 'Поле обязательно';
              }

              return true;
            },
          })}
          label="Специальность"
          fullWidth
          error={!!errors.specialty}
          helperText={errors.specialty?.message}
        />

        {/* Фото через кастомный компонент */}
        <Controller
          name="photo"
          control={control}
          rules={{ required: 'Загрузите свою фотографию' }}
          render={({ field, fieldState }) => (
            <PhotoDropzone
              field={field}
              error={fieldState.error}
              onFileError={(message) => {
                if (message) {
                  setError('photo', { message });
                  field.onChange(null); // сброс файла
                } else {
                  clearErrors('photo');
                }
              }}
            />
          )}
        />

        <FormControlLabel
          control={
            <Checkbox
              {...register('isAccepted', {
                required: 'Поле обязательно',
              })}
            />
          }
          label={
            <>
              Я согласен(на) на{' '}
              <Link href="https://736bdfa4-5434-475b-8d49-2ca263ead6cc.selstorage.ru/assets/agreements.pdf" target="_blank" rel="noopener">
                обработку персональных данных
              </Link>
            </>
          }
        />
        {errors.isAccepted && <Typography color="error">{errors.isAccepted.message}</Typography>}
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
