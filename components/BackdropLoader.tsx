'use client';

import { Backdrop, CircularProgress } from '@mui/material';

interface ILoaderProps {
  open: boolean;
}

const BackdropLoader = ({ open }: ILoaderProps) => {
  return (
    <Backdrop
      open={open}
      sx={{
        position: 'absolute',
        zIndex: (theme) => theme.zIndex.modal + 1,
        color: '#fff',
        borderRadius: 'inherit',
      }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default BackdropLoader;
