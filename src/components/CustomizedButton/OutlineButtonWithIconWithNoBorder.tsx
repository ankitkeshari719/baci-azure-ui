import React from 'react';
import { Box, Button } from '@mui/material';

const OutlineButtonWithIconWithNoBorder = ({
  label,
  iconPath,
  color,
  onClick,
  id,
  disabled,
  style,
  error,
}: {
  label: string;
  iconPath?: string;
  color?: string;
  onClick?: (...param: any) => void;
  id?: string;
  disabled?: boolean;
  style?: any;
  error?: boolean;
}) => {
  return (
    <>
      {error && error ? (
        <Button
          variant="text"
          className="buttonWithIconWithNoBorder"
          onClick={onClick}
          disabled={disabled}
          sx={{ ...style }}
          color="error"
        >
          {iconPath && <img src={iconPath} />}
          <Box component="span" marginLeft="10px">
            {label}
          </Box>
        </Button>
      ) : (
        <Button
          variant="text"
          className="buttonWithIconWithNoBorder"
          onClick={onClick}
          disabled={disabled}
          sx={{ ...style }}
        >
          {iconPath && <img src={iconPath} />}
          <Box component="span" marginLeft="10px">
            {label}
          </Box>
        </Button>
      )}
    </>
  );
};

export default OutlineButtonWithIconWithNoBorder;
