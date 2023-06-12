import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label: string;
  onClick: (...param: any) => void;
  style?: any;
};

export function H2SemiBoldTypography({ label, onClick, style }: Props) {
  return (
    <Typography className="h2SemiBold" component="span">
      {label}
    </Typography>
  );
}
