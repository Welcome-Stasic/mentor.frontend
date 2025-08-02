'use client';

import CreateProjectBtn from '@/components/Projects/CreateProjectBtn';
import DeleteProjectWithConfirmationBtn from '@/components/Projects/DeleteProjectWithConfirmationBtn';
import UpdateProjectBtn from '@/components/Projects/UpdateProjectBtn';
import { useProjects } from '@/hooks/project/useProjects';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export default function ProjectsPage() {
  const currentUserId = useCurrentUserStore((store) => store.id);
  const projectResult = useProjects(currentUserId);
  const projects = projectResult?.data ?? [];
  const isLoading = projectResult.isPending || !projects;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: '5px',
          alignItems: 'center',
          justifyContent: 'flex-start',
          mb: '4px',
        }}>
        <Typography variant="caption">Создать проект</Typography>
        <CreateProjectBtn />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="grouped project table">
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton width="80%" height={24} />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              : projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell sx={{ maxWidth: 500 }}>{project.name}</TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <UpdateProjectBtn project={project} />
                        <DeleteProjectWithConfirmationBtn project={project} />
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
