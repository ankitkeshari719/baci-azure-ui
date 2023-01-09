import * as React from 'react';
import { Box } from '@mui/material';
import { CreateRetroWithTemplatePage } from './CreateRetroWithTemplatePage';
import { TopBar } from './TopBar';

export function CreateRetroMain() {
  return (
    <Box className='mainContainer'>
      <TopBar />
      <CreateRetroWithTemplatePage />
    </Box>
  );
}
