import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label:  string | undefined;
  onClick?: (...param: any) => void;
  style?: any;
};

export function TinyTextTypography({ label, onClick, style }: Props) {
  return (
    <Typography className="tinyText" component="span" sx={{ ...style }} onClick={onClick}>
      {label}
    </Typography>
  );
}
