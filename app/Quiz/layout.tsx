'use client';

import { useLogout } from '@/hooks/useLogout';
import { CurrentUserStoreProvider } from '@/providers/current-user-provider';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <CurrentUserStoreProvider>
      {/* Общая шапка */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Опрос</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Выйти
          </Button>
        </Toolbar>
      </AppBar>

      {/* Контент */}
      <Container sx={{ my: 5 }}>{children}</Container>
    </CurrentUserStoreProvider>
  );
}
