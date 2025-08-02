'use client';

import Calendar from '@/components/Calendar/Calendar';
import MonthSwitcher from '@/components/Calendar/MonthSwitcher';
import TimeApprovalForm from '@/components/Time/TimeApprovalForm';
import { useReportTime } from '@/hooks/useReportTime';
import { useWorkTime } from '@/hooks/useWorkTime';
import { formatMinutesToTimeString } from '@/lib/utils/formatMinutesToTimeString';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Box, Skeleton, Typography } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useQueryState } from 'nuqs';
import { useEffect, useMemo, useState } from 'react';

export default function TimeTrackingPage() {
  const [dateParam, setDateParam] = useQueryState('date', {
    history: 'replace',
    parse: (v) => (v ? dayjs(v) : dayjs()),       
    serialize: (v) => v.format('YYYY-MM-DD'),       
  });

  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';
  const isAdmin = useCurrentUserStore((store) => store.isAdmin);

  const selectedTimeUserId = useCurrentUserStore((store) => store.selectedTimeUserId) ?? crmId;

  const isPermission = crmId !== selectedTimeUserId || isAdmin;

  const setSelectedTimeUser = useCurrentUserStore((store) => store.setSelectedTimeUser);

  const [currentDate, setCurrentDate] = useState<Dayjs>(dateParam ?? dayjs());

  useEffect(() => {
    setDateParam(currentDate);
  }, [currentDate]);

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

      <Box display="flex" gap={2} flexWrap="wrap">
        {isLoading ? (
          <>
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={100} height={24} />
            <Skeleton variant="text" width={100} height={24} />
          </>
        ) : (
          <>
            <Typography variant="overline">
              Рабочих часов: <strong>{reportTime?.data?.fullWorkHours}</strong>
            </Typography>
            <Typography variant="overline">
              Отработано: <strong>{formattedReported}</strong>
            </Typography>
            <Typography variant="overline">
              Заполнено: <strong>{formattedWorked}</strong>
            </Typography>
          </>
        )}
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
