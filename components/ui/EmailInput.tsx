'use client';

import { useState } from 'react';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  Select,
  SelectChangeEvent,
  IconButton,
  Tooltip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useUpdateEmail } from '@/hooks/user/useUpdateEmail';

const emailProviders = ['yandex.ru', 'eriskip.ru'];

interface IEmailInputProps {
  email: string;
  userId: string;
}

const parseEmail = (value?: string) => {
  if (!value) return { localPart: '', domain: '' };
  const [localPart, domain] = value.split('@');
  return { localPart: localPart || '', domain: domain || '' };
};

const EmailInput = ({ email = '', userId }: IEmailInputProps) => {
  const { localPart: initLocal, domain: initDomain } = parseEmail(email);

  const [localPart, setLocalPart] = useState(initLocal);
  const [domain, setDomain] = useState(initDomain);

  const updateEmail = useUpdateEmail();

  const handleEmailChange = async () => {
    if (!localPart || !domain) return;

    const newEmail = `${localPart}@${domain}`;

    if (newEmail) {
      await updateEmail.mutateAsync({ userId, email: newEmail, emailConfirmed: true });
    }
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setLocalPart(newVal);
  };

  const handleDomainChange = (e: SelectChangeEvent) => {
    const newVal = e.target.value;
    setDomain(newVal);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');

    const { localPart: pLocal, domain: pDomain } = parseEmail(pasted);
    setLocalPart(pLocal);
    setDomain(pDomain);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* username */}
      <TextField
        label="Почта"
        value={localPart}
        onChange={handleLocalChange}
        onPaste={handlePaste}
        size="small"
        sx={{ maxWidth: 150 }}
      />

      <Typography>@</Typography>

      {/* domain */}
      <Select value={domain} onChange={handleDomainChange} size="small" sx={{ maxWidth: 150 }}>
        {[...new Set([...emailProviders, domain].filter(Boolean))].map((prov) => (
          <MenuItem key={prov} value={prov}>
            {prov}
          </MenuItem>
        ))}
      </Select>

      <Tooltip title="Поменять почту">
        <IconButton
          loading={updateEmail.isPending}
          disabled={!Boolean(localPart) || !Boolean(domain)}
          color="success"
          onClick={handleEmailChange}
          aria-label="d">
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default EmailInput;
