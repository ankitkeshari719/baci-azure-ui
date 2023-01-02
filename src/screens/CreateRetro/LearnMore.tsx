import * as React from 'react';
import { Box, Grid } from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { TopBar } from './TopBar';

export function LearnMore() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <TopBar />
      <Box component="main" className="retroContainer">
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
              About Template
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              This is a for classic template retros.
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              It’s straight to the point to reflect on the team’s performance.
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
