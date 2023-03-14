import React from 'react';
import { Box } from '@mui/material';
import './styles.scss';

import Toolbar from '../../elements/Toolbar';
import { ReportSummary } from './ReportSummary';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';

export default function SummaryReportMain() {
  const componentRef = React.createRef<HTMLDivElement>();

  return (
    <Box className="mainContainer">
      {/* <DeploymentPopUp /> */}
      <Toolbar />
      <ReportSummary ref={componentRef}  />
    </Box>
  );
}
