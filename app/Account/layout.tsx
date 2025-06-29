import { Paper } from '@mui/material';
import mentor from '@assets/resize_ai_mentor_orig_without_bg.png';

import Link from 'next/link';
import BackGroundImageWrapper from '@/components/BackGroundImageWrapper';
import Image from 'next/image';

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
        <Link
          href="/"
          style={{
            marginBottom: '18px',
          }}>
          <Image src="https://eriskip.com/images/logo.svg" alt="Logo" width="223" height="46" />
        </Link>
        {children}
      </Paper>
    </BackGroundImageWrapper>
  );
}
