import * as React from 'react';
import shortid from 'shortid';
import './styles.scss';
import { Box, Grid, styled, useMediaQuery } from '@mui/material';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { ActionInterface } from '../../types';
import ActionsListFacilitator from './ActionsListFacilitator';

import ActionHeader from './ActionHeader';
import AddAction from './AddAction';
import ZeroActions from './ZeroActions';
import theme from '../../theme/theme';
import ActionsListParticipant from './ActionsListParticipant';

export default function ActionMainContainer() {
  const {
    state: { actionsData },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [allActions, setAllActions] = React.useState<ActionInterface[]>([]);
  const [allActionsTemp, setAllActionsTemp] = React.useState<ActionInterface[]>(
    []
  );
  const [addedActionValue, setAddActionValue] = React.useState<string>('');
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [isTextFieldFocused, setIsTextFieldFocused] =
    React.useState<boolean>(false);
  const [currentUserActions, setCurrentUserActions] = React.useState<
    ActionInterface[]
  >([]);
  const [othersUserActions, setOthersUserActions] = React.useState<
    ActionInterface[]
  >([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  React.useEffect(() => {
    let tempActions = actionsData.actions.map(action => {
      action.checked = false;
      return action;
    });
    setAllActions([...tempActions]);
    setAllActionsTemp([...tempActions]);
  }, [actionsData]);

  React.useEffect(() => {
    const tempCurrentUserActions = allActions.filter(
      action => action.createdBy === global.user.id
    );

    const tempOthersUserActions = allActions.filter(
      action => action.createdBy != global.user.id
    );
    setCurrentUserActions([...tempCurrentUserActions]);
    setOthersUserActions([...tempOthersUserActions]);
  }, [allActions]);

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

  // Search Functionality
  const handleSearchQueryOnChange = (value: string) => {
    const results = [...allActions].filter(action => {
      if (value === '') return [...allActions];
      return action.value.toLowerCase().includes(value.toLowerCase());
    });
    
    const tempCurrentUserActions = results.filter(
      action => action.createdBy === global.user.id
    );

    const tempOthersUserActions = results.filter(
      action => action.createdBy != global.user.id
    );

    setSearchQuery(value);
    setAllActionsTemp(results);
    setCurrentUserActions([...tempCurrentUserActions]);
    setOthersUserActions([...tempOthersUserActions]);
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

  const stringASCENDING = () => {
    const strAscending = [...allActions].sort((a, b) =>
      a.value > b.value ? 1 : -1
    );
    setAllActions(strAscending);
    console.log(strAscending);
  };

  const stringDESCENDING = () => {
    const strDescending = [...allActions].sort((a, b) =>
      a.value > b.value ? -1 : 1
    );
    setAllActions(strDescending);
  };

  // const numericASCENDING = () => {
  //   const numAscending = [...allActions].sort(
  //     (a, b) => a.total_voted - b.total_voted
  //   );
  //   setAllActions(numAscending);
  // };

  // const numericDESCENDING = () => {
  //   const numDescending = [...allActions].sort(
  //     (a, b) => b.total_voted - a.total_voted
  //   );
  //   setAllActions(numDescending);
  // };

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
        searchQuery={searchQuery}
        handleSearchQueryOnChange={handleSearchQueryOnChange}
      />
      <AddAction
        addAction={addAction}
        addedActionValue={addedActionValue}
        setAddActionValue={setAddActionValue}
        isTextFieldFocused={isTextFieldFocused}
        setIsTextFieldFocused={setIsTextFieldFocused}
      />
      {allActions.length > 0 ? (
        <>
          {global.user.userType == 2 ? (
            <ActionsListFacilitator
              allActions={allActionsTemp}
              handleToggleAction={handleToggleAction}
            />
          ) : (
            <ActionsListParticipant
              currentUserActions={currentUserActions}
              othersUserActions={othersUserActions}
              handleToggleAction={handleToggleAction}
            />
          )}
        </>
      ) : (
        <ZeroActions />
      )}
    </Box>
  );
}
