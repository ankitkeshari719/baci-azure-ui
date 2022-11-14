import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useMediaQuery,
  DialogActions,
  DialogContentText,
} from '@mui/material';

import { BoardContext } from '../contexts/BoardContext';
import { GlobalContext } from '../contexts/GlobalContext';
import React, { useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import { Report } from '../elements/Report';
import { UserAvatar } from '../atoms/UserAvatar';
import theme from '../theme/theme';
import useLoadRetro from '../hooks/useLoadRetro';
import { Navigate, useNavigate } from 'react-router-dom';
import { ActionType } from '../contexts/GlobalContext';







export default function ReportScreen() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const reset = () => {
    dispatch({ type: ActionType.CLOSE_CURRENT_RETRO });
    dispatch({
      type: ActionType.SET_RETRO_CREATE,
      payload: { retroCreateState: true },
    });

    navigate('/');
  };
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [open, setOpen] = React.useState(false);
  const [{ user, currentRetro }] = React.useContext(GlobalContext);
  const {
    state: { loading, creatorId, retroName, users, retroId, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const [retroDate, setRetroDate]=React.useState("");
  const componentRef = React.createRef<HTMLDivElement>();
  const navigate = useNavigate();

React.useEffect(()=>{
const longEnUSFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());
  setRetroDate(longEnUSFormatter);
  console.log(longEnUSFormatter, typeof(longEnUSFormatter));
});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: any) => {
    setOpen(false);
    if (value) {
      reset();
    }
  };

  return (
    
    <Box
      style={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* {loading ? (
        <Dialog open={true}>
          <DialogTitle>Loading board...</DialogTitle>
          <DialogContent>
            <Grid container justifyContent="center">
              <CircularProgress />
            </Grid>
          </DialogContent>
        </Dialog>
      ) : null} */}

      {/* <AppBar component="div" color="primary" position="static" elevation={0}>
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid
              item
              xs
              style={{
                display: 'flex',
                flexDirection: 'row',
                ...(isXsUp
                  ? {
                      flexGrow: 3,
                      justifyContent: 'center',
                    }
                  : {}),
              }}
            >
              <Container
                color="inherit"
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                }}
              >
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    maxWidth: '40vw',
                    height: '100%',
                    display: 'block',
                    overflow: 'hidden',
                  }}
                >
                  {retroName}
                </Typography>
              </Container>
            </Grid>
            <Grid item xs sx={{ display: 'flex', justifyContent: 'end' }}>
              {users.map((user, i) =>
                i === 2 ? (
                  <span
                    key={user.userId}
                    style={{ marginLeft: '-8px', zIndex: 2 - i }}
                  >
                    <UserAvatar userNickname={'+' + (users.length - 2)} />
                  </span>
                ) : i < 2 ? (
                  <span style={{ marginLeft: '-8px', zIndex: 2 - i }}>
                    <UserAvatar
                      key={user.userId}
                      userNickname={user.userNickname}
                    />
                  </span>
                ) : null
              )}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar> */}

      {/* <AppBar
        component="div"
        position="static"
        elevation={0}
        sx={{
          zIndex: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          color: '#159ADD',
          padding: '5px 15px',
          fontFamily: 'Helvetica, Arial , sans-serif',
          // alignContent: 'flex-middle',
        }}
      >
        <div
          style={{
            flexDirection: 'column',
            width: '100%',

            display: 'flex',
            fontSize: '18px',
            color: 'black',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop:"15px"
            }}
          >
            <ReactToPrint
              trigger={() => (
                <Button
                  variant="outlined"
                  sx={{
                    ':hover': { background: '#695F9B' },
                    background: '#695F9B',
                    color: '#fff',

                    width: '70px',
                  }}
                >
                  Print
                </Button>
              )}
              content={() => componentRef.current}
            />
            <Button
              // variant="outlined"
              sx={{
                ':hover': { background: '#9EA6AC' },
                marginLeft: '10px',
                color: 'black',
                backgroundColor: '#9EA6AC',
              }}
              onClick={handleClickOpen}
            >
              {' '}
              Create new retro{' '}
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {'Create new retro'}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Warning! You are about to leave this page. Make sure you have
                  printed / saved the retro summary.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  sx={{
                    ':hover': { background: '#9EA6AC' },
                    marginRight: '10px',
                    color: 'black',
                    backgroundColor: '#9EA6AC',
                  }}
                  onClick={() => {
                    handleClose(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    ':hover': { background: '#695F9B' },
                    background: '#695F9B',
                    color: '#fff',
                  }}
                  onClick={() => {
                    handleClose(true);
                  }}
                  autoFocus
                >
                  Create new retro
                </Button>
              </DialogActions>
            </Dialog>
          </div>

          <span
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              display: 'flex',
              fontSize: '22px',
              color: 'black',
              marginTop: '15px',
              marginBottom: '5px',
            }}
          >
            {' '}
            Thank you! Below is the session summary{' '}
          </span>

          <span
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'center',
              display: 'flex',
              fontSize: '16px',
              color: '#727D84',
              marginTop: '5px',
            }}
          >
            Don't forget to print it
          </span>
        </div>
      </AppBar> */}
    
        <Report ref={componentRef} />
      
    </Box>
  );
}
