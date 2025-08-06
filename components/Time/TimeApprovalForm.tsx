'use client';

import { useForm } from 'react-hook-form';
import { Box, Button, Skeleton, TextField, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useApproveTimeInfo } from '@/hooks/time/useApproveTimeInfo';
import { useApproveTime } from '@/hooks/time/useApproveTime';
import { useCancelApproveTime } from '@/hooks/time/useCancelApproveTime';
import { useCurrentUserStore } from '@/providers/current-user-provider';

interface IApprovalProps {
  crmUserId: string;
  date: dayjs.Dayjs;
}

type FormData = {
  comment: string;
};

export default function TimeApprovalForm({ crmUserId, date }: IApprovalProps) {
  const crmCurrentUserId = useCurrentUserStore((store) => store.elmaId) ?? '';
  const approveInfo = useApproveTimeInfo({ crmUserId, month: date.month() + 1, year: date.year() });
  const approveTime = useApproveTime();
  const cancelApproveTime = useCancelApproveTime();

  const approved = !!approveInfo?.data;

  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: { comment: '' },
  });

  useEffect(() => {
    if (approveInfo?.data?.comment) {
      setValue('comment', approveInfo.data.comment);
    }
  }, [approveInfo.data, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!approved) {
      await approveTime.mutateAsync({
        crmUserId,
        month: date.month(),
        year: date.year(),
        comment: data.comment,
        approveCrmUserId: crmCurrentUserId,
      });
    } else {
      await cancelApproveTime.mutateAsync({ id: approveInfo?.data?.id ?? '' });
    }
  };

  if (approveInfo.isPending) {
    return (
      <Box display="flex" flexDirection="column" gap={2} width={{ sm: '450px' }}>
        <Skeleton variant="text" width={280} height={20} />
        <Skeleton variant="rectangular" height={40} />
        <Skeleton variant="rectangular" height={36} width={160} />
      </Box>
    );
  }

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

      <Button
        type="submit"
        variant="contained"
        color={approved ? 'error' : 'primary'}
        loading={approveTime.isPending || cancelApproveTime.isPending}>
        {approved ? 'Отменить согласование' : 'Согласовать'}
      </Button>
    </Box>
  );
}
