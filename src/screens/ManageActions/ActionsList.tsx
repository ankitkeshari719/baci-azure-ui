import * as React from 'react';
import './styles.scss';

import { ActionInterface } from '../../types';
import ActionItem from './ActionItem';
import { Box, List } from '@mui/material';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import ZeroActions from './ZeroActions';

type Props = {
  allActions: ActionInterface[];
  handleToggleAction: (actionId: string) => void;
};

export default function ActionsList({ allActions, handleToggleAction }: Props) {
  const {
    state: { actionsData },
    commitAction,
  } = React.useContext(BoardContext);
  const [global] = React.useContext(GlobalContext);
  const [actionCountForCurrentUser, setActionCountForCurrentUser] =
    React.useState<number>(0);

  React.useEffect(() => {
    let actionCount = 0;
    actionsData.actions.map(action => {
      if (global.user.id === action.createdBy) {
        actionCount++;
      }
    });
    setActionCountForCurrentUser(actionCount);
  }, [actionsData]);

  return (
    <Box sx={{ width: '100%', height: 'var(--app-height)', overflowY: 'auto' }}>
      {actionCountForCurrentUser === 0 ? (
        <ZeroActions />
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {allActions.map(action => {
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
