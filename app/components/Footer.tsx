import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SITE_BASE_NAME } from '../constants';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        textAlign: 'center',
      }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} {SITE_BASE_NAME}. Все права защищены.
      </Typography>
    </Box>
  );
}
