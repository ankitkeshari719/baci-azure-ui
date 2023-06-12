import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label: string;
  onClick: (...param: any) => void;
  style?: any;
};

export function H5SemiBoldTypography({ label, onClick, style }: Props) {
  return (
    <Typography className="h5SemiBold" component="span">
      {label}
    </Typography>
  );
}
