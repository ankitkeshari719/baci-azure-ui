import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label: string;
  onClick: (...param: any) => void;
  style?: any;
};

export function H4SemiBoldTypography({ label, onClick, style }: Props) {
  return (
    <Typography className="h4SemiBold" component="span">
      {label}
    </Typography>
  );
}
