import React from 'react';
import { Button } from '@mui/material';
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

export const ContainedButtonWithIcon = ({
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
      {iconPath && <img src={iconPath} />}
      <ButtonLabelTypography
        label={label}
        style={{
          ':disabled': { color: '#FFFFFF !important' },
          color: '#FFFFFF',
          fontSize: size === 'small' ? '14px !important' : '16px !important',
        }}
      />
    </Button>
  );
};
