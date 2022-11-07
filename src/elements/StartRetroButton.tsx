import React from 'react';
import { BoardContext } from '../contexts/BoardContext';
import { GlobalContext } from '../contexts/GlobalContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import shortid from 'shortid';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const styles = {
  goToRetroBtn: {
    height: '44px',
    marginTop: '44px',
  },
};
const StartRetroButton = () => {
  const {
    state: { retroId, retroStarted, retroDuration, creatorId },
    commitAction,
  } = React.useContext(BoardContext);
  const navigate = useNavigate();

  const [global, dispatch] = React.useContext(GlobalContext);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const startRetro = () => {
    saveAndProcessAction(BoardActionType.START_RETRO, {}).then(() => {
      console.log('started retro');
    });
  };

  React.useEffect(() => {
    // console.log(needsToShow);
    console.log(
      retroStarted,
      'retroStarted',
      creatorId,
      global.user.id,
      creatorId === global.user.id
    );

    if (retroStarted) {
      navigate(`/board/${retroId}/pulsecheck`);
    }
  }, [retroStarted]);
  return (
    <>
      {creatorId === global.user.id && (
        // <button onClick={startRetro}>Start</button>
        <Button
          variant="outlined"
          className="secondaryButton"
          style={styles.goToRetroBtn}
          onClick={() => startRetro()}
        >
          <span className="secondaryButtonText">Start retro</span>
        </Button>
      )}
    </>
  );
};

export default StartRetroButton;
