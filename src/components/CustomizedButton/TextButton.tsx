import React from 'react';
import { Button } from '@mui/material';
import { ButtonLabelTypography } from '../CustomizedTypography';

type Props = {
  id?: string;
  label: string;
  size: any;
  onClick: (...param: any) => void;
  style?: any;
  disabled?: boolean;
};

export const TextButton = ({
  id,
  label,
  size,
  onClick,
  style,
  disabled,
}: Props) => {
  return (
    <Button
      id={id}
      variant="text"
      size={size}
      onClick={onClick}
      className={
        size === 'small'
          ? 'textButtonSmall'
          : size === 'medium'
          ? 'textButtonMedium'
          : 'textButtonLarge'
      }
      sx={{ ...style }}
      disabled={disabled}
    >
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
