import React from 'react';
import { BoardContext } from '../contexts/BoardContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
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
    state: { retroId, retroStarted, retroDuration },
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
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    saveAndProcessAction(BoardActionType.START_RETRO, {creatorId:global.currentRetro?.creatorId,retroDuration:60}).then(() => {
      console.log('started retro');
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: false },
      });
      // navigate(`/board/${retroId}/pulsecheck`);
    });
  };

  React.useEffect(() => {
    console.log(retroStarted,"start retro button");

    if (retroStarted) {
      navigate(`/board/${retroId}/pulsecheck`);
    }
  }, [retroStarted]);
  return (
    <>
      {global?.currentRetro?.creatorId === global?.user?.id && (
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
