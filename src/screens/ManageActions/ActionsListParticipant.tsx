import * as React from 'react';
import './styles.scss';

import { ActionInterface } from '../../types';
import ActionItem from './ActionItem';
import { Box, List } from '@mui/material';
import { Typography } from '@material-ui/core';
import ZeroActions from './ZeroActions';

type Props = {
  // currentUserActions: ActionInterface[];
  // othersUserActions: ActionInterface[];
  handleToggleAction: (actionId: string) => void;
  addReactToAction: (actionId: string, actionBy: string) => void;
  removeReactFromAction: (actionId: string) => void;
  ended: boolean;
  isFeedbackSubmitted: boolean;
  isAddActionEnableToParticipant: boolean | undefined;
  isVotingEnableToParticipant: boolean | undefined;
  allActions: ActionInterface[];
  user: any;
};

export default function ActionsListParticipant({
  // currentUserActions,
  // othersUserActions,
  handleToggleAction,
  addReactToAction,
  ended,
  isFeedbackSubmitted,
  removeReactFromAction,
  isAddActionEnableToParticipant,
  isVotingEnableToParticipant,
  allActions,
  user,
}: Props) {
  const [showOtherAction, setShowOtherAction] = React.useState<boolean>(false);
  const [currentUserActions, setCurrentUserActions] = React.useState<
    ActionInterface[]
  >([]);
  const [othersUserActions, setOthersUserActions] = React.useState<
    ActionInterface[]
  >([]);

  React.useEffect(() => {
    const currentUserActionsTemp: ActionInterface[] = [];
    const othersUserActionsTemp: ActionInterface[] = [];
    allActions &&
      allActions.map(action => {
        if (action.createdBy == user.id) {
          currentUserActionsTemp.push(action);
        } else {
          othersUserActionsTemp.push(action);
        }
      });
    setCurrentUserActions(currentUserActionsTemp);
    setOthersUserActions(othersUserActionsTemp);
  }, [allActions]);

  return (
    <Box
      sx={{
        width: '100%',
        height: 'var(--app-height)',
        overflowY: 'auto',
        borderRadius: '8px',
      }}
    >
      {/* current user actions */}
      {currentUserActions.length > 0 && (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {currentUserActions.map(action => {
            return (
              <ActionItem
                action={action}
                key={action.id}
                handleToggleAction={handleToggleAction}
                addReactToAction={addReactToAction}
                isFeedbackSubmitted={isFeedbackSubmitted}
                removeReactFromAction={removeReactFromAction}
                isAddActionEnableToParticipant={isAddActionEnableToParticipant}
                isVotingEnableToParticipant={isVotingEnableToParticipant}
                disabled={false}

              />
            );
          })}
        </List>
      )}
      {/* How and hide message*/}
      {othersUserActions.length > 0 && (
        <Box
          sx={{
            width: '100%',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!showOtherAction ? (
            <Typography
              className="showOtherActionLink"
              onClick={() => setShowOtherAction(true)}
            >
              Show Other Participants’ Actions ( {othersUserActions.length})
            </Typography>
          ) : (
            <Typography
              className="showOtherActionLink"
              onClick={() => setShowOtherAction(false)}
            >
              Hide Other Participants’ Actions ( {othersUserActions.length})
            </Typography>
          )}
        </Box>
      )}
      {/* Other Participant and facilitator actions */}
      {showOtherAction && othersUserActions.length > 0 && (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {othersUserActions.map(action => {
            return (
              <ActionItem
                action={action}
                key={action.id}
                handleToggleAction={handleToggleAction}
                addReactToAction={addReactToAction}
                isFeedbackSubmitted={isFeedbackSubmitted}
                removeReactFromAction={removeReactFromAction}
                isAddActionEnableToParticipant={isAddActionEnableToParticipant}
                isVotingEnableToParticipant={isVotingEnableToParticipant}
                disabled={true}
              />
            );
          })}
        </List>
      )}
    </Box>
  );
}
