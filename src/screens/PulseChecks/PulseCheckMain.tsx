import * as React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import SimplePulseCheck from './SimplePulseCheck';
import BusinessAgility from './BusinessAgility';
import PulseCheckTopbar from './PulseCheckTopbar';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import theme from '../../theme/theme';
import useReRoute from '../../hooks/useReRoute';
import useLoadRetro from '../../hooks/useLoadRetro';

export default function PulseCheckMain() {
  const navigate = useNavigate();
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [{ currentRetro }] = React.useContext(GlobalContext);
  const {
    state: { retroId, pulseCheck },
  } = React.useContext(BoardContext);

  // Re-Routing rules added
  useReRoute();

  // Load the retro data
  useLoadRetro();

  React.useEffect(() => {
    if (pulseCheck && pulseCheck.id === 'pulse_check_not_req') {
      navigate(`/board/${retroId || currentRetro?.id}`);
    }
  }, []);

  return (
    <Box
      className="mainContainer"
      sx={{
        overflowY: isXsUp ? 'scroll' : 'auto',
      }}
    >
      <DeploymentPopUp />
      <PulseCheckTopbar />
      {pulseCheck && pulseCheck.id === 'simple' && (
        <SimplePulseCheck pulseCheck={pulseCheck} />
      )}
      {pulseCheck && pulseCheck.id === 'business_agility' && (
        <BusinessAgility pulseCheck={pulseCheck} />
      )}
    </Box>
  );
}
