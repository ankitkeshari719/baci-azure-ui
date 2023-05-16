import * as React from 'react';
import shortid from 'shortid';
import './styles.scss';
import {
  Box,
  Button,
  Grid,
  SelectChangeEvent,
  styled,
  useMediaQuery,
} from '@mui/material';
import { BoardContext } from '../../contexts/BoardContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { ActionInterface } from '../../types';
import ActionsListFacilitator from './ActionsListFacilitator';

import ActionHeader from './ActionHeader';
import AddAction from './AddAction';
import ZeroActions from './ZeroActions';
import theme from '../../theme/theme';
import ActionsListParticipant from './ActionsListParticipant';
import { NONE, VALUE_ASC, VALUE_DSC, VOTES_ASC, VOTES_DSC } from './const';

export default function ActionMainContainer() {
  const {
    state: { actionsData, ended, users },
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
  const [sortedBy, setSortedBy] = React.useState<string>(NONE);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] =
    React.useState<boolean>(false);

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

  React.useEffect(() => {
    users.map(user => {
      if (user.userId === global.user.id) {
        if (user.feedback.length != 0) {
          setIsFeedbackSubmitted(true);
        }
      }
    });
  }, [users]);

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
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
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
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
    );
  };

  const addReactToAction = async (actionId: string, actionBy: string) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(BoardActionType.ADD_REACT_TO_ACTION, {
      actionId: actionId,
      react: '👍',
    }).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
    );
  };

  const removeReactFromAction = async (actionId: string) => {
    await saveAndProcessAction(BoardActionType.REMOVE_REACT_FROM_ACTION, {
      actionId,
      react: '👍',
    }).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
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

  // Sort Functionality
  const handleSortedByChange = (event: SelectChangeEvent) => {
    setSortedBy(event.target.value);
    switch (event.target.value) {
      case NONE:
        setAllActionsTemp(allActions);
        break;
      case VALUE_ASC:
        stringASCENDING();
        break;
      case VALUE_DSC:
        stringDESCENDING();
        break;
      case VOTES_ASC:
        numericASCENDING();
        break;
      case VOTES_DSC:
        numericDESCENDING();
        break;
    }
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
    setAllActionsTemp(strAscending);
  };

  const stringDESCENDING = () => {
    const strDescending = [...allActions].sort((a, b) =>
      a.value > b.value ? -1 : 1
    );
    setAllActionsTemp(strDescending);
  };

  const numericASCENDING = () => {
    const numAscending = [...allActions].sort(
      (a, b) => a.reacts?.length - b.reacts?.length
    );
    setAllActionsTemp(numAscending);
  };

  const numericDESCENDING = () => {
    const numDescending = [...allActions].sort(
      (a, b) => b.reacts?.length - a.reacts?.length
    );
    setAllActionsTemp(numDescending);
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
        searchQuery={searchQuery}
        sortedBy={sortedBy}
        handleSearchQueryOnChange={handleSearchQueryOnChange}
        handleSortedByChange={handleSortedByChange}
      />
      {!ended && (
        <>
          {global.user.userType == 2 && (
            <AddAction
              addAction={addAction}
              addedActionValue={addedActionValue}
              setAddActionValue={setAddActionValue}
              isTextFieldFocused={isTextFieldFocused}
              setIsTextFieldFocused={setIsTextFieldFocused}
            />
          )}
          {global.user.userType == 1 && !isFeedbackSubmitted && (
            <AddAction
              addAction={addAction}
              addedActionValue={addedActionValue}
              setAddActionValue={setAddActionValue}
              isTextFieldFocused={isTextFieldFocused}
              setIsTextFieldFocused={setIsTextFieldFocused}
            />
          )}
        </>
      )}

      {allActions.length > 0 ? (
        <>
          {global.user.userType == 2 ? (
            <ActionsListFacilitator
              allActions={allActionsTemp}
              handleToggleAction={handleToggleAction}
              addReactToAction={addReactToAction}
              isFeedbackSubmitted={isFeedbackSubmitted}
              removeReactFromAction={removeReactFromAction}
            />
          ) : (
            <ActionsListParticipant
              currentUserActions={currentUserActions}
              othersUserActions={othersUserActions}
              handleToggleAction={handleToggleAction}
              addReactToAction={addReactToAction}
              ended={ended}
              isFeedbackSubmitted={isFeedbackSubmitted}
              removeReactFromAction={removeReactFromAction}
            />
          )}
        </>
      ) : (
        <ZeroActions height="var(--app-height)" />
      )}
    </Box>
  );
}
