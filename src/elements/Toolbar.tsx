import {
  Box,
  Button,
  InputAdornment,
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
const Toolbar = () => {
  const [{ avatar, currentRetro, user }] = React.useContext(GlobalContext);
  const location = useLocation();
  const [editing, setEditing] = React.useState(false);
  const RETRONAME_CHARACTER_LIMIT = 80;
  const {
    state: { retroName, retroGoal, retroTimeframe },
    commitAction,
  } = React.useContext(BoardContext);
  const [localRetroName, setLocalRetroName] = React.useState(
    retroName || currentRetro?.name
  );
  React.useEffect(() => {
    setLocalRetroName(retroName);
  }, [retroName]);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: user.id,
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        // paddingLeft: '56px',
        // paddingRight: '56px',
        flexDirection: 'row',
        width: 'calc(100% - 0px)',
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
        (location.pathname.includes('pulsecheck') || 
          window.location.pathname.includes('board')) && (
          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            {currentRetro?.creatorId===user.id ? (
              <TextField
                multiline
                fullWidth
                InputLabelProps={{
                  style: { fontSize: 0 },
                }}
                
                sx={{
                  fieldset: { border: 'none' },
                  color: '#2C69A1',
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
                    }
                  );
                }}
                onKeyDown={async e => {
                  if (e.keyCode === 13) {
                    await saveAndProcessAction(
                      BoardActionType.UPDATE_RETRO_DETAILS,
                      {
                        retroName: localRetroName,
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
                  minWidth: '200px',
                }}
                onClick={() => {
                  setEditing(true);
                }}
              >
                {localRetroName}
              </Typography>
            )}

            <Typography
              sx={{ fontSize: '20px', color: '#2C69A1', marginLeft: '66px',display:'flex', width:'300px' }}
            >
              Code: {currentRetro?.humanId}
            </Typography>
          </Box>
        )}
      <Box component="span" sx={{ flex: '1 1 auto' }}></Box>
      <Avatar
        avatar={avatar}
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
