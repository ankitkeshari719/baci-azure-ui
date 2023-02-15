import React from 'react';
import { Box } from '@mui/material';
import './styles.scss';

import Toolbar from '../../elements/Toolbar';
import { ReportSummary } from './ReportSummary';

export default function SummaryReportMain() {
  const componentRef = React.createRef<HTMLDivElement>();

  return (
    <Box className="mainContainer">
      <Toolbar />
      <ReportSummary ref={componentRef}  />
    </Box>
  );
}
