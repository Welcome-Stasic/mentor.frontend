'use client';

import { CurrentUserStoreProvider } from '@/providers/current-user-provider';
import { AppBar, Toolbar, Typography, Button, Container, styled } from '@mui/material';
import { signOut } from 'next-auth/react';

const StyledAppBar = styled(AppBar)({
  paddingRight: '0px !important',
  position: 'fixed',
});

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = () => {
    signOut({
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <CurrentUserStoreProvider>
      {/* Общая шапка */}
      <StyledAppBar>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Опрос</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </Toolbar>
      </StyledAppBar>

      {/* Контент */}
      <Toolbar />
      <Container sx={{ my: 5 }}>{children}</Container>
    </CurrentUserStoreProvider>
  );
}
