'use client';

import { useCrmUser } from '@/hooks/user/useCrmUser';
import { useUserRoles } from '@/hooks/user/useUserRoles';
import { useUserById } from '@/hooks/useUserById';
import {
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';

import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { UserPhoto } from '../UserPhoto';
import { USER_ROLES } from '@/constants';
import { useAssignUserRole } from '@/hooks/user/useAssignUserRole';
import { useRemoveUserRole } from '@/hooks/user/useRemoveUserRole';

const allAvailableRoles = Object.entries(USER_ROLES);

interface IUserPageClientProps {
  userId: string;
}

export const UserPageClient = ({ userId }: IUserPageClientProps) => {
  const { data: user, isLoading: isUserLoading } = useUserById(userId);
  const { data: crmUser, isLoading: isCrmLoading } = useCrmUser(user?.elmaUserId?.toString() || '');
  const rolesResponse = useUserRoles(user?.id ?? '');
  const roles = rolesResponse.data ?? [];
  const isRolesLoading = rolesResponse.isLoading;

  const isLoading = isUserLoading || isCrmLoading || isRolesLoading;

  const { birthDay, phoneNumber, isBlocked, departmentName, fullName } = useMemo(() => {
    return {
      fullName: user?.fullName || crmUser?.fullName || '',
      birthDay: user?.birthDay ?? crmUser?.birthDate ?? null,
      phoneNumber: user?.phoneNumber || crmUser?.mobilePhone || '',
      isBlocked: crmUser?.status === 1,
      departmentName: crmUser?.userInfo?.department?.name || '',
    };
  }, [user, crmUser]);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  const assignUserRole = useAssignUserRole();

  const handleAssignRole = async () => {
    if (!selectedRole || !user?.id) return;

    await assignUserRole.mutateAsync({ userId: user.id, role: selectedRole });

    setDialogOpen(false);
    setSelectedRole('');
  };

  const removeUserRole = useRemoveUserRole();

  const handleDeleteRole = async (role: string) => {
    if (!role || !user?.id) return;

    await removeUserRole.mutateAsync({ userId: user.id, role });
  };

  return (
    <Box sx={{ maxWidth: 900, mr: 'auto' }}>
      <Card elevation={3}>
        <CardHeader
          avatar={
            isLoading ? (
              <Skeleton variant="circular" width={60} height={60} />
            ) : (
              <UserPhoto
                userId={user?.id ?? ''}
                elmaPhotoUrl={crmUser?.photoUrl}
                isOnline={user?.isOnline ?? false}
              />
            )
          }
          title={
            isLoading ? (
              <Skeleton variant="text" width={200} height={32} />
            ) : (
              <Typography variant="h6">{fullName}</Typography>
            )
          }
          subheader={
            isLoading ? (
              <Skeleton variant="text" width={120} height={20} />
            ) : (
              <Typography color="text.secondary">{departmentName || 'Без отдела'}</Typography>
            )
          }
          action={
            isLoading ? (
              <Skeleton variant="rounded" width={100} height={32} />
            ) : (
              <Chip
                label={isBlocked ? 'Заблокирован' : 'Активен'}
                color={isBlocked ? 'error' : 'success'}
                icon={isBlocked ? <BlockIcon /> : <CheckCircleIcon />}
              />
            )
          }
        />

        <CardContent>
          {/* User Info Section */}
          <Box mb={4}>
            <Typography variant="h6" gutterBottom>
              Информация о пользователе
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Телефон
                </Typography>
                {isLoading ? (
                  <Skeleton width="60%" />
                ) : (
                  <Typography>{phoneNumber || 'Не указан'}</Typography>
                )}
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Дата рождения
                </Typography>
                {isLoading ? (
                  <Skeleton width="60%" />
                ) : (
                  <Typography>
                    {birthDay ? new Date(birthDay).toLocaleDateString() : 'Не указана'}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

          {/* Roles Section */}
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">Роли</Typography>
              <Button variant="contained" onClick={() => setDialogOpen(true)} disabled={isLoading}>
                Выдать роль
              </Button>
            </Box>
            {isLoading ? (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" width={100} height={32} />
                ))}
              </Box>
            ) : roles.length > 0 ? (
              roles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  color="primary"
                  sx={{ mr: 1, mb: 1 }}
                  variant="outlined"
                  onDelete={() => handleDeleteRole(role)}
                  deleteIcon={<CloseIcon sx={{ color: 'error.main' }} />}
                />
              ))
            ) : (
              <Typography color="text.secondary">Нет ролей</Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Role Assign Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Выдать роль пользователю</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Роль</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              label="Роль">
              {allAvailableRoles.map(([key, role]) => (
                <MenuItem key={key} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleAssignRole} variant="contained" disabled={!selectedRole}>
            Назначить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
