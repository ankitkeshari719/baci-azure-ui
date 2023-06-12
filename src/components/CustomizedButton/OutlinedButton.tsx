import * as React from 'react';
import { Button, Typography } from '@mui/material';
import './styles.scss';
import { ButtonLabelTypography } from '../CustomizedTypography';

type Props = {
  id?: string;
  label: string;
  onClick: (...param: any) => void;
  style?: any;
  textStyle?: any;
};

export function OutlinedButton({
  id,
  label,
  onClick,
  style,
  textStyle,
}: Props) {
  return (
    <Button
      id={id}
      variant="outlined"
      className="outlinedButton"
      onClick={onClick}
      sx={{ ...style }}
    >
      <ButtonLabelTypography label={label} style={textStyle} />
    </Button>
  );
}
