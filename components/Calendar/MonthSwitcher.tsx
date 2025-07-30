import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useUserJuniors } from '@/hooks/user/useUserJuniors';
import RenderGroup, { RenderGroupOption } from '../ui/RenderGroup';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { useMemo } from 'react';

interface IMonthSwitcherProps {
  selectedUserId: string;
  currentDate: dayjs.Dayjs;
  onChange: (newDate: dayjs.Dayjs) => void;
  onChangeUser: (crmUserId: string) => void;
}

const MonthSwitcher = ({
  selectedUserId,
  currentDate,
  onChange,
  onChangeUser,
}: IMonthSwitcherProps) => {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';
  const isMentor = useCurrentUserStore((store) => store.isMentor);

  const handlePrev = () => onChange(currentDate.subtract(1, 'month'));
  const handleNext = () => onChange(currentDate.add(1, 'month'));

  const juniorResult = useUserJuniors(crmId);
  const juniors = juniorResult.data ?? [];

  const options: RenderGroupOption[] = useMemo(
    () => [
      { group: 'Мои трудозатраты', title: 'Я', value: crmId },
      ...juniors.map((j) => ({
        group: 'Мои стажеры',
        title: j.name,
        value: String(j.id),
      })),
    ],
    [crmId, juniors],
  );

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === selectedUserId),
    [options, selectedUserId],
  );

  return (
    <Box
      display="flex"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="flex-start"
      gap={1}
      flexDirection={{ xs: 'column', sm: 'row' }} // xs: вертикально, sm и выше — горизонтально
    >
      <Typography variant="h6">Наряд за</Typography>

      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <IconButton color="primary" onClick={handlePrev}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">
          {currentDate.locale('ru').format('MMMM YYYY').toUpperCase()}
        </Typography>
        <IconButton color="primary" onClick={handleNext}>
          <ChevronRight />
        </IconButton>
      </Box>

      {isMentor && <RenderGroup options={options} value={selectedOption} onChange={onChangeUser} />}
    </Box>
  );
};

export default MonthSwitcher;
