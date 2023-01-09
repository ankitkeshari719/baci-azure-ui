import * as React from 'react';
import { Button } from '@mui/material';
import './styles.scss';

type Props = {
  name: string;
  onClick: (...param: any) => void;
  style?: any;
};

export function OutlinedButton({ name, onClick, style }: Props) {
  return (
    <Button
      variant="outlined"
      className="outlinedButton"
      onClick={onClick}
      sx={{ ...style }}
    >
      {name}
    </Button>
  );
}
