import React from 'react';
import { Button } from '@mui/material';

export const TextButton = ({
  label,
  onClick,
  style,
  disabled,
  id,
}: {
  label: string;
  onClick: (...param: any) => void;
  style?: any;
  disabled?: boolean;
  id?: string;
}) => {
  return (
    <Button variant="text" onClick={onClick}>
      {label}
    </Button>
  );
};
