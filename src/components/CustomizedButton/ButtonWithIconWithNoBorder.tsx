import React from 'react';
import { Box, Button } from '@mui/material';

const ButtonWithIconWithNoBorder = ({
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
  disabled: boolean;
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
          style={style}
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
          style={style}
          //   color={style && style.color == 'red!important' && 'error'}
          //    color= {$PrimaryMain}
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

export default ButtonWithIconWithNoBorder;
