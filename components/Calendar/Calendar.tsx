'use client';

import { Box, useMediaQuery } from '@mui/material';
import CalendarItem from './CalendarItem';
import dayjs from 'dayjs';
import { IReportTimeItem, IWorkTime } from '@/lib/axios/types/time';
import { useMemo } from 'react';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { PAGE } from '@/constants';

interface ICalendarProps {
  year: number;
  month: number;
  timeItems: IReportTimeItem[];
  workItems: IWorkTime[];
}

const Calendar = ({ year, month, timeItems, workItems }: ICalendarProps) => {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';

  const firstDay = dayjs(new Date(year, month, 1));
  const startDayIndex = (firstDay.day() + 6) % 7; // Пн = 0, Вс = 6
  const daysInMonth = firstDay.daysInMonth();
  const totalSlots = startDayIndex + daysInMonth;
  const totalCells = Math.ceil(totalSlots / 7) * 7;
  const isMobile = useMediaQuery('(max-width:768px)');

  // Группируем тайм-данные по дате
  const timeMap = useMemo(() => {
    const map = new Map<string, number>();
    timeItems.forEach((item) => {
      const key = dayjs(item.timeIn).format('YYYY-MM-DD');
      map.set(key, (map.get(key) || 0) + item.fullTime);
    });
    return map;
  }, [timeItems]);

  const workMap = useMemo(() => {
    const map = new Map<string, number>();
    workItems.forEach((item) => {
      const key = dayjs(item.dateTime).format('YYYY-MM-DD');
      map.set(key, (map.get(key) || 0) + (item.minutes ?? 0));
    });
    return map;
  }, [workItems]);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${isMobile ? '3' : '7'}, 1fr)`,
        gap: 1,
      }}>
      {Array.from({ length: totalCells }).map((_, index) => {
        const dayNumber = index - startDayIndex + 1;
        if (index < startDayIndex || dayNumber > daysInMonth) return null;

        const date = dayjs(new Date(year, month, dayNumber)).format('YYYY-MM-DD');
        const minutes = timeMap.get(date) ?? 0;
        const workMinutes = workMap.get(date) ?? 0;

        // Расчёт процента (0–100), защита от деления на 0
        const percentage = minutes > 0 ? Math.round((workMinutes / minutes) * 100) : 0;

        return (
          <CalendarItem
            key={date}
            href={`${PAGE.TIME_TRACKING.pathPrefix}/${crmId}?dateIn=${date}`}
            day={dayNumber}
            time={minutes}
            percentage={percentage}
          />
        );
      })}
    </Box>
  );
};

export default Calendar;
