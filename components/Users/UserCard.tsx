"use client";

import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Chip,
  Box,
  CardActions,
} from "@mui/material";
import { UserPhoto } from "../UserPhoto";
import { IApplicationUser } from "@/lib/axios/types/user";
import { useCrmUser } from "@/hooks/user/useCrmUser";
import { useMemo } from "react";
import { DeleteUserBtn } from "./DeleteUserBtn";
import { useUserRoles } from "@/hooks/user/useUserRoles";

interface IUserCardProps {
  user: IApplicationUser;
}

export const UserCard = ({ user }: IUserCardProps) => {
  const hasCrmAccount = Boolean(user.elmaUserId);
  const { data: crmUser } = useCrmUser(user.elmaUserId?.toString() ?? "");

  const { birthDay, phoneNumber, isBlocked, departmentName, fullName } =
    useMemo(() => {
      return {
        fullName: user.fullName || crmUser?.fullName || "",
        birthDay: user.birthDay ?? crmUser?.birthDate ?? null,
        phoneNumber: user.phoneNumber ?? crmUser?.mobilePhone ?? "",
        isBlocked: crmUser?.status === 1,
        departmentName: crmUser?.userInfo?.department?.name ?? "",
      };
    }, [user.fullName, user.birthDay, user.phoneNumber, crmUser]);

  const rolesResponse = useUserRoles(user.id);
  const roles = rolesResponse.data ?? [];

  return (
    <Card
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <CardHeader
        avatar={
          <UserPhoto
            userId={user.id}
            name={fullName}
            elmaPhotoUrl={crmUser?.photoUrl}
            isOnline={false}
          />
        }
        title={
          <Typography
            variant="subtitle1"
            component="a"
            href={`/User/${user.id}`}
            sx={{
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
              cursor: "pointer",
            }}
          >
            {fullName}
          </Typography>
        }
        subheader={<Typography variant="body2">{user.email}</Typography>}
      />
      <Divider />
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {birthDay && (
          <Typography variant="body2">
            <strong>Дата рождения:</strong>{" "}
            {new Date(birthDay).toLocaleDateString()}
          </Typography>
        )}
        <Typography variant="body2">
          <strong>Телефон:</strong> {phoneNumber}
        </Typography>
        <Typography variant="body2">
          <strong>Подразделение:</strong> {departmentName}
        </Typography>
        {(hasCrmAccount || isBlocked || roles) && (
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            {hasCrmAccount && (
              <Chip
                label="CRM"
                size="small"
                color="success"
                sx={{ fontSize: "0.75rem", height: 20 }}
              />
            )}
            {isBlocked && (
              <Chip
                label="Заблокирован"
                size="small"
                color="error"
                sx={{ fontSize: "0.75rem", height: 20 }}
              />
            )}
            {roles &&
              roles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  color="info"
                  sx={{ fontSize: "0.75rem", height: 20 }}
                />
              ))}
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ display: "flex", gap: 1 }}>
        {!roles.includes("Admin") && (
          <Box sx={{ ml: "auto" }}>
            <DeleteUserBtn user={user} />
          </Box>
        )}
      </CardActions>
    </Card>
  );
};
