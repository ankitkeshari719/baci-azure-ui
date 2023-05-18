import * as React from 'react';
import './styles.scss';

import { ActionInterface } from '../../types';
import ActionItem from './ActionItem';
import { Box, List } from '@mui/material';

type Props = {
  allActions: ActionInterface[];
  handleToggleAction: (actionId: string) => void;
  addReactToAction: (actionId: string, actionBy: string) => void;
  removeReactFromAction: (actionId: string) => void;
  isAddActionEnableToParticipant: boolean | undefined;
  isVotingEnableToParticipant: boolean | undefined;
  isFeedbackSubmitted: boolean;
};

export default function ActionsListFacilitator({
  allActions,
  handleToggleAction,
  addReactToAction,
  isFeedbackSubmitted,
  removeReactFromAction,
  isAddActionEnableToParticipant,
  isVotingEnableToParticipant
}: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 'var(--app-height)',
        overflowY: 'auto',
        borderRadius: '8px',
      }}
    >
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {allActions.map(action => {
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
    </Box>
  );
}
