import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label: string;
  onClick?: (...param: any) => void;
  style?: any;
};

export function H5RegularTypography({ label, onClick, style }: Props) {
  return (
    <Typography className="h5Regular" component="span" style={style}>
      {label}
    </Typography>
  );
}
