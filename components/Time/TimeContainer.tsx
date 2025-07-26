'use client';

import { useReportTime } from '@/hooks/useReportTime';
import { useWorkTime } from '@/hooks/useWorkTime';
import { getColorByPercentage } from '@/lib/utils/getColorByPercentage';
import {
  Box,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import 'dayjs/locale/ru';
import DeleteTimeBtnWithConfirmation from './DeleteTimeWithConfirmation';
import UpdateTimeBtn from './UpdateTime';
import CreateTimeBtn from './CreateTime';
import BackdropLoader from '../BackdropLoader';

interface ITimeContainer {
  userId: string;
  dateIn: string;
  dateOut: string;
}

const TimeContainer = ({ userId, dateIn, dateOut }: ITimeContainer) => {
  const firstDayOfMonthStr: string = dayjs(dateIn).format('YYYY-MM-DD');
  const lastDayOfMonthStr: string = dayjs(dateOut).format('YYYY-MM-DD');

  const reportTime = useReportTime(userId, firstDayOfMonthStr, lastDayOfMonthStr);
  const totalReportMinutes = reportTime?.data?.minutes ?? 0;
  const reportHours = Math.floor(totalReportMinutes / 60);
  const reportMinutes = totalReportMinutes % 60;
  const formattedTime = `${reportHours}:${reportMinutes.toString().padStart(2, '0')}`;

  const workTime = useWorkTime(userId, firstDayOfMonthStr, lastDayOfMonthStr);
  const workTimes = workTime?.data ?? [];

  const isLoading =
    reportTime.isLoading || workTime.isLoading || !reportTime.data || !workTime?.data;

  const workMap = useMemo(() => {
    const map = new Map<string, number>();
    workTimes.forEach((item) => {
      const key = dayjs(item.dateTime).format('YYYY-MM-DD');
      map.set(key, (map.get(key) || 0) + (item.minutes ?? 0));
    });
    return map;
  }, [workTimes]);
  const totalWorkMinutes = workMap.get(firstDayOfMonthStr) ?? 0;
  const workHours = Math.floor(totalWorkMinutes / 60);
  const workMinutes = totalWorkMinutes % 60;
  const formattedWorkTime = `${workHours}:${workMinutes.toString().padStart(2, '0')}`;

  const percentage =
    totalReportMinutes > 0 ? Math.round((totalWorkMinutes / totalReportMinutes) * 100) : 0;

  const color = getColorByPercentage(percentage);

  return (
    <>
      <Typography variant="h6">{dayjs(dateIn).locale('ru').format('DD MMMM YYYY')}</Typography>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          overflow: 'hidden',
        }}>
        <Box
          sx={{
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(percentage, 100)}
            sx={{
              width: '200px',
              height: 5,
              backgroundColor: '#eee',
              '& .MuiLinearProgress-bar': {
                backgroundColor: color,
              },
            }}
          />
          <Typography variant="overline">
            Заполнено на: <span>{percentage.toFixed(2)}%</span>
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="overline">
            Отработано часов: <span>{formattedTime}</span>
          </Typography>
          <Typography variant="overline">
            Заполнено часов: <span>{formattedWorkTime}</span>
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '5px',
          alignItems: 'center',
          justifyContent: 'flex-start',
          mb: '4px',
        }}>
        <Typography variant="caption">Занести трудозатраты</Typography>
        <CreateTimeBtn userId={userId} date={dateIn} />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Задача</TableCell>
              <TableCell>Описание задачи</TableCell>
              <TableCell>Затраченное время</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workTimes.map((time) => {
              const totalMinutes = time.minutes ?? 0;
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;
              const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;

              return (
                <TableRow
                  key={time.entityId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {time.task}
                  </TableCell>
                  <TableCell>{time.comment}</TableCell>
                  <TableCell>{formattedTime}</TableCell>
                  <TableCell>
                    <UpdateTimeBtn time={time} />
                    <DeleteTimeBtnWithConfirmation time={time} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TimeContainer;
