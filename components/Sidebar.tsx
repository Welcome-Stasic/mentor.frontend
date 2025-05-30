import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

const drawerWidth = 200;

const navItems = [
  { name: 'Главная', href: '/' },
  { name: 'Анкеты', href: '/Request' },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '64px', // header height
        },
      }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} component={Link} href={item.href}>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
