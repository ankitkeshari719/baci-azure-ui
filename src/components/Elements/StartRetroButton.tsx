import React from 'react';
import { BoardContext } from '../../contexts/BoardContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { BoardActionType } from '../../helpers/statemachine/BoardStateMachine';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRetro } from '../../helpers/msal/services';
import RetroTimeInputDialog from '../atoms/RetroTimeInputDialog';
import { UserContext } from '../../contexts/UserContext';
import { ENTERPRISE } from '../../constants/applicationConst';

const styles = {
  goToRetroBtn: {
    height: '44px',
    marginTop: '44px',
  },
};

// This component is not in used
const StartRetroButton = () => {
  const {
    state: { retroId, retroStarted,retroStatus },
    commitAction,
  } = React.useContext(BoardContext);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(60);
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const [gUser, userDispatch] = React.useContext(UserContext);
  React.useEffect(() => {
    if ((retroStarted||retroStatus=="started") && retroId != undefined && retroId != '') {
      if (
        gUser.azureUser != undefined &&
        gUser.azureUser.emailId != undefined &&
        gUser.azureUser.emailId != ''
      ) {
        if(gUser.azureUser?.roleName===ENTERPRISE)
        navigate(
          `/enterprise/sessions/board/${
            retroId || global.currentRetro?.id
          }/pulsecheck`
        );
        else{
          navigate(
            `/basic/sessions/board/${
              retroId || global.currentRetro?.id
            }/pulsecheck`
          );
        }
      } else if (gUser.azureUser?.emailId != undefined)
        navigate(`/board/${retroId || global.currentRetro?.id}/pulsecheck`);
    }
  }, [retroStarted, retroStatus]);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const startRetro = (duration: number) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
      retroStatus: 'started',
      creatorId: global.currentRetro?.creatorId,
      userId: global.user?.id,
    }).then(async () => {
      if (global.currentRetro?.id) {
        const retrievedRetro = await getRetro(global.currentRetro.id);
        dispatch({
          type: ActionType.SET_CURRENT_RETRO,
          payload: { retro: retrievedRetro },
        });
      }

      saveAndProcessAction(BoardActionType.START_RETRO, {
        creatorId: global.currentRetro?.creatorId,
        retroDuration: duration,
      }).then(
        () => {
          

          navigate( '/enterprise/sessions/board/' +
          global.currentRetro?.id +
          '/pulseCheck')
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        },
        () => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        }
      );
    });
  };

  const handleClose = (value: any) => {
    setOpen(false);
  };

  const handleSubmit = (value: any) => {
    setOpen(false);
    setSelectedValue(value);
    startRetro(value);
  };

  return (
    <>
      {(global?.currentRetro?.creatorId === global?.user?.id ||
        global?.currentRetro?.selectedFacilitator === global?.user?.id) && (
        <>
          <Button
            variant="outlined"
            className="secondaryButton"
            style={styles.goToRetroBtn}
            onClick={() => setOpen(true)}
          >
            <span className="secondaryButtonText">Start retro</span>
          </Button>
          <RetroTimeInputDialog
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />
        </>
      )}
    </>
  );
};

export default StartRetroButton;
