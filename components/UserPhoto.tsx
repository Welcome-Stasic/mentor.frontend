import { Dialog, DialogContent, Skeleton, Tooltip } from '@mui/material';
import StatusAvatar from './StatusAvatar';
import { useState, useCallback, useMemo } from 'react';
import { useUserPhoto } from '@/hooks/useUserPhoto';
import { useCurrentUserStore } from '@/providers/current-user-provider';

interface IUserPhotoProps {
  userId: string;
  isOnline: boolean;
  elmaPhotoUrl?: string;
  width?: number;
  height?: number;
  isNeedOpenPhoto?: boolean;
}

export const UserPhoto = ({
  userId,
  isOnline,
  elmaPhotoUrl,
  isNeedOpenPhoto = true,
  ...props
}: IUserPhotoProps) => {
  //const isOnline = useCurrentUserStore((i) => i.onlineUserIds.includes(userId));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const photoResult = useUserPhoto(userId, elmaPhotoUrl);

  const photoUrl = useMemo(
    () => photoResult?.data?.url ?? elmaPhotoUrl ?? '',
    [photoResult?.data, elmaPhotoUrl],
  );

  const openDialog = useCallback(() => setIsDialogOpen(true), []);
  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const hasPhoto = Boolean(photoUrl);

  const isLoading = Boolean(!userId || photoResult.isLoading);

  return (
    <>
      <Tooltip title="Нажмите, чтобы увеличить фото" arrow>
        <StatusAvatar
          photoUrl={photoUrl}
          online={isOnline}
          onAvatarClick={openDialog}
          {...props}
          isLoading={isLoading}
        />
      </Tooltip>
      {isNeedOpenPhoto && hasPhoto && (
        <Dialog
          open={isDialogOpen}
          onClose={closeDialog}
          maxWidth="md"
          slotProps={{
            paper: {
              sx: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
              },
            },
          }}>
          <DialogContent sx={{ p: 0 }}>
            <img
              src={photoUrl}
              alt="Фото пользователя"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '80vh',
                objectFit: 'contain',
                borderRadius: 12,
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
