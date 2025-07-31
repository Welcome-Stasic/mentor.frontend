'use client';

import { useUserJuniors } from '@/hooks/user/useUserJuniors';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import { JuniorStatisticItem } from './JuniorStatisticItem'; // Обнови путь, если нужно
import { Box } from '@mui/material';

export const JuniorStatistics = () => {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';
  const juniorResult = useUserJuniors(crmId);

  const juniors = juniorResult.data ?? [];

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {juniors.map((junior) => (
        <JuniorStatisticItem key={junior.id} userId={junior.id.toString()} name={junior.name} />
      ))}
    </Box>
  );
};
