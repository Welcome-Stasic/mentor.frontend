'use client';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode2';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { JuniorStatistics } from '@/components/JuniorStatistics/JuniorStatistics';
import { MyWorkStats } from '@/components/MyWorkStats';
import { useCurrentUserStore } from '@/providers/current-user-provider';

type LinkItem = {
  title: string;
  url: string;
};

const links: LinkItem[] = [
  { title: 'Корпоративная страница', url: 'https://home.eriskip.com' },
  { title: 'Телефонный справочник', url: 'https://phone.eriskip.com/' },
  { title: 'Учет рабочего времени', url: 'https://t.me/EriskipTimeControlBot' },
  { title: 'Инструкции', url: 'http://drexplain.eriskip.com' },
  { title: 'Азбука', url: 'https://t.me/Eris_Guide_Bot' },
  { title: 'Библиотекарь', url: 'https://t.me/eris_library_bot' },
  { title: 'Музей', url: 'https://museum.eriskip.com' },
  { title: 'ELMA', url: 'https://elma.eriskip.com' },
];

export default function HomePage() {
  const isMentor = useCurrentUserStore((s) => s.isMentor);

  const [qrOpen, setQrOpen] = useState(false);
  const [currentQr, setCurrentQr] = useState<{ title: string; url: string } | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleOpenQr = (title: string, url: string) => {
    setCurrentQr({ title, url });
    setQrOpen(true);
  };

  const handleCloseQr = () => {
    setQrOpen(false);
    setCurrentQr(null);
  };

  return (
    <Box display="flex" gap={3} flexDirection={isMobile ? 'column' : 'row'}>
      <Box order={isMobile ? 2 : 1}>
        <Grid container spacing={3}>
          {links.map((link, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">{link.title}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ wordBreak: 'break-all' }}
                    component="a"
                    href={link.url}
                    target="_blank">
                    {link.url}
                  </Typography>

                  <Box mt={1}>
                    <Tooltip title="Скопировать ссылку">
                      <IconButton onClick={() => handleCopy(link.url)}>
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Показать QR-код">
                      <IconButton onClick={() => handleOpenQr(link.title, link.url)}>
                        <QrCodeIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box
        width={isMobile ? '100%' : 800}
        display="flex"
        flexDirection="column"
        gap={2}
        order={isMobile ? 1 : 2}>
        <MyWorkStats />
        {isMentor && <JuniorStatistics />}
      </Box>
      {/* Окно с QR-кодом */}
      <Dialog open={qrOpen} onClose={handleCloseQr}>
        <DialogTitle>QR-код: {currentQr?.title}</DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          {currentQr && (
            <>
              <QRCodeSVG value={currentQr.url} size={256} />
              <Box mt={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigator.clipboard.writeText(currentQr.url)}>
                  Скопировать ссылку
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
