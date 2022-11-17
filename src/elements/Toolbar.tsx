import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import Avatar from './Avatar';
import BACILogo from '../assets/img/bacilogo.png';
import { useLocation } from 'react-router-dom';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { StartRetro } from '../screens/StartRetro';
import PulseCheck from '../screens/PulseCheck';
import { RetroDetails } from '../screens/RetroDetails';
import commonStyles from './../style.module.scss';
// import { ReactComponent as InfoSvg } from '../../public/svgs/Info.svg';
const Toolbar = (props: any) => {
  const [{ avatar, currentRetro, user }] = React.useContext(GlobalContext);

  const location = useLocation();
  const showFinishRetroButton =
    !location.pathname.includes('pulsecheck') &&
    !location.pathname.includes('report') &&
    !location.pathname.includes('startRetro');
  // const [editing, setEditing] = React.useState(true);
  const RETRONAME_CHARACTER_LIMIT = 80;
  const [openDialog, setOpenDialog] = React.useState(false);
  const {
    state: { retroName, retroGoal, retroTimeframe, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const [localRetroName, setLocalRetroName] = React.useState(
    retroName || currentRetro?.name
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handleClick');
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  React.useEffect(() => {
    setLocalRetroName(retroName);
  }, [retroName]);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: user?.id,
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        // padding: '4px',
        // paddingLeft: '56px',
        // paddingRight: '56px',
        flexDirection: 'row',
        width: 'calc(100% - 112px)',
        paddingLeft: '56px',
        paddingRight: '56px',
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)!important',
      }}
    >
      <img
        src={BACILogo}
        alt="Logo"
        style={{
          width: '82px',
          height: '28px',
        }}
      />

      {currentRetro?.name &&
        !location.pathname.includes('startRetro') &&
        (location.pathname.includes('pulsecheck') ||
          window.location.pathname.includes('board')) && (
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            {user.userType == 2 ? (
              <TextField
                multiline
                fullWidth
                InputLabelProps={
                  {
                    // style: { fontSize: 0 },
                  }
                }
                sx={{
                  fieldset: { border: 'none' },
                  color: '#2C69A1',
                  // minWidth: '200px',
                  minWidth: '200px',
                  marginLeft: '34px',
                  div: { padding: 0, position: 'initial' },
                }}
                InputProps={{
                  style: {
                    fontSize: 24,
                    color: '#2C69A1',
                    // borderBottom: 'none!important',
                    borderBottom: '0px solid!important',
                  },

                  // endAdornment: (
                  //   <InputAdornment position="start">
                  //     <Button
                  //       onClick={() => {
                  //         setEditing(false);
                  //       }}
                  //     >
                  //       save
                  //     </Button>
                  //   </InputAdornment>
                  // ),
                }}
                value={localRetroName}
                onChange={e => {
                  setLocalRetroName(e.currentTarget.value);
                }}
                onBlur={async () => {
                  await saveAndProcessAction(
                    BoardActionType.UPDATE_RETRO_DETAILS,
                    {
                      retroName: localRetroName,
                      creatorId: currentRetro.creatorId,
                      userId: user.id,
                    }
                  );
                }}
                onKeyDown={async e => {
                  if (e.keyCode === 13) {
                    await saveAndProcessAction(
                      BoardActionType.UPDATE_RETRO_DETAILS,
                      {
                        retroName: localRetroName,
                        creatorId: currentRetro.creatorId,
                        userId: user.id,
                      }
                    );
                    (e.target as HTMLInputElement).blur();
                  }
                }}
              />
            ) : (
              <Typography
                sx={{
                  color: '#2C69A1',
                  marginLeft: '34px',
                  fontSize: '24px!important',
                  ag: 'H3',
                  minWidth: '350px',
                  maxWidth: '350px',
                }}
                // onClick={() => {
                //   setEditing(true);
                // }}
              >
                {localRetroName}
              </Typography>
            )}

            <Typography
              sx={{
                fontSize: '20px',
                color: '#2C69A1',
                // marginLeft: '66px',
                width: user.userType == 2 ? '270px' : '150px',
              }}
            >
              Code : {currentRetro?.humanId}
            </Typography>
            <Button
              aria-describedby={id}
              sx={{ borderRadius: '25%', marginLeft: '15px' }}
              onClick={handleClick}
            >
              <img src="/svgs/Info.svg" />
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <RetroDetails popover={true} close={handleClose}></RetroDetails>
            </Popover>
          </Box>
        )}

      <Box component="span" sx={{ flex: '1 1 auto' }}></Box>
      {showFinishRetroButton && !ended && (
        <>
          {user.userType == 2 ? (
            <Button
              variant="contained"
              sx={{
                // background: '#159ADD',
                // color: 'white',
                borderRadius: '24px',
                width: '148px',
                height: '44px',
                padding: '10px 20px',
                marginRight: '40px',
                fontWeight: 500,
              }}
              onClick={() => setOpenDialog(true)}
            >
              FINISH RETRO
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                // background: '#159ADD',
                // color: 'white',
                borderRadius: '24px',
                width: '148px',
                height: '44px',
                padding: '10px 20px',
                marginRight: '40px',
                fontWeight: 500,
              }}
              onClick={() => props.onFinishRetro()}
            >
              LEAVE RETRO
            </Button>
          )}
        </>
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle
          id="alert-dialog-title"
          align="center"
          sx={{ background: '/svgs/Finish.svg' }}
        > */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            marginTop: '15px',
          }}
        >
          <span
            style={{
              background: 'url(/svgs/Finish.svg)',
              width: '288px',
              height: '209px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                paddingTop: '100px',
                color: commonStyles.secondaryMain,
                fontSize: '28px',
              }}
            >
              Finish Retro ?
            </span>
          </span>
        </div>

        <DialogContent>
          {/* <DialogContentText
            id="alert-dialog-description"
            color="#343434"
            size="20px"
          > */}
          <span
            style={{
              color: '#343434',
              fontSize: '20px',
              width: '488px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <span> This will end retro for all participants.</span>
            <span> All participants will see feedback screen.</span>
          </span>
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions style={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            sx={{ borderRadius: '24px', fontSize: '16px', marginTop: '15px' }}
            onClick={() => {
              props.onFinishRetro(), setOpenDialog(false);
            }}
            variant="contained"
            autoFocus
          >
            END RETRO AND VIEW SUMMARY
          </Button>
          <Button
            sx={{
              borderRadius: '24px',
              fontSize: '16px',
              marginTop: '15px',
              marginBottom: '15px',
            }}
            variant="outlined"
            onClick={() => setOpenDialog(false)}
          >
            CONTINUE WITH RETRO
          </Button>
        </DialogActions>
      </Dialog>
      <Avatar
        avatar={avatar}
        onClickAvatar={() => {}}
        css={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
        }}
      ></Avatar>
    </Box>
  );
};

export default Toolbar;
