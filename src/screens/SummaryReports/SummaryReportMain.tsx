import React from 'react';
import { Box } from '@mui/material';
import './styles.scss';

import { SummaryReport } from './SummaryReport';
import Toolbar from '../../elements/Toolbar';

export default function SummaryReportMain() {
  const componentRef = React.createRef<HTMLDivElement>();

  return (
    <Box className="mainContainer">
      <Toolbar />
      <SummaryReport ref={componentRef} />
    </Box>
  );
}
