import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IUpdateTimeDto, IWorkTime } from '@/lib/axios/types/time';
import TimeDialog, { ITimeDialogFormData } from './TimeDialog';
import { useUpdateWorkTime } from '@/hooks/useUpdateWorkTime';
import { useProjects } from '@/hooks/project/useProjects';
import { useValidateMinutes } from '@/hooks/useValidateMinutes';

interface Props {
  userId: string;
  time: IWorkTime;
  disable?: boolean;
  totalReportMinutes: number;
  totalWorkMinutes: number;
}

const UpdateTimeBtn = ({
  userId,
  time,
  totalReportMinutes,
  totalWorkMinutes,
  disable = false,
}: Props) => {
  const validateMinutes = useValidateMinutes(totalReportMinutes, totalWorkMinutes);

  const projectsResult = useProjects(userId);
  const projects = projectsResult?.data ?? [];

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateWorkTime = useUpdateWorkTime();

  const mutateAsync = async (data: ITimeDialogFormData) => {
    setError(null);

    const minutes = data.minutes ?? 0;
    const validationError = validateMinutes(minutes, time.minutes ?? 0);

    if (validationError) {
      setError(validationError);
      return;
    }

    const body: IUpdateTimeDto = {
      entityId: time.entityId,
      type: time.type,
      minutes: data.minutes ?? null,
      comment: data.description ?? '',
      task: data.task,
      project: data.project,
    };

    await updateWorkTime.mutateAsync(body);

    handleClose();
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
        error={error}
      />
    </>
  );
};

export default UpdateTimeBtn;
