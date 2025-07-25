'use client';

import { Box, useMediaQuery } from '@mui/material';
import CalendarItem from './CalendarItem';
import dayjs from 'dayjs';
import { IWorkTime } from '@/lib/axios/types/time';

type Props = {
  year: number;
  month: number;
};

type DayData = {
  date: number;
  percentage: number;
  time: string;
};

const dummyDays: DayData[] = [
  { date: 1, percentage: 94.74, time: '07:55' },
  { date: 2, percentage: 96.49, time: '05:42' },
  { date: 3, percentage: 95.85, time: '06:26' },
  { date: 4, percentage: 95.24, time: '06:18' },
  { date: 5, percentage: 0, time: '0' },
  { date: 6, percentage: 0, time: '0' },
  { date: 7, percentage: 88.11, time: '07:34' },
  { date: 8, percentage: 89.11, time: '08:25' },
  { date: 9, percentage: 91.85, time: '08:11' },
  { date: 10, percentage: 96.31, time: '08:08' },
];

const Calendar = ({ year, month }: Props) => {
  const firstDay = dayjs(new Date(year, month, 1));
  const startDayIndex = (firstDay.day() + 6) % 7; // Пн = 0, Вс = 6
  const daysInMonth = firstDay.daysInMonth();

  const totalSlots = startDayIndex + daysInMonth;
  const totalCells = Math.ceil(totalSlots / 7) * 7;

  const isMobile = useMediaQuery('(max-width:768px)');

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${isMobile ? '3' : '7'}, 1fr)`,
        gap: 1,
      }}>
      {Array.from({ length: totalCells }).map((_, index) => {
        const dayNumber = index - startDayIndex + 1;

        const isEmpty = index < startDayIndex || dayNumber > daysInMonth;

        if(isEmpty) return;

        const dayData = dummyDays.find((d) => d.date === dayNumber);

        return (
          <CalendarItem
            key={dayNumber}
            day={dayNumber}
            date={new Date(year, month, dayNumber)}
            percentage={dayData?.percentage ?? 0}
            time={dayData?.time ?? '0'}
          />
        );
      })}
    </Box>
  );
};

export default Calendar;
