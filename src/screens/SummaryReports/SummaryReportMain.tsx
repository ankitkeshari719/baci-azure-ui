import React from 'react';
import { Box } from '@mui/material';
import './styles.scss';

import Toolbar from '../../elements/Toolbar';
import { ReportSummary } from './ReportSummary';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import useReRoute from '../../hooks/useReRoute';

export default function SummaryReportMain() {
  const componentRef = React.createRef<HTMLDivElement>();
  
  // Re-Routing rules added
  useReRoute();

  return (
    <Box className="mainContainer">
      <DeploymentPopUp />
      <Toolbar />
      <ReportSummary ref={componentRef} />
    </Box>
  );
}
