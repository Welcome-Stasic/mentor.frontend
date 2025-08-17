import { useCurrentUserStore } from '@/providers/current-user-provider';
import React, { useMemo } from 'react';
import RenderGroup, { RenderGroupOption } from '../ui/RenderGroup';
import { useUsers } from '@/hooks/user/useUsers';

interface IProjectUserListProps {
  selectedUserId: string;
  onChangeUser: (id: string) => void;
}

const ProjectUserList = ({ selectedUserId, onChangeUser }: IProjectUserListProps) => {
  const id = useCurrentUserStore((store) => store.id) ?? '';
  const fullName = useCurrentUserStore((store) => store.fullName) ?? '';
  const isAdmin = useCurrentUserStore((store) => store.isAdmin);

  const isPermission = isAdmin;

  const allUsersResult = useUsers({ pageSize: 1000 });

  const allUsers = allUsersResult?.data?.data ?? [];

  const options: RenderGroupOption[] = useMemo(
    () => [
      { group: 'Мои', title: fullName, value: id },
      ...allUsers.map((j) => ({
        group: 'Все остальные',
        title: j.fullName,
        value: String(j.id),
      })),
    ],
    [id, fullName, allUsers],
  );

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === selectedUserId),
    [options, selectedUserId],
  );

  return (
    isPermission && (
      <RenderGroup
        label="Пользователи"
        options={options}
        value={selectedOption}
        onChange={onChangeUser}
      />
    )
  );
};

export default ProjectUserList;
