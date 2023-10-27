import * as React from 'react';
import './styles.scss';

import { ActionInterface } from '../../helpers/types';
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
  removeAction: (selectedActions: ActionInterface) => void;
  assignAction: (ids: string[], assigneeId: string) => void;
  jiraProjects:any[]
};

export default function ActionsListFacilitator({
  allActions,
  handleToggleAction,
  addReactToAction,
  isFeedbackSubmitted,
  removeReactFromAction,
  isAddActionEnableToParticipant,
  isVotingEnableToParticipant,
  removeAction,
  assignAction,
  jiraProjects
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
              disabled={false}
              removeAction={removeAction}
              assignAction={assignAction}
              jiraProjects={jiraProjects}
            />
          );
        })}
      </List>
    </Box>
  );
}
