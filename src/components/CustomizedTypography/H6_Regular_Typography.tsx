import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label:  string | undefined;
  onClick?: (...param: any) => void;
  style?: any;
};

export function H6RegularTypography({ label, onClick, style }: Props) {
  return (
    <Typography className="h6Regular" component="span" sx={{ ...style }}>
      {label}
    </Typography>
  );
}
