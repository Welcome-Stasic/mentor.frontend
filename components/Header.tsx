'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { signOut } from 'next-auth/react';
import { UserPhoto } from './UserPhoto';
import { AppBar } from './ui/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';

const settings = ['Выход'];

interface IHeaderProps {
  handleDrawerOpen: () => void;
  open: boolean;
}

export default function Header({ handleDrawerOpen, open }: IHeaderProps) {
  const isMobile = useMediaQuery('(max-width:768px)');

  const { userName, id, photoUrl } = useCurrentUserStore((state) => state);

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting: string) => {
    setAnchorElUser(null);
    if (setting == 'Выход') {
      signOut({
        redirect: true,
        callbackUrl: '/Account/Login',
      });
    }
  };

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={[
            {
              marginRight: isMobile ? 1.5 : 3,
            },
            open && { display: 'none' },
          ]}>
          <MenuIcon />
        </IconButton>
        <>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              display: { sm: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}>
            НАСТАВНИЧЕСТВО
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={userName}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <UserPhoto
                  userId={id}
                  isOnline
                  elmaPhotoUrl={photoUrl ?? ''}
                  width={46}
                  height={46}
                  isNeedOpenPhoto={false}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </>
      </Toolbar>
    </AppBar>
  );
}
