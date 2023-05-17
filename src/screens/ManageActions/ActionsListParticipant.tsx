import * as React from 'react';
import './styles.scss';

import { ActionInterface } from '../../types';
import ActionItem from './ActionItem';
import { Box, List } from '@mui/material';
import { Typography } from '@material-ui/core';
import ZeroActions from './ZeroActions';

type Props = {
  currentUserActions: ActionInterface[];
  othersUserActions: ActionInterface[];
  handleToggleAction: (actionId: string) => void;
  addReactToAction: (actionId: string, actionBy: string) => void;
  removeReactFromAction: (actionId: string) => void;
  ended: boolean;
  isFeedbackSubmitted: boolean;
  isAddActionEnableToParticipant: boolean | undefined;
  isVotingEnableToParticipant: boolean | undefined;
};

export default function ActionsListParticipant({
  currentUserActions,
  othersUserActions,
  handleToggleAction,
  addReactToAction,
  ended,
  isFeedbackSubmitted,
  removeReactFromAction,
  isAddActionEnableToParticipant,
  isVotingEnableToParticipant,
}: Props) {
  const [showOtherAction, setShowOtherAction] = React.useState<boolean>(false);
  return (
    <Box
      sx={{
        width: '100%',
        height: 'var(--app-height)',
        overflowY: 'auto',
        borderRadius: '8px',
      }}
    >
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
              />
            );
          })}
        </List>
      )}
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
              />
            );
          })}
        </List>
      )}
      {currentUserActions.length == 0 && (
        <ZeroActions
          height="85%"
          zeroActionText_One="zeroActionText_One"
          zeroActionText_Two="zeroActionText_Two"
        />
      )}
    </Box>
  );
}
