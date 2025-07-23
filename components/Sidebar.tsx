'use client';

import { PAGE } from '@/constants';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import { Drawer } from './ui/Drawer';
import { DrawerHeader } from './ui/DrawerHeader';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Divider, ListItemButton, useTheme } from '@mui/material';

interface ISideBarProps {
  roles: string[];
  open: boolean;
  handleDrawerClose: () => void;
}

export default function SideBar({ roles, open, handleDrawerClose }: ISideBarProps) {
  const theme = useTheme();

  const filteredNavItems = PAGE_LIST.filter(
    (i) => !i.roles || i.roles.length === 0 || i.roles.some((role) => roles.includes(role)),
  );

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {filteredNavItems.map((page, index) => {
          const Icon = page.icon;
          return (
            <ListItem key={page.name} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                href={page.pathPrefix}
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                  },
                  open
                    ? {
                        justifyContent: 'initial',
                      }
                    : {
                        justifyContent: 'center',
                      },
                ]}>
                <Icon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: 'center',
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: 'auto',
                        },
                  ]}
                />
                <ListItemText
                  primary={page.name}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

const PAGE_LIST = [PAGE.HOME, PAGE.REQUEST, PAGE.REFERRAL];
