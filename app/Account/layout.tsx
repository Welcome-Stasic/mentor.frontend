import { Box, Paper } from '@mui/material';
import logo from '@assets/logo.png';
import mentor from '@assets/resize_ai_mentor_orig_without_bg.png';

import Link from 'next/link';
import BackGroundImageWrapper from '@/components/BackGroundImageWrapper';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <BackGroundImageWrapper>
      <img className="mentorImg" src={mentor.src} alt="Mentor" />
      <Paper
        elevation={3}
        sx={{
          position: 'relative',
          p: 4,
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 2,
          mx: 1,
        }}>
        {/* Логотип */}
        <Box sx={{ mb: 2 }}>
          <Link href="/">
            <img src={logo.src} alt="Logo" style={{ height: 40 }} />
          </Link>
        </Box>
        {children}
      </Paper>
    </BackGroundImageWrapper>
  );
}
