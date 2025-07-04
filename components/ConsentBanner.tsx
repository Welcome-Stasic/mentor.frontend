'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useConsent } from '@/hooks/useConsent';

export default function ConsentBanner() {
  const { isBannerShow, setConsent, analytics, marketing, loading } = useConsent();

  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [selectedAnalytics, setSelectedAnalytics] = useState(true);
  const [selectedMarketing, setSelectedMarketing] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    setOpen(isBannerShow);
    setSelectedAnalytics(analytics);
    setSelectedMarketing(marketing);
  }, [isBannerShow]);

  const handleAcceptAll = () => {
    setConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    setOpen(false);
  };

  const handleAcceptSelected = () => {
    setConsent({
      necessary: true,
      analytics: selectedAnalytics,
      marketing: selectedMarketing,
    });
    setOpen(false);
  };

  const handleToggleAnalytics = () => {
    setSelectedAnalytics((prev) => !prev);
  };

  const handleToggleMarketing = () => {
    setSelectedMarketing((prev) => !prev);
  };

  const handleClose = () => setOpen(false);

  if (loading || !open) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        maxWidth: 500,
        p: 2,
        zIndex: theme.zIndex.snackbar + 1,
      }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography fontWeight="bold">Мы используем Cookies</Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="body2" mt={1} mb={2}>
        Продолжая использовать наш сайт, вы соглашаетесь с{' '}
        <Link href="/privacy-policy" target="_blank" rel="noopener" color="info">
          политикой использования Cookies
        </Link>
        . Это файлы, которые помогают сделать ваш опыт взаимодействия с сайтом удобнее.
      </Typography>

      {!settingsOpen ? (
        <Stack direction="row" spacing={1}>
          <Button fullWidth variant="contained" onClick={handleAcceptAll}>
            Согласен со всеми
          </Button>
          <Button fullWidth variant="outlined" onClick={() => setSettingsOpen(true)}>
            Настроить
          </Button>
        </Stack>
      ) : (
        <>
          <FormControlLabel control={<Checkbox checked disabled />} label="Обязательные" />
          <FormControlLabel
            control={<Checkbox checked={selectedAnalytics} onChange={handleToggleAnalytics} />}
            label="Аналитические"
          />
          <FormControlLabel
            control={<Checkbox checked={selectedMarketing} onChange={handleToggleMarketing} />}
            label="Маркетинговые"
          />
          <Button fullWidth variant="contained" onClick={handleAcceptSelected}>
            Согласен с выбранными
          </Button>
        </>
      )}
    </Paper>
  );
}
