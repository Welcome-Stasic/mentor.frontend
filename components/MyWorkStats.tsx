'use client';

import { useReportTime } from '@/hooks/useReportTime';
import { useWorkTime } from '@/hooks/useWorkTime';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { Box, Typography, LinearProgress, Skeleton } from '@mui/material';
import dayjs from 'dayjs';
import { formatMinutesToTimeString } from '@/lib/utils/formatMinutesToTimeString';
import { getColorByPercentage } from '@/lib/utils/getColorByPercentage';

export const MyWorkStats = () => {
  const userId = useCurrentUserStore((s) => s.elmaId) ?? '';
  const name = useCurrentUserStore((s) => s.fullName) ?? 'Вы';

  const currentDate = dayjs();
  const firstDay = currentDate.startOf('month').format('YYYY-MM-DD');
  const lastDay = currentDate.endOf('month').format('YYYY-MM-DD');

  const reportTime = useReportTime(userId, firstDay, lastDay);
  const workTimes = useWorkTime(userId, firstDay, lastDay);

  const isLoading =
    reportTime.isLoading || workTimes.isLoading || !reportTime.data || !workTimes.data;

  const totalReportedMinutes = reportTime?.data?.minutes ?? 0;
  const totalWorkMinutes = workTimes?.data?.reduce((sum, i) => sum + (i.minutes ?? 0), 0) ?? 0;

  const formattedReported = formatMinutesToTimeString(totalReportedMinutes);
  const formattedWorked = formatMinutesToTimeString(totalWorkMinutes);

  const progress = Math.min(100, Math.round((totalWorkMinutes / (totalReportedMinutes === 0 ? 480 : totalReportedMinutes)) * 100));

  const color = getColorByPercentage(progress);

  return (
    <Box>
      {isLoading ? (
        <Skeleton width={100} height={24} />
      ) : (
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          {name}
        </Typography>
      )}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="#f0f0f0"
        px={1}
        py={0.5}
        mt={1}
        borderRadius={1}>
        <Box flexGrow={1} mr={2}>
          {isLoading ? (
            <Skeleton variant="rectangular" height={8} />
          ) : (
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                },
              }}
            />
          )}
        </Box>
        <Typography variant="caption" color="textSecondary" whiteSpace="nowrap">
          {isLoading ? <Skeleton width={60} /> : `${progress} % заполнения`}
        </Typography>
      </Box>

      <Typography variant="caption" color="textSecondary" mt={0.5} display="block">
        {isLoading ? (
          <Skeleton width={250} height={18} />
        ) : (
          `Общее время ${formattedReported}, заполненное время ${formattedWorked}`
        )}
      </Typography>
    </Box>
  );
};
