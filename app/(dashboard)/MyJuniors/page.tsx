'use client';

import { useUserJuniors } from '@/hooks/user/useUserJuniors';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';

export default function MyJuniorsPage() {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';

  const juniorResult = useUserJuniors(crmId);
  const juniors = juniorResult.data ?? [];

  if (juniorResult.isPending) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={2}>
      {juniors.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          У вас пока нет стажёров.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {juniors.map((junior) => (
            <Grid key={junior.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
              <Card
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: 2,
                }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={junior.photoUrl ?? '/assets/default-avatar.png'}
                  alt={junior.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {(() => {
                      const nameParts = junior.name?.trim().split(' ') ?? [];
                      const [lastName = '', firstName = '', middleName = ''] = nameParts;
                      return (
                        <>
                          {`${lastName} ${firstName}`}
                          {middleName && <br />}
                          {middleName}
                        </>
                      );
                    })()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Почта: {junior.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Телефон: {junior.phone}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Подразделение: {junior.departmentName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
