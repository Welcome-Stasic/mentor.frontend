import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IUpdateTimeDto, IWorkTime } from '@/lib/axios/types/time';
import TimeDialog, { ITimeDialogFormData } from './TimeDialog';
import { useUpdateWorkTime } from '@/hooks/useUpdateWorkTime';

interface Props {
  time: IWorkTime;
}

const UpdateTimeBtn = ({ time }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateWorkTime = useUpdateWorkTime();

  const mutateAsync = async (data: ITimeDialogFormData) => {
    const body: IUpdateTimeDto = {
      entityId: time.entityId,
      type: time.type,
      minutes: data.minutes ?? null,
      comment: data.description,
      task: data.task,
    };

    await updateWorkTime.mutateAsync(body);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleOpen}>
        <EditIcon />
      </IconButton>

      <TimeDialog
        open={open}
        time={time}
        type="update"
        handleClose={handleClose}
        handleMutate={mutateAsync}
        isLoading={updateWorkTime.isPending}
      />
    </>
  );
};

export default UpdateTimeBtn;
