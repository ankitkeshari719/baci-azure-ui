import * as React from 'react';
import { Button, Typography } from '@mui/material';
import './styles.scss';

type Props = {
  name: string;
  onClick: (...param: any) => void;
  style?: any;
  disabled?: boolean;
  id?: string;
};

export function ContainedButton({ id, name, onClick, style, disabled }: Props) {
  return (
    <Button
    id= {id}
      variant="contained"
      className="containedButton"
      onClick={onClick}
      sx={{ ...style }}
      disabled={disabled}
    >
      <Typography className="saveButtonText" component="span">
        {name}
      </Typography>
    </Button>
  );
}
