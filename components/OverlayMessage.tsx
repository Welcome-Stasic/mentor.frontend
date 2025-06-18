'use client';

import { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';

type OverlayMessageProps = {
  title?: string;
  message?: string;
  icon?: ReactNode;
  blurBackground?: boolean;
  blurPercent?: number;
  children?: ReactNode;
};

const OverlayMessage: React.FC<OverlayMessageProps> = ({
  title = 'Сообщение',
  message = 'Произошла непредвиденная ошибка.',
  icon,
  blurBackground = false,
  blurPercent = 50, // по умолчанию 50%
  children,
}) => {
  const blurPx = `${(blurPercent / 100) * 16}px`; // 100% → 16px

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
      </Paper>
    </Box>
  );
};

export default OverlayMessage;
