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
import { ActionInterface, DyanamicDialog } from '../../types';
import ActionsListFacilitator from './ActionsListFacilitator';

import ActionHeader from './ActionHeader';
import AddAction from './AddAction';
import ZeroActions from './ZeroActions';
import theme from '../../theme/theme';
import ActionsListParticipant from './ActionsListParticipant';
import { NONE, VALUE_ASC, VALUE_DSC, VOTES_ASC, VOTES_DSC } from './const';
import ActionSubToolbar from './ActionSubToolbar';
import DialogWithDyanamicData from '../Utils/Dialogs/DialogWithDyanamicData';

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
  const [open, setOpen] = React.useState<boolean>(false);

  const [assigneeId, setAssigneeId] = React.useState<string>('');
  const [selectedActionCount, setSelectedActionCount] =
    React.useState<number>(0);
  const [addedActionValue, setAddActionValue] = React.useState<string>('');
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [isTextFieldFocused, setIsTextFieldFocused] =
    React.useState<boolean>(false);
  // const [currentUserActions, setCurrentUserActions] = React.useState<
  //   ActionInterface[]
  // >([]);
  // const [othersUserActions, setOthersUserActions] = React.useState<
  //   ActionInterface[]
  // >([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [sortedBy, setSortedBy] = React.useState<string>(NONE);
  const [showUnassign, setShowUnassign] = React.useState<boolean>(false);
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
    var tempSelectedActionCount = 0;
    var tempShowUnassign = false;
    allActionsTemp &&
      allActionsTemp.map(action => {
        // othersUserActions.map(other => {
        //   if (other.id == action.id) {
        //     other.checked = action.checked;
        //   }
        //   currentUserActions.map(current => {
        //     if (current.id == action.id) {
        //       current.checked = action.checked;
        //     }
        //   });
        // });

        if (action.checked) {
          tempSelectedActionCount = tempSelectedActionCount + 1;
        }
        if (
          action.assigneeId != '' &&
          action.assigneeId != undefined &&
          action.checked
        ) {
          tempShowUnassign = true;
        }
      });
    setShowUnassign(tempShowUnassign);
    setSelectedActionCount(tempSelectedActionCount);
  }, [allActionsTemp]);

  // React.useEffect(() => {
  //   const tempCurrentUserActions = allActions.filter(
  //     action => action.createdBy === global.user.id
  //   );

  //   const tempOthersUserActions = allActions.filter(
  //     action => action.createdBy != global.user.id
  //   );
  //   setCurrentUserActions([...tempCurrentUserActions]);
  //   setOthersUserActions([...tempOthersUserActions]);
  // }, [allActions]);

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

  const assignAction = async (ids: string[], assigneeId: string) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(BoardActionType.ASSIGN_ACTION, {
      actionIds: ids,
      assigneeId: assigneeId,
    }).then(res => {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: false },
      });
    });
    setAssigneeId('');
    setDialogObject({
      open: false,
      header: '',
      content: '',
      agreeLabel: '',
      cancelLabel: '',
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
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
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

  const enableVotingToParticipant = async (value: boolean) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(BoardActionType.ENABLE_VOTING_TO_PARTICIPANT, {
      value,
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

  const enableAddActionToParticipant = async (value: boolean) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(
      BoardActionType.ENABLE_ADD_ACTIONS_TO_PARTICIPANT,
      {
        value,
      }
    ).then(
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

    // const tempCurrentUserActions = results.filter(
    //   action => action.createdBy === global.user.id
    // );

    // const tempOthersUserActions = results.filter(
    //   action => action.createdBy != global.user.id
    // );

    setSearchQuery(value);
    setAllActionsTemp(results);
    // setCurrentUserActions([...tempCurrentUserActions]);
    // setOthersUserActions([...tempOthersUserActions]);
  };

  // Sort Functionality
  const handleSortedByChange = (event: SelectChangeEvent) => {
    setSortedBy(event.target.value);
    switch (event.target.value) {
      case NONE:
        setAllActionsTemp(allActions);
        const tempCurrentUserActions = allActions.filter(
          action => action.createdBy === global.user.id
        );
        const tempOthersUserActions = allActions.filter(
          action => action.createdBy != global.user.id
        );
        setCurrentUserActions([...tempCurrentUserActions]);
        setOthersUserActions([...tempOthersUserActions]);
        break;
      case VALUE_ASC:
        assigneeASCENDING();
        break;
      case VALUE_DSC:
        assigneeDESCENDING();
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
    const newAction = allActionsTemp.map(action => {
      if (action.id === actionId) {
        return { ...action, checked: !action.checked };
      }
      return action;
    });

    setAllActionsTemp([...newAction]);
  };

  const assigneeASCENDING = () => {
    const strAscending = [...allActions].sort((a, b) =>
      a.assigneeName > b.assigneeName ? 1 : -1
    );
    setAllActionsTemp(strAscending);

    const tempCurrentUserActions = allActions.filter(
      action => action.createdBy === global.user.id
    );

    const tempOthersUserActions = allActions.filter(
      action => action.createdBy != global.user.id
    );
    const currentStrAscending = [...tempCurrentUserActions].sort((a, b) =>
      a.assigneeName > b.assigneeName ? 1 : -1
    );
    const otherStrAscending = [...tempOthersUserActions].sort((a, b) =>
      a.assigneeName > b.assigneeName ? 1 : -1
    );

    // setCurrentUserActions([...currentStrAscending]);
    // setOthersUserActions([...otherStrAscending]);
  };

  const assigneeDESCENDING = () => {
    const strDescending = [...allActions].sort((a, b) =>
      a.assigneeName > b.assigneeName ? -1 : 1
    );
    const tempCurrentUserActions = allActions.filter(
      action => action.createdBy === global.user.id
    );

    const tempOthersUserActions = allActions.filter(
      action => action.createdBy != global.user.id
    );
    const currentStrAscending = [...tempCurrentUserActions].sort((a, b) =>
      a.assigneeName > b.assigneeName ? -1 : 1
    );
    const otherStrAscending = [...tempOthersUserActions].sort((a, b) =>
      a.assigneeName > b.assigneeName ? -1 : 1
    );

    setAllActionsTemp(strDescending);
    // setCurrentUserActions([...currentStrAscending]);
    // setOthersUserActions([...otherStrAscending]);
  };

  const numericASCENDING = () => {
    const numAscending = [...allActions].sort(
      (a, b) => a.reacts?.length - b.reacts?.length
    );
    const tempCurrentUserActions = allActions.filter(
      action => action.createdBy === global.user.id
    );

    const tempOthersUserActions = allActions.filter(
      action => action.createdBy != global.user.id
    );
    const currentNumAscending = [...tempCurrentUserActions].sort(
      (a, b) => a.reacts?.length - b.reacts?.length
    );
    const otherNumAscending = [...tempOthersUserActions].sort(
      (a, b) => a.reacts?.length - b.reacts?.length
    );

    setAllActionsTemp(numAscending);
    // setCurrentUserActions([...currentNumAscending]);
    // setOthersUserActions([...otherNumAscending]);
  };

  const numericDESCENDING = () => {
    const numDescending = [...allActions].sort(
      (a, b) => b.reacts?.length - a.reacts?.length
    );

    const tempCurrentUserActions = allActions.filter(
      action => action.createdBy === global.user.id
    );

    const tempOthersUserActions = allActions.filter(
      action => action.createdBy != global.user.id
    );
    const currentNumAscending = [...tempCurrentUserActions].sort(
      (a, b) => b.reacts?.length - a.reacts?.length
    );
    const otherNumAscending = [...tempOthersUserActions].sort(
      (a, b) => b.reacts?.length - a.reacts?.length
    );

    setAllActionsTemp(numDescending);
    // setCurrentUserActions([...currentNumAscending]);
    // setOthersUserActions([...otherNumAscending]);
  };
  const [dialogObject, setDialogObject] = React.useState<DyanamicDialog>({
    open: false,
    header: '',
    content: '',
    agreeLabel: '',
    cancelLabel: '',
  });
  const findUser = (userId: string) =>
    users.find(user => user.userId === userId);

  const assignFunction = (id: string) => {
    setAssigneeId(id);
    const header = selectedActionCount == 1 ? ' Action' : ' Actions';
    const subcontent = selectedActionCount == 1 ? 'Selected action' : 'All selected actions';
    const asignee = findUser(id);
    const userName = asignee && asignee?.userNickname;
    if (id != '') {
      setDialogObject({
        open: true,
        header: 'Assign ' + selectedActionCount + header + '?',
        content:
        subcontent + ' will be assigned to ' + userName + '.',
        agreeLabel: 'ASSIGN ' + selectedActionCount + header,
        cancelLabel: 'CANCEL',
      });
      // setOpen(true)}
    } else {
      setDialogObject({
        open: true,
        header: 'Un-assign ' + selectedActionCount + header + '?',
        content: subcontent + ' will be un-assigned.',
        agreeLabel: 'UN-ASSIGN ' + selectedActionCount + header,
        cancelLabel: 'CANCEL',
      });
    }
  };

  const agreeToAssignFunction = () => {
    const ids: string[] = [];
    allActionsTemp &&
      allActionsTemp.map(action => {
        if (action.checked) {
          ids.push(action.id);
        }
      });
    if (ids.length > 0) {
      assignAction(ids, assigneeId);
    }
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
        enableVotingToParticipant={enableVotingToParticipant}
        enableAddActionToParticipant={enableAddActionToParticipant}
      />
      {!ended && (
        <>
          {selectedActionCount == 0 ? (
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

              {global.user.userType == 1 &&
                !isFeedbackSubmitted &&
                actionsData.isAddActionEnableToParticipant && (
                  <AddAction
                    addAction={addAction}
                    addedActionValue={addedActionValue}
                    setAddActionValue={setAddActionValue}
                    isTextFieldFocused={isTextFieldFocused}
                    setIsTextFieldFocused={setIsTextFieldFocused}
                  />
                )}
            </>
          ) : (
            <ActionSubToolbar
              selectedActionCount={selectedActionCount}
              global={global}
              showUnassign={showUnassign}
              assignFunction={assignFunction}
            />
          )}
        </>
      )}

      {allActions.length > 0 ? (
        <>
          {global.user.userType == 2 ? (
            <>
              {searchQuery.length > 0 && allActionsTemp.length === 0 ? (
                <ZeroActions
                  height="var(--app-height)"
                  zeroActionText_One=""
                  zeroActionText_Two="No Action found..."
                />
              ) : (
                <ActionsListFacilitator
                  allActions={allActionsTemp}
                  handleToggleAction={handleToggleAction}
                  addReactToAction={addReactToAction}
                  isFeedbackSubmitted={isFeedbackSubmitted}
                  removeReactFromAction={removeReactFromAction}
                  isAddActionEnableToParticipant={
                    actionsData.isAddActionEnableToParticipant
                  }
                  isVotingEnableToParticipant={
                    actionsData.isVotingEnableToParticipant
                  }
                />
              )}
            </>
          ) : (
            <>
              {searchQuery.length > 0 && allActionsTemp.length === 0 ? (
                <ZeroActions
                  height="var(--app-height)"
                  zeroActionText_One=""
                  zeroActionText_Two="No Action found..."
                />
              ) : (
                <ActionsListParticipant
                  // currentUserActions={currentUserActions}
                  // othersUserActions={othersUserActions}
                  handleToggleAction={handleToggleAction}
                  addReactToAction={addReactToAction}
                  user={global.user}
                  ended={ended}
                  allActions={allActionsTemp}
                  isFeedbackSubmitted={isFeedbackSubmitted}
                  removeReactFromAction={removeReactFromAction}
                  isAddActionEnableToParticipant={
                    actionsData.isAddActionEnableToParticipant
                  }
                  isVotingEnableToParticipant={
                    actionsData.isVotingEnableToParticipant
                  }
                />
              )}
            </>
          )}
        </>
      ) : (
        <>
          {global.user.userType === 1 && (
            <>
              {!actionsData.isAddActionEnableToParticipant ? (
                <ZeroActions
                  height="var(--app-height)"
                  zeroActionText_One="Actions Speak!"
                  zeroActionText_Two="Let Facilitator add them here..."
                />
              ) : (
                <ZeroActions
                  height="var(--app-height)"
                  zeroActionText_One="Actions Speak!"
                  zeroActionText_Two="Add them here..."
                />
              )}
            </>
          )}
          {global.user.userType === 2 && (
            <ZeroActions
              height="var(--app-height)"
              zeroActionText_One="Actions Speak!"
              zeroActionText_Two="Add them here..."
            />
          )}
        </>
      )}
      <DialogWithDyanamicData
        open={dialogObject.open}
        header={dialogObject.header}
        subtext={dialogObject.content}
        agreeLabel={dialogObject.agreeLabel}
        cancelLabel={dialogObject.cancelLabel}
        handleClose={() => {
          setDialogObject({
            open: false,
            header: '',
            content: '',
            agreeLabel: '',
            cancelLabel: '',
          });
        }}
        acceptClose={() => {
          agreeToAssignFunction();
        }}
      />
    </Box>
  );
}
