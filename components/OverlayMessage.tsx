'use client';

import { ReactNode } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import { signOut } from 'next-auth/react';

type OverlayMessageProps = {
  title?: string;
  message?: string;
  icon?: ReactNode;
  blurBackground?: boolean;
  blurPercent?: number;
  children?: ReactNode;
  isShowLogout?: boolean;
};

const OverlayMessage: React.FC<OverlayMessageProps> = ({
  title = '',
  message = '',
  icon,
  blurBackground = false,
  blurPercent = 50, // по умолчанию 50%
  isShowLogout = false,
  children,
}) => {
  const blurPx = `${(blurPercent / 100) * 16}px`; // 100% → 16px

  const logoutOnClick = () => {
    signOut({
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      zIndex={1300}
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="rgba(0, 0, 0, 0.3)"
      sx={{
        p: 2,
        backdropFilter: blurBackground ? `blur(${blurPx})` : 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, textAlign: 'center' }}>
        {icon && <Box mb={2}>{icon}</Box>}
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
        {children}
        {isShowLogout && (
          <Button color="primary" variant="contained" onClick={logoutOnClick} sx={{ mt: 2 }}>
            Выйти
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default OverlayMessage;
