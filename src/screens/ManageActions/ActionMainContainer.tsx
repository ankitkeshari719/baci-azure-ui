import * as React from 'react';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { Typography } from '@material-ui/core';

export default function ActionMainContainer() {
  const {
    state: { startedDate, endedDate, lastStateUpdate, columns, users, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  return (
    <>
    <Typography>{global.user.name}</Typography>
    </>
  );
}
