import * as React from 'react';
import { Button } from '@mui/material';
import './styles.scss';
import { ButtonLabelTypography } from '../CustomizedTypography';

type Props = {
  id?: string;
  label: string;
  size: any;
  onClick: (...param: any) => void;
  style?: any;
  disabled?: boolean;
};

export function OutlinedButton({
  id,
  label,
  size,
  onClick,
  style,
  disabled,
}: Props) {
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
      <ButtonLabelTypography
        label={label}
        style={{
          ':hover': { color: '#CCCCCC !important' },
          color: '#159ADD',
          fontSize: size === 'small' ? '14px !important' : '16px !important',
        }}
      />
    </Button>
  );
}
