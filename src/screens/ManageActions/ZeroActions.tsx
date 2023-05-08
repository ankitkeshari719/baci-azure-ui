import * as React from 'react';
import './styles.scss';

import { Box } from '@mui/material';
import { Typography } from '@material-ui/core';

export default function ZeroActions() {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'var(--app-height)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'column'
      }}
    >
      <Typography component="div" className="zeroActionTextOne">
        Actions Speak!
      </Typography>
      <Typography  className="zeroActionTextTwo">
        Add them here...
      </Typography>
    </Box>
  );
}
