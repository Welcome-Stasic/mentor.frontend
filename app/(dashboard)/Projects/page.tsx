'use client';

import CreateProjectBtn from '@/components/Projects/CreateProjectBtn';
import DeleteProjectWithConfirmationBtn from '@/components/Projects/DeleteProjectWithConfirmationBtn';
import ProjectUserList from '@/components/Projects/ProjectUserList';
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
import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';

export default function ProjectsPage() {
  const currentUserId = useCurrentUserStore((store) => store.id);
  const currentUserFullName = useCurrentUserStore((store) => store.fullName);

  const [selectedUserId, setSelectedUserId] = useState<string>(currentUserId);

  useEffect(() => {
    if (currentUserId) {
      setSelectedUserId(currentUserId);
    }
  }, [currentUserId]);

  const isMentor = useCurrentUserStore((store) => store.isMentor);
  const isAdmin = useCurrentUserStore((store) => store.isAdmin);

  const projectResult = useProjects(selectedUserId);
  const projects = projectResult?.data ?? [];
  const isLoading = projectResult.isPending || !projects;

  const groupedByProject = useMemo(() => {
    const groups = new Map<string, typeof projects>();
    projects.forEach((project) => {
      const user = project.createUserFullName?.trim() || 'Без имени';
      if (!groups.has(user)) {
        groups.set(user, []);
      }
      groups.get(user)?.push(project);
    });

    const entries = Array.from(groups.entries());
    entries.sort(([a], [b]) => {
      if (a === currentUserFullName) return -1;
      if (b === currentUserFullName) return 1;
      return a.localeCompare(b);
    });

    return entries;
  }, [projects, currentUserFullName]);

  return (
    <>
      <Box sx={{ mb: '4px' }}>
        <ProjectUserList selectedUserId={selectedUserId} onChangeUser={setSelectedUserId} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '5px',
          alignItems: 'center',
          justifyContent: 'flex-start',
          mb: '4px',
        }}>
        <Typography variant="caption">Создать проект</Typography>
        <CreateProjectBtn userId={selectedUserId} />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="projects table">
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
              : isMentor || isAdmin
              ? // если наставник → показываем сгруппированные проекты
                groupedByProject.map(([user, userProjects]) => (
                  <React.Fragment key={user}>
                    <TableRow sx={{ backgroundColor: '#c9c7c7ff' }}>
                      <TableCell colSpan={2}>
                        <Typography variant="subtitle2">{user}</Typography>
                      </TableCell>
                    </TableRow>
                    {userProjects.map((project) => (
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
                  </React.Fragment>
                ))
              : // если НЕ наставник → обычный список
                projects.map((project) => (
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
