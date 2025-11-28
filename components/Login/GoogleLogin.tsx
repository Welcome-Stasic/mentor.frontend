'use client';
import { signInWithProvider } from '@/app/api/auth/[...nextauth]/signInWithProvider';
import { Button, Box, Typography, Avatar } from '@mui/material';
import Image from 'next/image';
import GoogleIcon from '@assets/GoogleIcon.png';
import { useSession } from 'next-auth/react';

const GoogleLogin = () => {
  const session = useSession();
  const picture = session?.data?.user?.picture ?? '';
  const googleHandleOnClick = () => {
    signInWithProvider("google", {
      redirect: true,
      callbackUrl: "/",
    });
  };
  return (
    <>
      <Button
        onClick={googleHandleOnClick}
        variant="outlined"
        sx={{
          borderRadius: '20px',
          borderColor: '#000',
          textTransform: 'none',
          padding: '6px 20px',
          minWidth: { xs: '100%', sm: '160px' },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Иконка Google слева */}
        <Box
          sx={{
            height: '26px',
          }}
        >
          <Image src={GoogleIcon} alt="Google Logo" width={26} height={26} />
        </Box>

        {/* Текст */}
        <Typography
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            fontWeight: 500,
            fontSize: 14,
            color: 'black',
          }}
        >
          Google
        </Typography>
              {/* Аватар справа */}
              <Avatar
                sx={{
                  width: 26,
                  height: 26,
                }}>
                {picture && <Image src={picture} alt="googlelogo" width={26} height={26} />}
              </Avatar>
      </Button>
    </>
  );
};

export default GoogleLogin;
