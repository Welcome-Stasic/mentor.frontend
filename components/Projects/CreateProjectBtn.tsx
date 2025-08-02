import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useCreateProject } from '@/hooks/project/useCreateProject';
import { ICreateProjectDto } from '@/lib/axios/types/project';
import ProjectDialog, { IProjectDialogFormData } from './ProjectDialog';

const CreateProjectBtn = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const createProject = useCreateProject();

  const mutateAsync = async (data: IProjectDialogFormData) => {
    const body: ICreateProjectDto = {
      name: data.name,
    };

    await createProject.mutateAsync(body);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleOpen} >
        <AddIcon />
      </IconButton>

      <ProjectDialog
        open={open}
        type="create"
        handleClose={handleClose}
        handleMutate={mutateAsync}
        isLoading={createProject.isPending}
      />
    </>
  );
};

export default CreateProjectBtn;
