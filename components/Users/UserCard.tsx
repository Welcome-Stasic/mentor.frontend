'use client';

import { Card, CardContent, CardHeader, Divider, Typography, Chip, Box } from '@mui/material';
import { UserPhoto } from '../UserPhoto';
import { IApplicationUser } from '@/lib/axios/types/user';

interface IUserCardProps {
  user: IApplicationUser;
}

export const UserCard = ({ user }: IUserCardProps) => {
  const isHasCrmAccount = !!user.elmaUserId;

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
        avatar={<UserPhoto userId={user?.id ?? ''} isOnline={user?.isOnline ?? false} />}
        title={<Typography variant="subtitle1">{user?.fullName}</Typography>}
        subheader={<Typography variant="body2">{user?.email}</Typography>}
      />
      <Divider />
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}>
        <Typography variant="body2">
          <strong>Дата рождения:</strong>{' '}
          {user?.birthDay && new Date(user.birthDay).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          <strong>Телефон:</strong> {user?.phoneNumber}
        </Typography>

        {isHasCrmAccount && (
          <Box>
            <Chip
              label="CRM"
              size="small"
              color="success"
              sx={{ fontSize: '0.75rem', height: '20px' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
