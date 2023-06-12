import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label: string;
  onClick: (...param: any) => void;
  style?: any;
};

export function H1RegularTypography({ label, onClick, style }: Props) {
  return (
    <Typography className="h1Regular" component="span">
      {label}
    </Typography>
  );
}
