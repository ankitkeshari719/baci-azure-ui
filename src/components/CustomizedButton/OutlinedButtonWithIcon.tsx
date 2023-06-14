import React from 'react';
import { Box, Button } from '@mui/material';
import './styles.scss';
import { ButtonLabelTypography } from '../CustomizedTypography';

export const OutlinedButtonWithIcon = ({
  label,
  iconPath,
  color,
  onClick,
  id,
  disabled,
  style,
  textStyle
}: {
  label: string;
  iconPath?: string;
  color?: string;
  onClick?: (...param: any) => void;
  id?: string;
  disabled: boolean;
  style?: any;
  textStyle?: any;
}) => {
  return (
    <Button
      variant="outlined"
      className="buttonWithIcon"
      onClick={onClick}
      disabled={disabled}
      sx={{ ...style }}
    >
      {iconPath && <img src={iconPath} />}
      <ButtonLabelTypography label={label} style={textStyle} />
    </Button>
  );
};
