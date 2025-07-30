'use client';

import Calendar from '@/components/Calendar/Calendar';
import MonthSwitcher from '@/components/Calendar/MonthSwitcher';
import TimeApprovalForm from '@/components/Time/TimeApprovalForm';
import { useReportTime } from '@/hooks/useReportTime';
import { useWorkTime } from '@/hooks/useWorkTime';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Box, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';

function formatMinutesToTimeString(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export default function TimeTrackingPage() {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';
  const isAdmin = useCurrentUserStore((store) => store.isAdmin);

  const selectedTimeUserId = useCurrentUserStore((store) => store.selectedTimeUserId) ?? crmId;

  const isPermission = crmId !== selectedTimeUserId || isAdmin;

  const setSelectedTimeUser = useCurrentUserStore((store) => store.setSelectedTimeUser);

  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());

  const { firstDay, lastDay } = useMemo(() => {
    const firstDay = currentDate.startOf('month').format('YYYY-MM-DD');
    const lastDay = currentDate.endOf('month').format('YYYY-MM-DD');
    return { firstDay, lastDay };
  }, [currentDate]);

  const reportTime = useReportTime(selectedTimeUserId, firstDay, lastDay);
  const workTimes = useWorkTime(selectedTimeUserId, firstDay, lastDay);

  const isLoading =
    reportTime.isLoading || workTimes.isLoading || !reportTime.data || !workTimes.data;

  const totalReportedMinutes = reportTime?.data?.minutes ?? 0;
  const totalWorkMinutes = workTimes?.data?.reduce((sum, i) => sum + (i.minutes ?? 0), 0) ?? 0;

  const formattedReported = formatMinutesToTimeString(totalReportedMinutes);
  const formattedWorked = formatMinutesToTimeString(totalWorkMinutes);

  return (
    <Box display="flex" gap={1} flexDirection="column">
      <Box display="flex" gap={1} justifyContent="space-between" flexDirection="column">
        <MonthSwitcher
          selectedUserId={selectedTimeUserId}
          currentDate={currentDate}
          onChange={setCurrentDate}
          onChangeUser={setSelectedTimeUser}
        />
        {isPermission && <TimeApprovalForm crmUserId={selectedTimeUserId} date={currentDate} />}
      </Box>
      <Box display="flex" gap={1} flexWrap="wrap">
        <Typography variant="overline">
          Рабочих часов: <strong>{reportTime?.data?.fullWorkHours}</strong>
        </Typography>
        <Typography variant="overline">
          Отработано: <strong>{formattedReported}</strong>
        </Typography>
        <Typography variant="overline">
          Заполнено: <strong>{formattedWorked}</strong>
        </Typography>
      </Box>
      <Calendar
        crmId={selectedTimeUserId}
        year={currentDate.year()}
        month={currentDate.month()}
        timeItems={reportTime?.data?.timeItems ?? []}
        workItems={workTimes?.data ?? []}
        isLoading={isLoading}
      />
    </Box>
  );
}
