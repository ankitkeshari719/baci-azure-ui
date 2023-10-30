import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContainedButton } from '../../components';
import { BoardContext } from '../../contexts/BoardContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { getRetro } from '../../helpers/msal/services';
import { BoardActionType } from '../../helpers/statemachine/BoardStateMachine';
import { TimeInputDialog } from './TimeInputDialog';
import { UserContext } from '../../contexts/UserContext';

export function StartRetroWithTemplate() {
  const navigate = useNavigate();
  const {
    state: { retroId, retroStarted },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);

  const [isTimeInputDialog, setIsTimeInputDialog] =
    React.useState<boolean>(false);
  const [selectedValue, setSelectedValue] = React.useState(60);
  const [gUser, userDispatch] = React.useContext(UserContext);

  React.useEffect(() => {
    console.log('Retro is starting::::::::::::::::::::');
    if (retroStarted && retroId != undefined && retroId != '') {
      if (
        gUser.azureUser != undefined &&
        gUser.azureUser.emailId != undefined &&
        gUser.azureUser.emailId != ''
      ) {
        navigate(
          `/enterprise/sessions/board/${
            retroId || global.currentRetro?.id
          }/pulsecheck`
        );
      } else if (gUser.azureUser?.emailId != undefined)
        navigate(`/board/${retroId || global.currentRetro?.id}/pulsecheck`);
    }
  }, [retroStarted]);

  const handleClickOpen = () => {
    setIsTimeInputDialog(true);
  };

  const handleClose = (value: any) => {
    setIsTimeInputDialog(false);
  };

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

  const handleSubmit = (value: any) => {
    setIsTimeInputDialog(false);
    setSelectedValue(value);
    startRetro(value);
  };

  return (
    <>
      <ContainedButton
        name="Start Retro"
        onClick={handleClickOpen}
        style={{
          mt: 5,
          minWidth: '140px !important',
          height: '36px !important',
        }}
        size={'medium'}
      />
      <TimeInputDialog
        selectedValue={selectedValue}
        isTimeInputDialog={isTimeInputDialog}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
}
