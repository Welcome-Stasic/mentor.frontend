import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

interface IMonthSwitcherProps {
  currentDate: dayjs.Dayjs;
  onChange: (newDate: dayjs.Dayjs) => void;
}

const MonthSwitcher = ({ currentDate, onChange }: IMonthSwitcherProps) => {
  const handlePrev = () => onChange(currentDate.subtract(1, 'month'));
  const handleNext = () => onChange(currentDate.add(1, 'month'));

  return (
    <Box
      display="flex"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="flex-start"
      gap={1}
      flexDirection={{ xs: 'column', sm: 'row' }} // xs: вертикально, sm и выше — горизонтально
    >
      <Typography variant="h6">Наряд за</Typography>

      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <IconButton color="primary" onClick={handlePrev}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">
          {currentDate.locale('ru').format('MMMM YYYY').toUpperCase()}
        </Typography>
        <IconButton color="primary" onClick={handleNext}>
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MonthSwitcher;
