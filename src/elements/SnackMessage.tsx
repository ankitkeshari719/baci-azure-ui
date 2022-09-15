import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { Alert, Button, Snackbar } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import React from 'react';

export const SnackMessage = () => {
  const [global, dispatch] = React.useContext(GlobalContext);

  const clearMessage = () => {
    dispatch({
      type: ActionType.SET_SNACK_MESSAGE,
      payload: { snackMessage: undefined },
    });
  };
  return (
    <Snackbar
      open={global.snackMessage !== undefined}
      autoHideDuration={4000}
      onClose={clearMessage}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity="success">
        {global.snackMessage}
        <Button color="primary" size="small" onClick={clearMessage}>
          <CloseIcon />
        </Button>
      </Alert>
    </Snackbar>
  );
};
