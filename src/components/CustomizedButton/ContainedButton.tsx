import * as React from 'react';
import { Button } from '@mui/material';
import './styles.scss';
import { ButtonLabelTypography } from '../CustomizedTypography';

type Props = {
  id?: string;
  name: string;
  size: any;
  onClick: (...param: any) => void;
  style?: any;
  disabled?: boolean;
};

export function ContainedButton({
  size,
  id,
  name,
  onClick,
  style,
  disabled,
}: Props) {
  return (
    <Button
      size={size}
      id={id}
      variant="contained"
      className={
        size === 'small'
          ? 'containedButtonSmall'
          : size === 'medium'
          ? 'containedButtonMedium'
          : 'containedButtonLarge'
      }
      onClick={onClick}
      sx={{ ...style }}
      disabled={disabled}
    >
      <ButtonLabelTypography
        label={name}
        style={{
          color: '#FFFFFF',
          fontSize: size === 'small' ? '14px !important' : '16px !important',
        }}
      />
    </Button>
  );
}
