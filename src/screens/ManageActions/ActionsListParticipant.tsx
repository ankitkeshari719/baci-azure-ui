import * as React from 'react';
import './styles.scss';

import { ActionInterface } from '../../types';
import ActionItem from './ActionItem';
import { Box, List } from '@mui/material';
import { Typography } from '@material-ui/core';

type Props = {
  currentUserActions: ActionInterface[];
  othersUserActions: ActionInterface[];
  handleToggleAction: (actionId: string) => void;
};

export default function ActionsListParticipant({
  currentUserActions,
  othersUserActions,
  handleToggleAction,
}: Props) {
  const [showOtherAction, setShowOtherAction] = React.useState<boolean>(false);
  return (
    <Box sx={{ width: '100%', height: 'var(--app-height)', overflowY: 'auto' }}>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {currentUserActions.map(action => {
          return (
            <ActionItem
              action={action}
              key={action.id}
              handleToggleAction={handleToggleAction}
            />
          );
        })}
      </List>
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
      {showOtherAction && (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {othersUserActions.map(action => {
            return (
              <ActionItem
                action={action}
                key={action.id}
                handleToggleAction={handleToggleAction}
              />
            );
          })}
        </List>
      )}
    </Box>
  );
}
