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
  ended: boolean;
};

export default function ActionsListParticipant({
  currentUserActions,
  othersUserActions,
  handleToggleAction,
  ended,
}: Props) {
  const [showOtherAction, setShowOtherAction] = React.useState<boolean>(false);
  return (
    <Box sx={{ width: '100%', height: 'var(--app-height)', overflowY: 'auto' }}>
      {currentUserActions.length > 0 && (
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
              />
            );
          })}
        </List>
      )}
      {currentUserActions.length == 0 && <ZeroActions height="85%" />}
    </Box>
  );
}
