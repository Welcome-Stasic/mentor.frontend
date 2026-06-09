import React from 'react';
import { Avatar, Badge, Skeleton } from '@mui/material';
import { CSSObject, styled } from '@mui/material/styles';

interface StatusAvatarProps {
  name: string;
  photoUrl: string;
  online?: boolean;
  onAvatarClick?: () => void;
  width?: number;
  height?: number;
  isLoading?: boolean;
}

const StyledBadge = styled(Badge, {
  shouldForwardProp: (prop) => prop !== 'online',
})<{
  online: boolean;
}>(({ theme, online }) => {
  const badgeStyles: CSSObject = {
    backgroundColor: online ? '#44b700' : theme.palette.grey[500],
    color: online ? '#44b700' : theme.palette.grey[500],
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  };

  if (online) {
    badgeStyles['&::after'] = {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    };
  }

  return {
    '& .MuiBadge-badge': badgeStyles,
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  };
});

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  const safeName = name?.trim();

  if (!safeName) {
    return {
      sx: { bgcolor: '#cccccc' },
      children: '?',
    };
  }

  const nameParts = safeName.split(' ');
  const firstInitial = nameParts[0]?.[0] || '';
  const secondInitial = nameParts[1]?.[0] || '';
  const initials = `${firstInitial}${secondInitial}`.toUpperCase();

  return {
    sx: {
      bgcolor: stringToColor(safeName),
    },
    children: initials || '?',
  };
}

const StatusAvatar: React.FC<StatusAvatarProps> = ({
  name,
  photoUrl,
  online = false,
  onAvatarClick,
  width = 56,
  height = 56,
  isLoading = false,
}) => {
  if (isLoading) return <Skeleton variant="circular" width={width} height={height} />;
  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant="dot"
      online={online}>
      <Avatar
        {...stringAvatar(name)}
        src={photoUrl}
        sx={{
          width,
          height,
          cursor: 'pointer',
          img: {
            width: '100%',
            height: '100%',
            imageRendering: 'smooth',
          },
        }}
        onClick={onAvatarClick}
      />
    </StyledBadge>
  );
};

export default StatusAvatar;
