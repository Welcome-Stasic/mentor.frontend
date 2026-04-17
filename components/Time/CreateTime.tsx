import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ICreateTimeDto } from '@/lib/axios/types/time';
import TimeDialog, { ITimeDialogFormData } from './TimeDialog';
import { useCreateWorkTime } from '@/hooks/useCreateWorkTime';
import { useProjects } from '@/hooks/project/useProjects';
import { useValidateMinutes } from '@/hooks/useValidateMinutes';
import { useCrmUser } from '@/hooks/user/useCrmUser';
import { useCurrentUser } from '@/hooks/useMe';

interface Props {
  userId: string;
  date: string;
  disable?: boolean;
  totalReportMinutes: number;
  totalWorkMinutes: number;
}

const CreateTimeBtn = ({
  userId,
  date,
  totalReportMinutes,
  totalWorkMinutes,
  disable = false,
}: Props) => {
  const validateMinutes = useValidateMinutes(totalReportMinutes, totalWorkMinutes);
  const userById = useCurrentUser();
  const userAppId = userById.data?.id ? userById.data?.id : "";
  console.log(userAppId);
  const projectsResult = useProjects(userAppId);
  const projects = projectsResult?.data ?? [];

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setError(null);
    setOpen(false);
  };

  const createWorkTime = useCreateWorkTime();

  const mutateAsync = async (data: ITimeDialogFormData) => {
    setError(null);

    const minutes = data.minutes ?? 0;
    const validationError = validateMinutes(minutes);

    if (validationError) {
      setError(validationError);
      return;
    }

    const body: ICreateTimeDto = {
      crmUserId: Number(userId),
      project: data.project ?? '',
      minutes,
      comment: data.description ?? '',
      task: data.task,
      date,
    };

    await createWorkTime.mutateAsync(body);
    handleClose();
  };

  return (
    <>
      <IconButton color="primary" onClick={handleOpen} disabled={disable}>
        <AddIcon />
      </IconButton>

      <TimeDialog
        open={open}
        type="create"
        handleClose={handleClose}
        handleMutate={mutateAsync}
        isLoading={createWorkTime.isPending}
        projects={projects}
        error={error}
      />
    </>
  );
};

export default CreateTimeBtn;
