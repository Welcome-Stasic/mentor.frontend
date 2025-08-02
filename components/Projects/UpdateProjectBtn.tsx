import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IProjectVm, IUpdateProjectCommand } from '@/lib/axios/types/project';
import { useUpdateProject } from '@/hooks/project/useUpdateProject';
import ProjectDialog, { IProjectDialogFormData } from './ProjectDialog';

interface Props {
  project: IProjectVm;
}

const UpdateProjectBtn = ({ project }: Props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const updateProject = useUpdateProject();

  const mutateAsync = async (data: IProjectDialogFormData) => {
    const body: IUpdateProjectCommand = {
      id: project.id,
      name: data.name
    };

    await updateProject.mutateAsync(body);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleOpen}>
        <EditIcon />
      </IconButton>

      <ProjectDialog
        open={open}
        type="update"
        handleClose={handleClose}
        handleMutate={mutateAsync}
        isLoading={updateProject.isPending}
        project={project}
      />
    </>
  );
};

export default UpdateProjectBtn;
