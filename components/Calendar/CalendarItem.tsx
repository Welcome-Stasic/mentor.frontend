'use client';

import { getColorByPercentage } from '@/lib/utils/getColorByPercentage';
import { Box, Typography, LinearProgress, useMediaQuery } from '@mui/material';
import Link from 'next/link';

interface ICalendarItemProps {
  day: number;
  href: string;
  percentage?: number;
  time?: number;
  disabled?: boolean;
}

const CalendarItem = ({
  day,
  href,
  percentage = 0,
  time = 0,
  disabled = false,
}: ICalendarItemProps) => {
  const isMobile = useMediaQuery('(max-width:768px)');

  if (disabled)
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ccc',
          padding: 1,
          height: isMobile ? 100 : 150,
          borderRadius: '6px',
          backgroundColor: '#f5f5f5',
          color: '#999',
          fontWeight: 'bold',
        }}>
        {day}
      </Box>
    );
    
  const reportHours = Math.floor(time / 60);
  const reportMinutes = time % 60;
  const formattedReportTime = `${reportHours}:${reportMinutes.toString().padStart(2, '0')}`;

  const color = getColorByPercentage(percentage);

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
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
          overflow: 'hidden',
          backgroundColor: '#fafafa',
          textDecoration: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            cursor: 'pointer',
            boxShadow: 3,
            backgroundColor: '#f0f0f0',
          },
        }}>
        <Typography variant="subtitle1" sx={{ position: 'absolute', top: '5px', right: '5px' }}>
          {day}
        </Typography>

        <Typography
          variant={isMobile ? 'body2' : 'body1'}
          sx={{
            color,
            textAlign: 'center',
            fontWeight: 600,
          }}>
          {percentage.toFixed(2)}%
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color,
            position: 'absolute',
            bottom: '5px',
            left: '5px',
            fontWeight: 500,
          }}>
          {formattedReportTime}
        </Typography>

        {percentage > 0 && (
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: 5,
              backgroundColor: '#eee',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
              },
            }}
          />
        )}
      </Box>
    </Link>
  );
};

export default CalendarItem;
