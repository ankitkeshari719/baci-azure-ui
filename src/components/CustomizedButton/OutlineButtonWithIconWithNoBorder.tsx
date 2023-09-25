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
          <Box component="span" marginRight="10px">
            {label}
          </Box>
          {iconPath && <img src={iconPath} />}
        </Button>
      ) : (
        <Button
          variant="text"
          className="buttonWithIconWithNoBorder"
          onClick={onClick}
          disabled={disabled}
          sx={{ ...style }}
        >
          <Box component="span" marginRight="10px">
            {label}
          </Box>
          {iconPath && <img src={iconPath} />}
        </Button>
      )}
    </>
  );
};

export default OutlineButtonWithIconWithNoBorder;
