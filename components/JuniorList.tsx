import { IJunior } from '@/lib/axios/types/user';
import { useCurrentUserStore } from '@/providers/current-user-provider';
import React, { useMemo } from 'react';
import RenderGroup, { RenderGroupOption } from './ui/RenderGroup';
import { useAllJuniors } from '@/hooks/user/useAllJuniors';

interface IJuniorListProps {
  selectedUserId: string;
  onChangeUser: (crmUserId: string) => void;
  juniors: IJunior[];
}

const JuniorList = ({ selectedUserId, onChangeUser, juniors }: IJuniorListProps) => {
  const crmId = useCurrentUserStore((store) => store.elmaId) ?? '';
  const fullName = useCurrentUserStore((store) => store.fullName) ?? '';
  const isAdmin = useCurrentUserStore((store) => store.isAdmin);
  const isMentor = useCurrentUserStore((store) => store.isMentor);

  const isPermission = isMentor || isAdmin;

  const allJuniorsResult = useAllJuniors(
    {
      includeOnly: juniors.length > 0 ? false : null,
      userIds: juniors.map((i) => i.id),
    },
    isAdmin,
  );

  const allJuniors = allJuniorsResult?.data ?? [];

  const options: RenderGroupOption[] = useMemo(
    () => [
      { group: 'Мои трудозатраты', title: fullName, value: crmId },
      ...juniors.map((j) => ({
        group: 'Мои стажеры',
        title: j.name,
        value: String(j.id),
      })),
      ...allJuniors.map((j) => ({
        group: 'Все остальные',
        title: j.name,
        value: String(j.id),
      })),
    ],
    [crmId, fullName, juniors, allJuniors],
  );

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === selectedUserId),
    [options, selectedUserId],
  );

  return (
    isPermission && (
      <RenderGroup
        label="Стжеры"
        options={options}
        value={selectedOption}
        onChange={onChangeUser}
      />
    )
  );
};

export default JuniorList;
