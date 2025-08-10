import { Box, Divider, Typography } from '@mui/material';
import YandexLogin from './YandexLogin';

export default function ExtraAuth() {
  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Или войдите через
        </Typography>
      </Divider>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}>
        {/* Кнопка Яндекс */}
        <YandexLogin />
      </Box>
    </Box>
  );
}
