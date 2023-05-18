import * as React from 'react';
import './styles.scss';

import { Box } from '@mui/material';
import { Typography } from '@material-ui/core';

type Props = {
  height: string;
  zeroActionText_One: string;
  zeroActionText_Two: string;
};

export default function ZeroActions({
  height,
  zeroActionText_One,
  zeroActionText_Two,
}: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        height: { height },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {zeroActionText_One.length > 0 && (
        <Typography component="div" className="zeroActionTextOne">
          {zeroActionText_One}
        </Typography>
      )}
      <Typography className="zeroActionTextTwo">
        {zeroActionText_Two}
      </Typography>
    </Box>
  );
}
