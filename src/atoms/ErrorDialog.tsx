import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';

export default function ErrorDialog(props?: any) {
  React.useEffect(() => {
    console.log("error", props.error)
  }, [])

  return (
    <>
      {props.error == "error : Socket disconnected" ? <Dialog open={true}>
        <DialogTitle>You are offline</DialogTitle>
        <DialogContent>
          <Grid container justifyContent="center">
            <Typography>Please check the network connection or click on Reconnect.</Typography>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => location.reload()}
            // onTouchStart={() => location.reload()}
            autoFocus
          >
            Reconnect
          </Button>
        </DialogActions>
      </Dialog> :
        <Dialog open={true}>
          <DialogTitle>There has been an error</DialogTitle>
          <DialogContent>
            <Grid container justifyContent="center">
              <Typography>Please try again later</Typography>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => location.reload()}
              // onTouchStart={() => location.reload()}
              autoFocus
            >
              Reload
            </Button>
          </DialogActions>
        </Dialog>}
    </>
  );
}
