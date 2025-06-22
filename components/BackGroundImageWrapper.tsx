import { Box } from '@mui/material';
import back from '@assets/back.png';
('next/link');

export default function BackGroundImageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${back.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        gap: '75px',
        overflow: 'hidden',
      }}>
      {children}
    </Box>
  );
}
