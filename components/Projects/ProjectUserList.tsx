import { useCurrentUserStore } from '@/providers/current-user-provider';
import React, { useEffect, useMemo, useState } from 'react';
import RenderGroup, { RenderGroupOption } from '../ui/RenderGroup';
import { API } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { IJunior } from '@/lib/axios/types/user';

interface IProjectUserListProps {
  selectedUserId: string;
  onChangeUser: (id: string) => void;
}

const ProjectUserList = ({ selectedUserId, onChangeUser }: IProjectUserListProps) => {

  const { data: session } = useSession();
  const accessToken = session?.user?.accessToken ?? '';

  const { juniorIds, isMentor, isAdmin } = useCurrentUserStore((store) => store);

  const isPermission = isMentor || isAdmin;

  const [options, setOptions] = useState<RenderGroupOption[]>([]);

  useEffect(() => {
    if (!isPermission) return;

    const fetchUsers = async () => {
      try {
        let allOptions: RenderGroupOption[] = [];
        let juniors: IJunior[] = [];

        // Получаем стажеров только если есть id
        if (juniorIds.length > 0) {
          const juniorsData = await API.user.getAllJuniors(
            { includeOnly: true, userIds: juniorIds },
            accessToken,
          );

          juniors = juniorsData?.Result?.filter((i) => i.appId) ?? [];

          const juniorOptions: RenderGroupOption[] = juniors.map((i) => ({
            group: 'Мои стажеры',
            title: i.name,
            value: i.appId,
          }));

          allOptions = [...juniorOptions];
        }

        // Если админ, добавляем остальных пользователей
        if (isAdmin) {
          const usersResponse = await API.user.getAllUsers(accessToken, {
            pageSize: 1000,
            includeOnly: !(juniors.length > 0),
            userIds: juniors.map((i) => i.appId),
          });

          const users = usersResponse?.Result?.data.filter(i => i.elmaUserId) ?? [];

          const userOptions: RenderGroupOption[] = users.map((i) => ({
            group: 'Все остальные',
            title: i.fullName,
            value: i.id,
          }));

          allOptions = [...allOptions, ...userOptions];
        }

        setOptions(allOptions);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };

    fetchUsers();
  }, [juniorIds, isAdmin, accessToken, isPermission]);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === selectedUserId) || null,
    [options, selectedUserId],
  );

  if (!isPermission) return null;

  return (
    <RenderGroup
      label={isAdmin ? 'Пользователи' : 'Стажеры'}
      isGrouped={isMentor && !isAdmin ? false : isAdmin}
      options={options}
      value={selectedOption}
      onChange={onChangeUser}
    />
  );
};

export default ProjectUserList;
