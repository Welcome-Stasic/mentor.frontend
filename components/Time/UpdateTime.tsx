import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IUpdateTimeDto, IWorkTime } from '@/lib/axios/types/time';
import TimeDialog, { ITimeDialogFormData } from './TimeDialog';
import { useUpdateWorkTime } from '@/hooks/useUpdateWorkTime';
import { useProjects } from '@/hooks/project/useProjects';

interface Props {
  userId: string;
  time: IWorkTime;
  disable?: boolean;
}

const UpdateTimeBtn = ({ userId, time, disable = false }: Props) => {
  const projectsResult = useProjects(userId);
  const projects = projectsResult?.data ?? [];

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateWorkTime = useUpdateWorkTime();

  const mutateAsync = async (data: ITimeDialogFormData) => {
    const body: IUpdateTimeDto = {
      entityId: time.entityId,
      type: time.type,
      minutes: data.minutes ?? null,
      comment: data.description ?? '',
      task: data.task,
      project: data.project
    };

    await updateWorkTime.mutateAsync(body);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleOpen} disabled={disable}>
        <EditIcon />
      </IconButton>

      <TimeDialog
        open={open}
        time={time}
        type="update"
        handleClose={handleClose}
        handleMutate={mutateAsync}
        isLoading={updateWorkTime.isPending}
        projects={projects}
      />
    </>
  );
};

export default UpdateTimeBtn;
