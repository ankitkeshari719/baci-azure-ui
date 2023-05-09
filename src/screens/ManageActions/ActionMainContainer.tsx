import * as React from 'react';
import shortid from 'shortid';
import './styles.scss';
import { Box, Grid, styled, useMediaQuery } from '@mui/material';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { ActionInterface } from '../../types';
import ActionsList from './ActionsList';

import ActionHeader from './ActionHeader';
import AddAction from './AddAction';
import ZeroActions from './ZeroActions';
import theme from '../../theme/theme';

export default function ActionMainContainer() {
  const {
    state: { actionsData },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [allActions, setAllActions] = React.useState<ActionInterface[]>([]);
  const [addedActionValue, setAddActionValue] = React.useState<string>('');
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [isTextFieldFocused, setIsTextFieldFocused] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    let tempActions = actionsData.actions.map(action => {
      action.checked = false;
      return action;
    });
    setAllActions([...tempActions]);
  }, [actionsData]);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  // Function to call API on adding the new action
  const addAction = async (value: string) => {
    const id = shortid.generate();
    await saveAndProcessAction(BoardActionType.Add_NEW_ACTION, {
      id: id,
      value: value,
      createdBy: global.user.id,
      assigneeId: '',
      assigneeName: '',
      assigneeAvatar: '',
    }).then(
      res => {
        setAddActionValue('');
        setIsTextFieldFocused(false);
      },
      err => {}
    );
  };

  // Check/Uncheck the action item
  const handleToggleAction = (actionId: string) => {
    const newAction = actionsData.actions.map(action => {
      if (action.id === actionId) {
        return { ...action, checked: !action.checked };
      }
      return action;
    });
    setAllActions([...newAction]);
  };

  return (
    <Box
      className="actionsContainer"
      sx={{
        height: false
          ? 'auto'
          : isXsUp
          ? 'calc(var(--app-height) - 115px)'
          : 'calc(var(--app-height) - 160px)',
      }}
    >
      <ActionHeader
        global={global}
        allActions={allActions}
        dispatch={dispatch}
      />
      <AddAction
        addAction={addAction}
        addedActionValue={addedActionValue}
        setAddActionValue={setAddActionValue}
        isTextFieldFocused={isTextFieldFocused}
        setIsTextFieldFocused={setIsTextFieldFocused}
      />
      {allActions.length > 0 ? (
        <ActionsList
          allActions={allActions}
          handleToggleAction={handleToggleAction}
        />
      ) : (
        <ZeroActions />
      )}
    </Box>
  );
}
