'use client';

import Calendar from '@/components/Calendar/Calendar';
import MonthSwitcher from '@/components/Calendar/MonthSwitcher';
import { useReportTime } from '@/hooks/useReportTime';
import { useWorkTime } from '@/hooks/useWorkTime';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function TimeTrackingPage() {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';

  const [currentDate, setCurrentDate] = useState(dayjs());
  const firstDayOfMonthStr: string = currentDate.startOf('month').format('YYYY-MM-DD');
  const lastDayOfMonthStr: string = currentDate.endOf('month').format('YYYY-MM-DD');

  const reportTime = useReportTime(crmId, firstDayOfMonthStr, lastDayOfMonthStr);
  const workTimes = useWorkTime(crmId, firstDayOfMonthStr, lastDayOfMonthStr);
  const totalWorkMinutes =
    workTimes?.data?.map((i) => i.minutes ?? 0).reduce((sum, value) => sum + value, 0) ?? 0;
  const workHours = Math.floor(totalWorkMinutes / 60);
  const workMinutes = totalWorkMinutes % 60;

  const totalMinutes = reportTime?.data?.minutes ?? 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
  const formattedWorkTime = `${workHours}:${workMinutes.toString().padStart(2, '0')}`;

  return (
    <>
      <MonthSwitcher currentDate={currentDate} onChange={setCurrentDate} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Typography variant="overline">
          Рабочих часов: <span>{reportTime?.data?.fullWorkHours}</span>
        </Typography>
        <Typography variant="overline">
          Отработано часов: <span>{formattedTime}</span>
        </Typography>
        <Typography variant="overline">
          Заполнено часов: <span>{formattedWorkTime}</span>
        </Typography>
      </Box>
      <Calendar
        year={currentDate.year()}
        month={currentDate.month()}
        timeItems={reportTime?.data?.timeItems ?? []}
        workItems={workTimes?.data ?? []}
      />
    </>
  );
}
