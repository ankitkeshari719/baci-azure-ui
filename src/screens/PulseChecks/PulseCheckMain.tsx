import * as React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import SimplePulseCheck from './SimplePulseCheck';
import BusinessAgility from './BusinessAgility';
import Toolbar from '../../elements/Toolbar';

export default function PulseCheckMain() {
  const navigate = useNavigate();
  const [{ currentRetro }] = React.useContext(GlobalContext);
  const {
    state: { retroId, pulseCheck },
  } = React.useContext(BoardContext);

  React.useEffect(() => {
    if (pulseCheck && pulseCheck.id === 'pulse_check_not_req') {
      navigate(`/board/${retroId || currentRetro?.id}`);
    }
  }, []);

  return (
    <Box className="mainContainer">
      <Toolbar />
      {pulseCheck && pulseCheck.id === 'simple' && <SimplePulseCheck />}
      {pulseCheck && pulseCheck.id === 'business_agility' && (
        <BusinessAgility />
      )}
    </Box>
  );
}
