import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  name: string;
  onClick: (...param: any) => void;
  style?: any;
};

export function H1_SemiBold_Typography({ name, onClick, style }: Props) {
  return (
    <Typography className="saveButtonText" component="span">
      {name}
    </Typography>
  );
}
