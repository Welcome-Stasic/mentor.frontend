import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

type Props = {
  currentDate: dayjs.Dayjs;
  onChange: (newDate: dayjs.Dayjs) => void;
};

const MonthSwitcher = ({ currentDate, onChange }: Props) => {
  const handlePrev = () => onChange(currentDate.subtract(1, 'month'));
  const handleNext = () => onChange(currentDate.add(1, 'month'));

  return (
    <Box display="flex" alignItems="center" mb={1}>
      <Typography variant="h6" mr={1}>
        Наряд за
      </Typography>
      <IconButton  color='primary' onClick={handlePrev}>
        <ChevronLeft />
      </IconButton>
      <Typography variant="h6" mx={1}>
        {currentDate.locale('ru').format('MMMM YYYY').toUpperCase()}
      </Typography>
      <IconButton color='primary' onClick={handleNext}>
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default MonthSwitcher;