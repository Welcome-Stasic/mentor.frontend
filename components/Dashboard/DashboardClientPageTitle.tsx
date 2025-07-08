'use client';

import { getTitleFromPath } from '@/lib/utils/getTitleFromPath';
import { Typography } from '@mui/material';
import { usePathname } from 'next/navigation';

export function DashboardClientPageTitle() {
  const pathname = usePathname();
  const title = getTitleFromPath(pathname);

  return (
    <Typography variant="h4" sx={{ mb: 2 }}>
      {title}
    </Typography>
  );
}
