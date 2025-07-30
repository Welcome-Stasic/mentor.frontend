'use client';

import { useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';
import dayjs from 'dayjs';

interface IApprovalProps {
  crmUserId: string;
  date: dayjs.Dayjs;
}

type FormData = {
  comment: string;
};

export default function TimeApprovalForm({ crmUserId, date }: IApprovalProps) {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [approved, setApproved] = useState(true);

  const onSubmit = (data: FormData) => {
    const d = dayjs(date).format('YYYY-MM-DD');
    setApproved(!approved);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      display="flex"
      alignItems="start"
      flexDirection="column"
      gap={2}
      width={{ sm: '450px' }}>
      <Typography variant="body2" display="flex" alignItems="center" gap={1} color="text.secondary">
        <InfoOutlinedIcon fontSize="small" />
        Согласуйте трудозатраты только в конце месяца
      </Typography>

      <TextField
        {...register('comment')}
        label="Комментарий к согласованию трудозатрат"
        variant="outlined"
        size="small"
        fullWidth
        disabled={approved}
      />

      <Button type="submit" variant="contained" color={approved ? 'error' : 'primary'}>
        {approved ? 'Отменить согласование' : 'Согласовать'}
      </Button>
    </Box>
  );
}
