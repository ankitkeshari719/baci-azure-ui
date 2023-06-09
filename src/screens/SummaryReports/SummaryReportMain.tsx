import React from 'react';
import { Box } from '@mui/material';
import './styles.scss';

import Toolbar from '../../components/Elements/Toolbar';
import { ReportSummary } from './ReportSummary';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import useReRoute from '../../helpers/hooks/useReRoute';
import useLoadRetro from '../../helpers/hooks/useLoadRetro';

export default function SummaryReportMain() {
  const componentRef = React.createRef<HTMLDivElement>();
  
  // Re-Routing rules added
  useReRoute();

  useLoadRetro();

  return (
    <Box className="mainContainer">
      <DeploymentPopUp />
      <Toolbar />
      <ReportSummary ref={componentRef} />
    </Box>
  );
}
