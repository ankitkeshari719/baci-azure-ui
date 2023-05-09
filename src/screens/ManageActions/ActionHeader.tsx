import * as React from 'react';
import './styles.scss';

import { Typography, Box } from '@material-ui/core';
import { ActionInterface } from '../../types';
import { ActionType } from '../../contexts/GlobalContext';
import { BoardContext } from '../../contexts/BoardContext';
type Props = {
  allActions: ActionInterface[];
  global: any;
  dispatch: any;
};

export default function ActionHeader({ allActions, global, dispatch }: Props) {
  const {
    state: { actionsData },
    commitAction,
  } = React.useContext(BoardContext);
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
    <Box className="actionHeaderContainer">
      <Box className="actionHeader">
        <Box
          // xs="6"
          className="d-flex justify-content-start align-items-center p-0"
        >
          <Typography component="span" className="totalActions">
            {global.user.userType == 2 ? actionsData.actions.length: actionCountForCurrentUser} Actions
          </Typography>
        </Box>
        <Box>
          {global.expandColumn === -1 ? (
            <img
              onClick={() => {
                dispatch({
                  type: ActionType.EXPAND_COLUMN,
                  payload: { expandColumn: 2 },
                });
              }}
              src="/svgs/Expand.svg"
              style={{
                width: '20px',
                marginLeft: '15px',
                cursor: 'pointer',
              }}
            />
          ) : (
            <img
              onClick={() => {
                dispatch({
                  type: ActionType.EXPAND_COLUMN,
                  payload: { expandColumn: -1 },
                });
              }}
              src="/svgs/Shrink.svg"
              style={{
                width: '20px',
                marginLeft: '15px',
                cursor: 'pointer',
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
