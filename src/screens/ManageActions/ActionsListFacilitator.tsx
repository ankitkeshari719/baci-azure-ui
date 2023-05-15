import * as React from 'react';
import './styles.scss';

import { ActionInterface } from '../../types';
import ActionItem from './ActionItem';
import { Box, List } from '@mui/material';

type Props = {
  allActions: ActionInterface[];
  handleToggleAction: (actionId: string) => void;
  addReact: (actionId: string, actionBy: string) => void;
  isFeedbackSubmitted: boolean;
};

export default function ActionsListFacilitator({
  allActions,
  handleToggleAction,
  addReact,
  isFeedbackSubmitted,
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
              addReact={addReact}
              isFeedbackSubmitted={isFeedbackSubmitted}
            />
          );
        })}
      </List>
    </Box>
  );
}
