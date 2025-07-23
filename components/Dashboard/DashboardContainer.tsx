'use client';

import { DashboardPageTitle } from './DashboardPageTitle';
import {
  Box,
} from '@mui/material';
import { DrawerHeader } from '../ui/DrawerHeader';
import { useState } from 'react';

import Header from '../Header';
import { useSession } from 'next-auth/react';
import { USER_ROLES } from '@/constants';
import OverlayMessage from '../OverlayMessage';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import SideBar from '../SideBar';

export default function DashboardContainer({ children }: { children: React.ReactNode }) {
  const session =  useSession();
  const currentUserRoles = session?.data?.user?.roles || [];

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {currentUserRoles.includes(USER_ROLES.PENDING_APPROVAL.name) && (
        <OverlayMessage
          title="Спасибо за прохождение опроса!"
          message="Мы внимательно ознакомимся с вашими ответами, и свяжемся с вами в ближайшее время 😉"
          blurBackground
          blurPercent={80}
          isShowLogout
          icon={<ManageSearchOutlinedIcon color="info" sx={{ fontSize: 60 }} />}
        />
      )}
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <SideBar open={open} handleDrawerClose={handleDrawerClose} roles={currentUserRoles}/>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%', overflow: 'auto' }}>
        <DrawerHeader />
        <DashboardPageTitle />
        {children}
      </Box>
    </Box>
  );
}
