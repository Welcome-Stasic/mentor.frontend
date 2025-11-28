'use client';

import { signInWithProvider } from '@/app/api/auth/[...nextauth]/signInWithProvider';
import { Avatar, Button, Typography } from '@mui/material';
import YandexIcon from '@assets/YandexIcon.svg';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const YandexLogin = () => {
  const session = useSession();
  const picture = session?.data?.user?.picture ?? '';

  const yandexHandleOnClick = () => {
    signInWithProvider('yandex', {
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <Button
      onClick={yandexHandleOnClick}
      variant="outlined"
      sx={{
        borderRadius: '20px',
        borderColor: '#000',
        textTransform: 'none',
        padding: '6px 20px',
        minWidth: {
          xs: '100%',
          sm: 'calc(50% - 5px)',
        },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {/* Иконка Яндекса слева */}
      <Avatar
        sx={{
          width: 26,
          height: 26,
        }}>
        <Image src={YandexIcon} alt="yandexlogo" width={26} />
      </Avatar>

      {/* Текст по центру */}
      <Typography
        sx={{
          flexGrow: 1,
          textAlign: 'center',
          fontWeight: 500,
          fontSize: 14,
          color: 'black',
        }}>
        Яндекс
      </Typography>

      {/* Аватар справа */}
      <Avatar
        sx={{
          width: 26,
          height: 26,
        }}>
        {picture && <Image src={picture} alt="yandexlogo" width={26} height={26} />}
      </Avatar>
    </Button>
  );
};

export default YandexLogin;
