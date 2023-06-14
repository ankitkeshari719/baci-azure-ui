import * as React from 'react';
import { Button, Typography } from '@mui/material';
import './styles.scss';
import { ButtonLabelTypography } from '../CustomizedTypography';

type Props = {
  id?: string;
  name: string;
  onClick: (...param: any) => void;
  style?: any;
  disabled?: boolean;
  textStyle?: any;
};

export function ContainedButton({
  id,
  name,
  onClick,
  style,
  disabled,
  textStyle,
}: Props) {
  return (
    <Button
      id={id}
      variant="contained"
      className="containedButton"
      onClick={onClick}
      sx={{ ...style }}
      disabled={disabled}
    >
      <ButtonLabelTypography label={name} style={textStyle} />
    </Button>
  );
}
