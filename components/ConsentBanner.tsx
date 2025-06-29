'use client';

import { useEffect, useState } from 'react';
import { Snackbar, Alert, Button, Link, Stack, useTheme, useMediaQuery } from '@mui/material';
import { useConsent } from '@/context/ConsentContext';

export default function ConsentBanner() {
  const { consentGiven, setConsent, loading } = useConsent();
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setOpen(consentGiven);
  }, [consentGiven]);

  const handleAccept = () => {
    setConsent();
    setOpen(false);
  };

  if (loading) return null;

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      sx={{ zIndex: theme.zIndex.snackbar + 1 }}>
      <Alert
        severity="info"
        variant="filled"
        sx={{
          width: '100%',
          maxWidth: 600,
          mx: 'auto',
          alignItems: 'center',
          fontSize: isMobile ? '0.8rem' : '1rem',
        }}
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              onClick={handleAccept}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderColor: '#fff',
                },
              }}>
              Согласен
            </Button>
            <Link
              href="/privacy-policy"
              underline="hover"
              target="_blank"
              rel="noopener"
              color="inherit"
              sx={{
                fontSize: '0.75rem',
                whiteSpace: 'nowrap',
              }}>
              Подробнее
            </Link>
          </Stack>
        }>
        Мы используем cookies и обрабатываем персональные данные для улучшения работы сайта.
      </Alert>
    </Snackbar>
  );
}
