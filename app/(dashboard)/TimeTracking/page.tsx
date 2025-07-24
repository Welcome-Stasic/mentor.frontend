'use client';

import Calendar from '@/components/Calendar/Calendar';
import MonthSwitcher from '@/components/Calendar/MonthSwitcher';
import { useReportTime } from '@/hooks/useReportTime';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function TimeTrackingPage() {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';

  const [currentDate, setCurrentDate] = useState(dayjs());
  const firstDayOfMonth: Date = currentDate.startOf('month').startOf('day').toDate();
  const lastDayOfMonth: Date = currentDate.endOf('month').startOf('day').toDate();

  const reportTime = useReportTime(crmId, firstDayOfMonth, lastDayOfMonth);
  const totalMinutes = reportTime?.data?.minutes ?? 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;

  return (
    <div>
      {firstDayOfMonth.toJSON()}
      {lastDayOfMonth.toJSON()}
      <MonthSwitcher currentDate={currentDate} onChange={setCurrentDate} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="overline">
          Рабочих часов: <span>{reportTime?.data?.fullWorkHours}</span>
        </Typography>
        <Typography variant="overline">
          Отработано часов: <span>{formattedTime}</span>
        </Typography>
        <Typography variant="overline">
          Заполнено часов: <span>1</span>
        </Typography>
      </Box>
      <Calendar year={currentDate.year()} month={currentDate.month()} />
    </div>
  );
}
