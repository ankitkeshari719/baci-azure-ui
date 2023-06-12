import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label: string;
  onClick: (...param: any) => void;
  style?: any;
};

export function H3RegularTypography({ label, onClick, style }: Props) {
  return (
    <Typography className="h3Regular" component="span">
      {label}
    </Typography>
  );
}
