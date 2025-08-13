import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { darken, lighten, styled } from '@mui/material';
import type { Theme } from '@mui/material/styles';

const GroupHeader = styled('div')(({ theme }: { theme: Theme }) => ({
  position: 'sticky',
  top: 0,
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? darken(theme.palette.primary.main, 0.8)
      : lighten(theme.palette.primary.light, 0.85),
  zIndex: 1,
}));

const GroupItems = styled('ul')({
  padding: 0,
  margin: 0,
  listStyle: 'none',
});

export interface RenderGroupOption {
  group: string;
  title: string;
  value: string;
}

interface RenderGroupProps {
  value?: RenderGroupOption | null;
  options: RenderGroupOption[];
  onChange: (value: string) => void;
  label: string;
}

export default function RenderGroup({ options, onChange, label, value = null }: RenderGroupProps) {
  return (
    <Autocomplete
      value={value}
      options={options}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => option.title}
      onChange={(_, value) => {
        if (value) onChange(value.value);
      }}
      sx={{ width: { sm: 300 } }}
      renderInput={(params) => <TextField {...params} label={label} />}
      renderGroup={(params) => (
        <li key={params.key}>
          <GroupHeader>{params.group}</GroupHeader>
          <GroupItems>{params.children}</GroupItems>
        </li>
      )}
    />
  );
}
