'use client';

import Calendar from '@/components/Calendar/Calendar';
import MonthSwitcher from '@/components/Calendar/MonthSwitcher';
import { Box, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function TimeTrackingPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  return (
    <div>
      <MonthSwitcher currentDate={currentDate} onChange={setCurrentDate} />
      <Box sx={{display: 'flex', gap: 2 }}>
        <Typography variant='overline'>Рабочих часов: <span>1</span></Typography>
        <Typography variant='overline'>Отработано часов: <span>1</span></Typography>
        <Typography variant='overline'>Заполнено часов: <span>1</span></Typography>
      </Box>
      <Calendar year={currentDate.year()} month={currentDate.month()} />
    </div>
  );
}
