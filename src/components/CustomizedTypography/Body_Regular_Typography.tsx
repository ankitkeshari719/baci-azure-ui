import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label: string | undefined;
  onClick?: (...param: any) => void;
  style?: any;
};

export function BodyRegularTypography({ label, onClick, style }: Props) {
  return (
    <Typography
      className="bodyRegular"
      component="span"
      sx={{ ...style }}
      onClick={onClick}
    >
      {label}
    </Typography>
  );
}
