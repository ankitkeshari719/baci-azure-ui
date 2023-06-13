import * as React from 'react';
import shortid from 'shortid';
import './styles.scss';
import { Box, SelectChangeEvent, useMediaQuery } from '@mui/material';
import { BoardContext } from '../../contexts/BoardContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { BoardActionType } from '../../helpers/statemachine/BoardStateMachine';
import { ActionInterface, DyanamicDialog } from '../../helpers/types';
import ActionsListFacilitator from './ActionsListFacilitator';

import ActionHeader from './ActionHeader';
import AddAction from './AddAction';
import ZeroActions from './ZeroActions';
import theme from '../../helpers/theme/theme';
import ActionsListParticipant from './ActionsListParticipant';
import { NONE, VALUE_ASC, VALUE_DSC, VOTES_ASC, VOTES_DSC } from './const';
import ActionSubToolbar from './ActionSubToolbar';
import DialogWithDyanamicData from '../Utils/Dialogs/DialogWithDyanamicData';
import MessageForParticipant from './MessageForParticipant';

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
  const [expandMessageForParticipant, setExpandMessageForParticipant] =
    React.useState<boolean>(false);

  const [assigneeId, setAssigneeId] = React.useState<string>('');
  const [selectedActionCount, setSelectedActionCount] =
    React.useState<number>(0);
  const [addedActionValue, setAddActionValue] = React.useState<string>('');
  const [messageForParticipant, setMessageForParticipant] =
    React.useState<string>('');
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [isTextFieldFocused, setIsTextFieldFocused] =
    React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [sortedBy, setSortedBy] = React.useState<string>(NONE);
  const [showUnassign, setShowUnassign] = React.useState<boolean>(false);
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] =
    React.useState<boolean>(false);
  const [removeActionList, setRemoveActionList] = React.useState<
    ActionInterface[]
  >([]);
  const [dialogObject, setDialogObject] = React.useState<DyanamicDialog>({
    open: false,
    header: '',
    content: '',
    agreeLabel: '',
    cancelLabel: '',
  });

  React.useEffect(() => {
    let tempActions = actionsData.actions.map(action => {
      action.checked = false;
      return action;
    });

    setMessageForParticipant(
      actionsData.messageForParicipants ? actionsData.messageForParicipants : ''
    );
    console.log(actionsData.messageForParicipants);
    setAllActions([...tempActions]);
    setAllActionsTemp([...tempActions]);
  }, [actionsData]);

  const setLoadingFlag = (status: boolean) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: status },
    });
  };

  React.useEffect(() => {
    var tempSelectedActionCount = 0;
    var tempShowUnassign = false;
    allActionsTemp &&
      allActionsTemp.map(action => {
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
    setLoadingFlag(true);
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
        setLoadingFlag(false);
      },
      err => {
        setLoadingFlag(false);
      }
    );
  };

  // Function to call API on adding the new react
  const addReactToAction = async (actionId: string, actionBy: string) => {
    setLoadingFlag(true);
    await saveAndProcessAction(BoardActionType.ADD_REACT_TO_ACTION, {
      actionId: actionId,
      react: '👍',
    }).then(
      res => {
        setLoadingFlag(false);
      },
      err => {
        setLoadingFlag(false);
      }
    );
  };

  // Function to call API on removing the new react
  const removeReactFromAction = async (actionId: string) => {
    setLoadingFlag(true);
    await saveAndProcessAction(BoardActionType.REMOVE_REACT_FROM_ACTION, {
      actionId,
      react: '👍',
    }).then(
      res => {
        setLoadingFlag(false);
      },
      err => {
        setLoadingFlag(false);
      }
    );
  };

  // Function to call API on enabling to voting participant functionality
  const enableVotingToParticipant = async (value: boolean) => {
    setLoadingFlag(true);
    await saveAndProcessAction(BoardActionType.ENABLE_VOTING_TO_PARTICIPANT, {
      value,
    }).then(
      res => {
        setLoadingFlag(false);
      },
      err => {
        setLoadingFlag(false);
      }
    );
  };

  // Function to call API on enabling to add action to participant functionality
  const enableAddActionToParticipant = async (value: boolean) => {
    setLoadingFlag(true);
    await saveAndProcessAction(
      BoardActionType.ENABLE_ADD_ACTIONS_TO_PARTICIPANT,
      {
        value,
      }
    ).then(
      res => {
        setLoadingFlag(false);
      },
      err => {
        setLoadingFlag(false);
      }
    );
  };

  // Search Functionality
  const handleSearchQueryOnChange = (value: string) => {
    const results = [...allActions].filter(action => {
      if (value === '') return [...allActions];
      return action.value.toLowerCase().includes(value.toLowerCase());
    });

    setSearchQuery(value);
    setAllActionsTemp(results);
  };

  // Function to remove particular action
  const removeAction = async (actionId: string) => {
    setLoadingFlag(true);
    await saveAndProcessAction(BoardActionType.DELETE_ACTION, {
      actionId: actionId,
    }).then(
      res => {
        setLoadingFlag(false);
      },
      err => {
        setLoadingFlag(false);
      }
    );
  };

  const agreeToRemoveAction = () => {
    setDialogObject({
      open: false,
      header: '',
      content: '',
      agreeLabel: '',
      cancelLabel: '',
    });

    removeActionList.map(action => {
      removeAction(action.id);
    });

    setRemoveActionList([]);
  };

  const handleRemove = () => {
    const localActionList: ActionInterface[] = [];
    var count = 0;

    allActionsTemp.map(action => {
      if (action.checked) {
        localActionList.push(action);
        count = count + 1;
      }
    });
    const actionString = count == 1 ? ' Action?' : ' Actions?';
    const contentString =
      count == 1
        ? 'Selected action will be removed permanently.'
        : 'All selected actions will be removed permanently.';
    const agreeLabel =
      count == 1 ? 'REMOVE ACTION' : 'REMOVE ' + count + ' ACTIONS';

    setRemoveActionList(localActionList);
    setDialogObject({
      open: true,
      header: 'Remove ' + count + ' Selected' + actionString,
      content: contentString,
      agreeLabel: agreeLabel,
      cancelLabel: 'CANCEL',
    });
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
        break;
      case VALUE_ASC:
        assigneeASCENDING();
        break;
      case VALUE_DSC:
        assigneeDESCENDING();
        break;
      case VOTES_ASC:
        votesASCENDING();
        break;
      case VOTES_DSC:
        votesDESCENDING();
        break;
    }
  };

  // Sort Functionality:  Assignee ASCENDING
  const assigneeASCENDING = () => {
    const strAscending = [...allActions].sort((a, b) => {
      const first = a.assigneeName.toLowerCase();
      const second = b.assigneeName.toLowerCase();
      return first > second ? 1 : -1;
    });
    setAllActionsTemp(strAscending);
  };

  // Sort Functionality:  Assignee DESCENDING
  const assigneeDESCENDING = () => {
    const strDescending = [...allActions].sort((a, b) => {
      const first = a.assigneeName.toLowerCase();
      const second = b.assigneeName.toLowerCase();
      return first > second ? -1 : 1;
    });
    setAllActionsTemp(strDescending);
  };

  // Sort Functionality:  Votes ASCENDING
  const votesASCENDING = () => {
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
  };

  // Sort Functionality:  Votes DESCENDING
  const votesDESCENDING = () => {
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

  const assignAction = async (ids: string[], assigneeId: string) => {
    setLoadingFlag(true);
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

  const findUser = (userId: string) =>
    users.find(user => user.userId === userId);

  const assignFunction = (id: string) => {
    setAssigneeId(id);
    const header = selectedActionCount == 1 ? ' Action' : ' Actions';
    const subContent =
      selectedActionCount == 1 ? 'Selected action' : 'All selected actions';
    const asignee = findUser(id);
    const userName = asignee && asignee?.userNickname;
    if (id != '') {
      setDialogObject({
        open: true,
        header: 'Assign ' + selectedActionCount + ' Selected' + header + '?',
        content: subContent + ' will be assigned to ' + userName + '.',
        agreeLabel: 'ASSIGN ' + selectedActionCount + header,
        cancelLabel: 'CANCEL',
      });
    } else {
      setDialogObject({
        open: true,
        header: 'Un-assign ' + selectedActionCount + ' Selected' + header + '?',
        content: subContent + ' will be un-assigned.',
        agreeLabel: 'UN-ASSIGN ' + selectedActionCount + header,
        cancelLabel: 'CANCEL',
      });
    }
  };

  const postMessageForParticipantFlag = async (post: boolean) => {
    console.log('messageForParticipant', messageForParticipant);
    updateMessageForParticipant(messageForParticipant);
    // await saveAndProcessAction(
    //   BoardActionType.POST_MESSAGE_FOR_PARTICIPANTS_FLAG,
    //   { post }
    // ).then(res => {
    //   console.log();
    // });
  };
  const clearMessageForParticipant = async () => {
    setMessageForParticipant('');
    updateMessageForParticipant('');
  };
  const updateMessageForParticipant = async (message: string) => {
    setLoadingFlag(true);
    await saveAndProcessAction(
      BoardActionType.UPDATE_MESSAGE_FOR_PARTICIPANTS,
      { message }
    ).then(
      res => {
        setLoadingFlag(false);
        console.log();
      },
      error => {
        setLoadingFlag(false);
      }
    );
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

  // Remove Action
  const removeSelectedAction = async (selectedAction: ActionInterface) => {
    setLoadingFlag(true);
    await saveAndProcessAction(BoardActionType.REMOVE_ACTION, {
      id: selectedAction?.id,
    }).then(
      res => {
        setLoadingFlag(false);
      },
      err => {
        setLoadingFlag(false);
      }
    );
  };

  const handleUnselect = () => {
    setLoadingFlag(true);
    const localAllActionsTemp = allActionsTemp;

    localAllActionsTemp &&
      localAllActionsTemp.map(action => {
        action.checked = false;
      });
    setAllActionsTemp(localAllActionsTemp);
    setSelectedActionCount(0);
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: false },
    });
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
      id="actionMainContainer"
    >
      <ActionHeader
        global={global}
        allActions={allActions}
        dispatch={dispatch}
        searchQuery={searchQuery}
        sortedBy={sortedBy}
        actionsData={actionsData}
        handleSearchQueryOnChange={handleSearchQueryOnChange}
        handleSortedByChange={handleSortedByChange}
        enableVotingToParticipant={enableVotingToParticipant}
        enableAddActionToParticipant={enableAddActionToParticipant}
        ended={ended}
      />

      <MessageForParticipant
        expandMessageForParticipant={expandMessageForParticipant}
        setExpandMessageForParticipant={setExpandMessageForParticipant}
        messageForParticipant={messageForParticipant}
        setMessageForParticipant={setMessageForParticipant}
        postMessageForParticipant={postMessageForParticipantFlag}
        actionsData={actionsData}
        clearMessageForParticipant={clearMessageForParticipant}
        userType={global.user.userType}
        ended={ended}
        isXsUp={isXsUp}
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
              handleUnselect={handleUnselect}
              handleRemove={handleRemove}
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
                  removeAction={removeSelectedAction}
                  assignAction={assignAction}
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
                  removeAction={removeSelectedAction}
                  assignAction={assignAction}
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
          if (dialogObject.agreeLabel.split(' ')[0] == 'REMOVE') {
            setRemoveActionList([]);
          }
          setDialogObject({
            open: false,
            header: '',
            content: '',
            agreeLabel: '',
            cancelLabel: '',
          });
        }}
        acceptClose={() => {
          if (dialogObject.agreeLabel.split(' ')[0] == 'REMOVE') {
            agreeToRemoveAction();
          } else agreeToAssignFunction();
        }}
      />
    </Box>
  );
}
