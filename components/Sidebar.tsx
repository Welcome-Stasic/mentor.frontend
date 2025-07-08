import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { PAGE } from '@/constants';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

const navItems = [PAGE.HOME, PAGE.REQUEST];

export default async function Sidebar() {
  const session = await getServerSession(authOptions);
  const roles = session?.user.roles || [];
  const filteredNavItems = navItems.filter(
    (i) => !i.roles || i.roles.length === 0 || i.roles.some((role) => roles.includes(role)),
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 100,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 'maxContent',
          boxSizing: 'border-box',
          marginTop: '64px', // header height
        },
      }}>
      <List>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <ListItem
              sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
              key={item.name}
              component={Link}
              href={item.pathPrefix}>
              <Icon sx={{ fontSize: '30px' }} />
              <ListItemText primary={item.name} />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
