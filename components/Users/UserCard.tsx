'use client';

import { Card, CardContent, CardHeader, Divider, Typography, Chip, Box } from '@mui/material';
import { UserPhoto } from '../UserPhoto';
import { IApplicationUser } from '@/lib/axios/types/user';
import { useCrmUser } from '@/hooks/user/useCrmUser';
import { useMemo } from 'react';

interface IUserCardProps {
  user: IApplicationUser;
}

export const UserCard = ({ user }: IUserCardProps) => {
  const hasCrmAccount = Boolean(user.elmaUserId);
  const { data: crmUser } = useCrmUser(user.elmaUserId?.toString() ?? '');

  const { birthDay, phoneNumber, isBlocked } = useMemo(() => {
    return {
      birthDay: user.birthDay ?? crmUser?.birthDate ?? null,
      phoneNumber: user.phoneNumber ?? crmUser?.mobilePhone ?? '',
      isBlocked: crmUser?.status === 1,
    };
  }, [user.birthDay, user.phoneNumber, crmUser]);

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        boxShadow: 2,
      }}>
      <CardHeader
        avatar={
          <UserPhoto userId={user.id} elmaPhotoUrl={crmUser?.photoUrl} isOnline={user.isOnline} />
        }
        title={<Typography variant="subtitle1">{user.fullName}</Typography>}
        subheader={<Typography variant="body2">{user.email}</Typography>}
      />
      <Divider />
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
        {birthDay && (
          <Typography variant="body2">
            <strong>Дата рождения:</strong> {new Date(birthDay).toLocaleDateString()}
          </Typography>
        )}
        <Typography variant="body2">
          <strong>Телефон:</strong> {phoneNumber}
        </Typography>

        {(hasCrmAccount || isBlocked) && (
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {hasCrmAccount && (
              <Chip
                label="CRM"
                size="small"
                color="success"
                sx={{ fontSize: '0.75rem', height: 20 }}
              />
            )}
            {isBlocked && (
              <Chip
                label="Заблокирован"
                size="small"
                color="error"
                sx={{ fontSize: '0.75rem', height: 20 }}
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
