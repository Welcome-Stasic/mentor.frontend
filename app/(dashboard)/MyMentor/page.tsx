'use client';

import { useMentor } from '@/hooks/user/useMentor';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import { UserPhoto } from '@/components/UserPhoto';

export default function MyMentorPage() {
  const id = useCurrentUserStore((store) => store.id);
  const { data: mentor, isPending } = useMentor(id);

  if (isPending) {
    return (
      <Skeleton
        variant="rounded"
        sx={{ width: { xs: 200, sm: 400 }, height: 250, borderRadius: 4, boxShadow: 2, p: 2 }}
      />
    );
  }

  if (!mentor) {
    return (
      <Box display="flex" justifyContent="left">
        <Typography variant="h6" color="text.secondary">
          У вас нет наставника.
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ width: { xs: 250, sm: 400 }, borderRadius: 4, boxShadow: 2, p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 2,
        }}>
        <Avatar
          alt={mentor.name}
          src={mentor.photoUrl}
          sx={{ width: 120, height: 120, mx: { xs: 'auto', sm: 0 } }}
        />
        <Box textAlign={{ xs: 'center', sm: 'left' }}>
          <Typography variant="h5" fontWeight="bold">
            {mentor.name}
          </Typography>
          {mentor.departmentName && (
            <Box
              display="flex"
              alignItems="center"
              mt={1}
              justifyContent={{ xs: 'center', sm: 'flex-start' }}>
              <BusinessIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {mentor.departmentName}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <CardContent sx={{ mt: 3, pb: '0px !important' }}>
        {mentor.emails?.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle2" gutterBottom>
              Почта
            </Typography>
            {mentor.emails.map((email, index) => (
              <Box key={index} display="flex" alignItems="center">
                <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{email}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {mentor.phones?.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Телефон
            </Typography>
            {mentor.phones.map((phone, index) => (
              <Box key={index} display="flex" alignItems="center">
                <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{phone}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
