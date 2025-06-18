'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import OverlayMessage from '@/components/OverlayMessage';
import Sidebar from '@/components/Sidebar';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import { Button } from '@mui/material';
import { signOut } from 'next-auth/react';

export default function DashboardContainer({ children }: { children: React.ReactNode }) {
  const logoutOnClick = () => {
    signOut({
      redirect: true,
      callbackUrl: '/'
    });
  }

  const currentUserRoles = useCurrentUserStore((state) => state.roles);

  return (
    <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      {currentUserRoles.includes('PendingApproval') && (
        <OverlayMessage
          title="Спасибо за прохождение опроса!"
          message="Мы внимательно ознакомимся с вашими ответами, и свяжемся с вами в ближайшее время 😉"
          blurBackground
          blurPercent={80}
          icon={<ManageSearchOutlinedIcon color="info" sx={{ fontSize: 60 }} />}>
          <Button color="primary" variant="contained" onClick={logoutOnClick} sx={{ mt: 2 }}>
            Выйти
          </Button>
        </OverlayMessage>
      )}
      <Header />
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <Sidebar />
          <main style={{ flexGrow: 1, padding: '24px', marginTop: '64px' }}>{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
