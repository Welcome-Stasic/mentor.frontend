import { Box, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function ExpiredPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Ссылка недействительна
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Срок действия вашей ссылки истёк. Пожалуйста, запросите новую.
        </Typography>
      </Paper>
    </Box>
  );
}
