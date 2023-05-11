import * as React from 'react';
import './styles.scss';

import { Typography, Box } from '@material-ui/core';
import { ActionInterface } from '../../types';
import { ActionType } from '../../contexts/GlobalContext';
type Props = {
  allActions: ActionInterface[];
  global: any;
  dispatch: any;
};

export default function ActionHeader({ allActions, global, dispatch }: Props) {
  return (
    <Box className="actionHeaderContainer">
      <Box className="actionHeader">
        <Box
          className="d-flex justify-content-start align-items-center p-0"
        >
          <Typography component="span" className="totalActions">
            {allActions.length} Actions
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
