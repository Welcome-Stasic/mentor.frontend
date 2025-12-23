"use client";

import CreateProjectBtn from "@/components/Projects/CreateProjectBtn";
import DeleteProjectWithConfirmationBtn from "@/components/Projects/DeleteProjectWithConfirmationBtn";
import DateRange from "@/components/Projects/DateRange";
import ProjectUserList from "@/components/Projects/ProjectUserList";
import UpdateProjectBtn from "@/components/Projects/UpdateProjectBtn";
import { useProjects } from "@/hooks/project/useProjects";
import { useProjectTime } from "@/hooks/project/useProjectTime";
import { useCurrentUserStore } from "@/providers/current-user-provider";
import {
  Box,
  Button,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useQueryState } from "nuqs";
import dayjs from "dayjs";
import { useUserById } from "@/hooks/useUserById";

export default function ProjectsPage() {
  const [SelectUser, setSelectUser] = useQueryState("selectUser");
  const [allDisplayProject, setAllDisplayProject] = useState<boolean>(true);
  const currentUserId = useCurrentUserStore((store) => store.id);
  const currentUserFullName = useCurrentUserStore((store) => store.fullName);
  const isMentor = useCurrentUserStore((store) => store.isMentor);
  const isAdmin = useCurrentUserStore((store) => store.isAdmin);

  const [selectedUserId, setSelectedUserId] = useState<string>(
    currentUserId as string
  );
  const [dateFrom] = useQueryState("dateFrom");
  const [dateTo] = useQueryState("dateTo");
  const userElmaId = useUserById(selectedUserId).data?.elmaUserId;

  useEffect(() => {
    if (currentUserId) {
      setSelectedUserId(currentUserId as string);
    }
  }, [currentUserId]);

  const onChangeUser = (id: string) => {
    const userId = id || currentUserId;
    setSelectUser(userId as string);
    setSelectedUserId(userId as string);
  };

  const projectResult = useProjects(selectedUserId);
  const projects = useMemo(
    () => projectResult?.data || [],
    [projectResult?.data]
  );
  const projectTime = useProjectTime(
    userElmaId as unknown as string,
    dateFrom ? dayjs(dateFrom, "DD.MM.YYYY").format("DD.MM.YYYY") : "",
    dateTo ? dayjs(dateTo, "DD.MM.YYYY").format("DD.MM.YYYY") : ""
  );

  const isLoading = projectResult.isPending || projectTime.isLoading;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}`;
  };

  const getProjectTime = (projectName: string) => {
    return projectTime.projectTimeMap.get(projectName) || 0;
  };

  const getFilteredProjects = (projectList: typeof projects) => {
    if (allDisplayProject) {
      return projectList;
    } else {
      return projectList.filter((project) => {
        const projectMinutes = getProjectTime(project.name);
        return projectMinutes > 0;
      });
    }
  };

  const groupedByProject = useMemo(() => {
    const filteredProjects = getFilteredProjects(projects);

    const groups = new Map<string, typeof projects>();
    filteredProjects.forEach((project) => {
      const user = project.createUserFullName?.trim() || "Без имени";
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
  }, [projects, currentUserFullName, allDisplayProject]);

  const filteredProjects = useMemo(() => {
    return getFilteredProjects(projects);
  }, [projects, allDisplayProject]);

  return (
    <>
      <Box sx={{ mb: "4px" }}>
        <ProjectUserList
          selectedUserId={SelectUser as string}
          onChangeUser={onChangeUser}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          justifyContent: "flex-start",
          mb: "4px",
        }}
      >
        <Typography variant="caption">Создать проект</Typography>
        <CreateProjectBtn userId={selectedUserId} />
      </Box>
      <DateRange />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="projects table">
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              {SelectUser != null && SelectUser != currentUserId && (
                <>
                  <TableCell>Затраченное время</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => setAllDisplayProject(!allDisplayProject)}
                    >
                      {allDisplayProject
                        ? "Показать активные проекты"
                        : "Показать все проекты"}
                    </Button>
                  </TableCell>
                </>
              )}
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
                ? // если наставник → показываем сгруппированные проекты с трудозатратами
                  groupedByProject.map(([user, userProjects]) => (
                    <React.Fragment key={user}>
                      <TableRow sx={{ backgroundColor: "#c9c7c7ff" }}>
                        <TableCell colSpan={3}>
                          <Typography variant="subtitle2">{user}</Typography>
                        </TableCell>
                      </TableRow>
                      {userProjects.map((project) => {
                        const projectMinutes = getProjectTime(project.name);
                        return (
                          <TableRow key={project.id}>
                            <TableCell sx={{ maxWidth: 200 }}>
                              {project.name}
                            </TableCell>
                            {SelectUser != null &&
                              SelectUser != currentUserId && (
                                <TableCell sx={{ maxWidth: 300 }}>
                                  <Typography>
                                    {projectMinutes > 0
                                      ? formatTime(projectMinutes)
                                      : "0:00"}
                                  </Typography>
                                </TableCell>
                              )}
                            <TableCell align="right">
                              <Box
                                display="flex"
                                gap={1}
                                justifyContent="flex-end"
                              >
                                <UpdateProjectBtn project={project} />
                                <DeleteProjectWithConfirmationBtn
                                  project={project}
                                />
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </React.Fragment>
                  ))
                : // если НЕ наставник → обычный список с трудозатратами
                  filteredProjects.map((project) => {
                    const projectMinutes = getProjectTime(project.name);
                    return (
                      <TableRow key={project.id}>
                        <TableCell sx={{ maxWidth: 200 }}>
                          {project.name}
                        </TableCell>
                        {SelectUser != null && SelectUser != currentUserId && (
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography>
                              {projectMinutes > 0
                                ? formatTime(projectMinutes)
                                : "0:00"}
                            </Typography>
                          </TableCell>
                        )}
                        <TableCell align="right">
                          <Box display="flex" gap={1} justifyContent="flex-end">
                            <UpdateProjectBtn project={project} />
                            <DeleteProjectWithConfirmationBtn
                              project={project}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
