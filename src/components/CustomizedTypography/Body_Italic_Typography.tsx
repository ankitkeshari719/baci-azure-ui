import * as React from 'react';
import { Typography } from '@mui/material';
import './styles.scss';

type Props = {
  label: string;
  onClick: (...param: any) => void;
  style?: any;
};

export function BodyItalicTypography({ label, onClick, style }: Props) {
  return (
    <Typography className="bodyItalic" component="span">
      {label}
    </Typography>
  );
}
