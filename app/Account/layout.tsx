import { Box, Paper } from '@mui/material';
import logo from '@assets/logo.png';
import mentor from '@assets/resize_ai_mentor_orig_without_bg.png';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url("/assets/back.png")',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        gap: '75px',
        overflow: 'hidden',
      }}>

      <img className="mentorImg" src={mentor.src} alt="Mentor" />

      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          mx: 1
        }}>
        {/* Логотип */}
        <Box sx={{ mb: 2 }}>
          <img src={logo.src} alt="Logo" style={{ height: 40 }} />
        </Box>
        {children}
      </Paper>
    </Box>
  );
}
