import React from 'react';
import { Box, Button } from '@mui/material';
import './styles.scss';
import { ButtonLabelTypography } from '../CustomizedTypography';

type Props = {
  id?: string;
  label: string;
  size: any;
  iconPath?: string;
  onClick: (...param: any) => void;
  style?: any;
  disabled?: boolean;
};

export const OutlinedButtonWithIcon = ({
  id,
  label,
  size,
  iconPath,
  onClick,
  style,
  disabled,
}: Props) => {
  return (
    <Button
      id={id}
      size={size}
      variant="outlined"
      className={
        size === 'small'
          ? 'outlinedButtonSmall'
          : size === 'medium'
          ? 'outlinedButtonMedium'
          : 'outlinedButtonLarge'
      }
      onClick={onClick}
      sx={{ ...style }}
      disabled={disabled}
    >
      {iconPath && <img src={iconPath} />}
      <ButtonLabelTypography
        label={label}
        style={{
          color: '#159ADD',
          fontSize: size === 'small' ? '14px !important' : '16px !important',
        }}
      />
    </Button>
  );
};
