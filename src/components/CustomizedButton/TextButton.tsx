import React from 'react';
import { Button } from '@mui/material';
import { ButtonLabelTypography } from '../CustomizedTypography';

type Props = {
  id?: string;
  label: string;
  onClick: (...param: any) => void;
  style?: any;
  textStyle?: any;
  disabled?: boolean;
};

export const TextButton = ({
  label,
  onClick,
  style,
  textStyle,
  disabled,
  id,
}: Props) => {
  return (
    <Button variant="text" onClick={onClick}>
      <ButtonLabelTypography label={label} style={textStyle} />
    </Button>
  );
};
