import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ICreateTimeDto } from '@/lib/axios/types/time';
import TimeDialog, { ITimeDialogFormData } from './TimeDialog';
import { useCreateWorkTime } from '@/hooks/useCreateWorkTime';

interface Props {
  userId: string;
  date: string;
}

const CreateTimeBtn = ({ userId, date }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createWorkTime = useCreateWorkTime();

  const mutateAsync = async (data: ITimeDialogFormData) => {
    const body: ICreateTimeDto = {
      crmUserId: Number(userId),
      project: data.project ?? '',
      minutes: data.minutes ?? 0,
      comment: data.description,
      task: data.task,
      date,
    };

    await createWorkTime.mutateAsync(body);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleOpen}>
        <AddIcon />
      </IconButton>

      <TimeDialog
        open={open}
        type="create"
        handleClose={handleClose}
        handleMutate={mutateAsync}
        isLoading={createWorkTime.isPending}
      />
    </>
  );
};

export default CreateTimeBtn;
