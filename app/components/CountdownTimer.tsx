'use client';

import { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';

interface CountdownTimerProps {
  expiresAt: string;
}

const formatTime = (time: number) => {
  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  let timeString = '';
  if (hours > 0) {
    timeString += `${hours}ч `;
  }
  if (minutes > 0 || hours > 0) {
    timeString += `${minutes}м `;
  }
  if (seconds > 0 || minutes > 0 || hours > 0) {
    timeString += `${seconds}с`;
  }

  return timeString;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiresAt }) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const expirationTime = new Date(expiresAt);

    if (!expirationTime) {
      console.error('Некорректное значение expiresAt:', expiresAt);
      return;
    }

    const updateTimer = () => {
      const remainingTime = expirationTime.getTime() - Date.now();
      setTimeRemaining(remainingTime > 0 ? remainingTime : 0);
    };

    updateTimer();

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [expiresAt]);

  return (
    <Typography
      variant="h6"
      color="text.primary"
      sx={{
        fontWeight: 600,
        fontSize: '16px',
        textAlign: 'center',
        marginBottom: '8px'
      }}>
      <span>
        {timeRemaining > 0 ? 'Время до завершения регистрации' : 'Регистрация действительная до'}
      </span>
      <Box component="span" sx={{ display: 'block', fontSize: '18px' }}>
        {timeRemaining > 0 ? formatTime(timeRemaining) : new Date(expiresAt).toLocaleString()}
      </Box>
    </Typography>
  );
};

export default CountdownTimer;
