'use client';

import { DashboardPageTitle } from './DashboardPageTitle';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { DrawerHeader } from '../ui/DrawerHeader';
import { useEffect, useState } from 'react';

import Header from '../Header';
import { useSession } from 'next-auth/react';
import SideBar from '../Sidebar';
import { useOnlineSignalR } from '@/hooks/useOnlineSignalR';

export default function DashboardContainer({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const currentUserRoles = session?.data?.user?.roles || [];

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // md = 900px по умолчанию

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(isDesktop); // если desktop — открыто, если mobile — закрыто
  }, [isDesktop]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  //useOnlineSignalR();
  return (
    <Box sx={{ display: 'flex' }}>
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <SideBar open={open} handleDrawerClose={handleDrawerClose} roles={currentUserRoles} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%', overflow: 'auto' }}>
        <DrawerHeader />
        <DashboardPageTitle />
        {children}
      </Box>
    </Box>
  );
}
