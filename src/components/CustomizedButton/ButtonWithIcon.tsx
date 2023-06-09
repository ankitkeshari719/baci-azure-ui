import React from 'react';
import { Box, Button } from '@mui/material';
import './styles.scss';

export const ButtonWithIcon = ({
  label,
  iconPath,
  color,
  onClick,
  id,
  disabled,
  style,
}: {
  label: string;
  iconPath?: string;
  color?: string;
  onClick?: (...param: any) => void;
  id?: string;
  disabled: boolean;
  style?: any;
}) => {
  return (
    <Button
      variant="outlined"
      className="buttonWithIcon"
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {iconPath && <img src={iconPath} />}
      <Box component="span">{label}</Box>
    </Button>
  );
};
