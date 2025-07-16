'use client';

import { useReferralLink } from '@/hooks/useReferralLink';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Typography, Box, IconButton, Snackbar, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useState } from 'react';
import BackdropLoader from '../BackdropLoader';

export function ReferralContainer() {
  const currentUserId = useCurrentUserStore((state) => state.id);
  const { data } = useReferralLink(currentUserId);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showSnack = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  };

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSnack('Ссылка скопирована');
    } catch (err) {
      console.error('Clipboard copy failed', err);
      showSnack('Не удалось скопировать ссылку');
    }
  };

  const copyImage = async (dataUrl: string) => {
    try {
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      showSnack('QR‑код скопирован');
    } catch (err) {
      console.warn('Image copy failed, falling back to text', err);
      await copyText(dataUrl);
    }
  };

  if (!data?.qrCodeBase64 || !data.referralUrl) return <BackdropLoader open />;

  return (
    <>
      <Typography variant="subtitle2" gutterBottom>
        Поделитесь своей реферальной ссылкой с другими
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'left',
          gap: 1,
          maxWidth: 360,
        }}>
        {/* QR IMAGE – click copies IMAGE to clipboard */}
        <Tooltip title="Нажмите, чтобы скопировать QR‑код" arrow>
          <Box
            component="img"
            src={data.qrCodeBase64}
            alt="Referral QR code"
            sx={{
              width: 192,
              height: 192,
              cursor: 'pointer',
              transition: 'transform .2s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
            onClick={() => copyImage(data.qrCodeBase64)}
          />
        </Tooltip>

        {/* REFERRAL URL – click copies TEXT url */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'grey.100',
            borderRadius: 2,
            px: 2,
            py: 1,
            width: '100%',
          }}>
          <Tooltip title="Нажмите, чтобы скопировать" arrow>
            <Typography
              variant="body2"
              sx={{
                flexGrow: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer',
              }}
              onClick={() => copyText(data.referralUrl)}>
              {data.referralUrl}
            </Typography>
          </Tooltip>

          <IconButton size="small" onClick={() => copyText(data.referralUrl)}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Нажмите на QR‑код, чтобы скопировать изображение, или на ссылку, чтобы скопировать URL
        </Typography>
      </Box>

      {/* COPY CONFIRMATION */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
