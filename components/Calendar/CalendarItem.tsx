// components/CalendarItem.tsx
import { Box, Typography, LinearProgress, useMediaQuery } from '@mui/material';

interface ICalendarItemProps {
  day: number;
  percentage?: number;
  time?: string;
};

const CalendarItem = ({ day, percentage = 0, time = '0' }: ICalendarItemProps) => {
  const isZero = percentage === 0;
  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        padding: 1,
        height: isMobile ? 100 : 150,
        position: 'relative',
        borderRadius: '6px',
        overflow: 'hidden'
      }}
    >
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: '5px', right: '5px' }}>{day}</Typography>
      <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ color: isZero ? 'brown' : 'black', textAlign: 'center', alignItems: 'center' }}>
        {percentage.toFixed(2)}%
      </Typography>
      <Typography variant="body2" sx={{ color: isZero ? 'brown' : 'green', position: 'absolute', bottom: '5px', left: '5px' }}>
        {time}
      </Typography>
      {!isZero && (
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 5 }}
        />
      )}
    </Box>
  );
};

export default CalendarItem;
