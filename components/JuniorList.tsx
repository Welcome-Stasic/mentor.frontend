import { IJunior } from '@/lib/axios/types/user';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import React, { useMemo } from 'react';
import RenderGroup, { RenderGroupOption } from './ui/RenderGroup';

interface IJuniorListProps {
  selectedUserId: string;
  onChangeUser: (crmUserId: string) => void;
  juniors: IJunior[];
}

const JuniorList = ({ selectedUserId, onChangeUser, juniors }: IJuniorListProps) => {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';
  const fullName = useCurrentUserStore((store) => store.fullName) ?? '';

  const isMentor = useCurrentUserStore((store) => store.isMentor);

  const options: RenderGroupOption[] = useMemo(
    () => [
      { group: 'Мои трудозатраты', title: fullName, value: crmId },
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
    isMentor && <RenderGroup options={options} value={selectedOption} onChange={onChangeUser} />
  );
};

export default JuniorList;
