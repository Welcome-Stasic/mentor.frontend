// components/CalendarItem.tsx
import { useReportTime } from '@/hooks/useReportTime';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Box, Typography, LinearProgress, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';

interface ICalendarItemProps {
  day: number;
  date: Date;
  percentage?: number;
  time?: string;
};

const CalendarItem = ({ day, date, percentage = 0, time = '0' }: ICalendarItemProps) => {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';
  
  const startOfDayStr = dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss');
  const endOfDayStr = dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss');

  const reportTime = useReportTime(crmId, startOfDayStr, endOfDayStr);

  const reportTotalMinutes = reportTime?.data?.minutes ?? 0;
  const reportHours = Math.floor(reportTotalMinutes / 60);
  const reportMinutes = reportTotalMinutes % 60;
  const formattedReportTime = `${reportHours}:${reportMinutes.toString().padStart(2, '0')}`;

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
      {startOfDayStr}
      {endOfDayStr}
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: '5px', right: '5px' }}>{day}</Typography>
      <Typography variant={isMobile ? 'body2' : 'body1'} sx={{ color: isZero ? 'brown' : 'black', textAlign: 'center', alignItems: 'center' }}>
        {percentage.toFixed(2)}%
      </Typography>
      <Typography variant="body2" sx={{ color: isZero ? 'brown' : 'green', position: 'absolute', bottom: '5px', left: '5px' }}>
        {formattedReportTime}
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
