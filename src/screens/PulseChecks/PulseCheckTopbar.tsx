import {
  Box,
  Button,
  Link,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import React from 'react';
import BACILogo from '../../assets/img/bacilogobeta.svg';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import theme from '../../theme/theme';
import { RetroDetails } from '../RetroDetails';
import Avatar from '../../elements/Avatar';

const PulseCheckTopbar = (props: any) => {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const [{ currentRetro, user, loadingFlag }] = React.useContext(GlobalContext);
  const {
    state: { retroName, ended },
    commitAction,
  } = React.useContext(BoardContext);
  const [localRetroName, setLocalRetroName] = React.useState(
    currentRetro?.name
  );

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [anchorE2, setAnchorE2] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const openMenu = Boolean(anchorE2);
  const id = open ? 'simple-popover' : undefined;
  const [showSummaryButton, setShowSummaryButton] = React.useState(false);

  React.useEffect(() => {
    if (retroName && retroName !== '') setLocalRetroName(retroName);
  }, [retroName]);

  React.useEffect(() => {
    if (!loadingFlag && ended) {
      setShowSummaryButton(true);
    }
  }, [loadingFlag, ended]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
          paddingLeft: isXsUp ? '16px' : '56px',
          paddingRight: isXsUp ? '16px' : '56px',
          paddingTop: isXsUp ? '14px' : 0,
          paddingBottom: isXsUp ? '14px' : 0,
          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)!important',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link href="/">
          <img
            src={BACILogo}
            alt="Logo"
            style={{
              width: isXsUp ? '53px' : '108px',
              height: isXsUp ? '18px' : '48px',
            }}
          />
        </Link>
        {/* Name text Field */}
        {currentRetro?.name && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: 'calc(100% - 512px)',
            }}
          >
            {user.userType == 2 && !ended ? (
              <Tooltip title={localRetroName + ''}>
                <TextField
                  fullWidth
                  sx={{
                    fieldset: { border: 'none' },
                    color: '#2C69A1',
                    width: isXsUp ? '150px' : '270px',
                    minWidth: isXsUp ? '150px' : '270px',
                    marginLeft: isXsUp ? '10px' : '34px',
                    overflow: 'hidden !important',
                    textOverflow: 'ellipsis',
                    div: { padding: 0, position: 'initial' },
                    '& .MuiInputBase-input': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                  }}
                  InputProps={{
                    style: {
                      fontSize: isXsUp ? '16px' : 24,
                      color: '#2C69A1',
                      width: '250px',
                      borderBottom: '0px solid!important',
                      overflow: 'hidden !important',
                      textOverflow: 'ellipsis',
                    },
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
              </Tooltip>
            ) : (
              <Typography
                noWrap
                sx={{
                  color: '#2C69A1',
                  ag: 'H3',
                  marginLeft: isXsUp ? '10px' : '34px',
                  fontSize: isXsUp ? '16px!important' : '24px!important',

                  minWidth: isXsUp ? '150px' : '250px',
                  maxWidth: isXsUp ? '150px' : '250px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'inline-block',
                }}
              >
                {localRetroName}
              </Typography>
            )}
            {/* Code and Pop Over */}
            {!isXsUp && (
              <>
                <span style={{ width: '220px', display: 'flex' }}>
                  <Typography
                    sx={{
                      fontSize: '20px',
                      color: '#2C69A1',
                      width: user.userType == 2 ? '150px' : '150px',
                    }}
                  >
                    Code : {currentRetro?.humanId}
                  </Typography>
                  <Button
                    aria-describedby={id}
                    sx={{ borderRadius: '25%' }}
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
                    <RetroDetails
                      popover={true}
                      close={handleClose}
                    ></RetroDetails>
                  </Popover>
                </span>
              </>
            )}
          </Box>
        )}
        <Box component="span" sx={{ flex: '1 1 auto' }}></Box>

        {isXsUp ? (
          <>
            <Button
              aria-describedby={id}
              sx={{
                borderRadius: '25%',
                marginLeft: '15px',
                position: 'initial',
              }}
              onClick={handleClick1}
            >
              <img src="/svgs/MobileMenu.svg" />
            </Button>

            <Menu
              anchorEl={anchorE2}
              id="account-menu"
              open={openMenu}
              onClose={() => setAnchorE2(null)}
              onClick={() => setAnchorE2(null)}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                sx={{ width: '250px', display: 'flex', flexDirection: 'row' }}
              >
                <Avatar
                  avatar={user?.avatar}
                  onClickAvatar={() => {}}
                  css={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                  }}
                ></Avatar>
                <Typography
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    maxWidth: '150px',
                    width: '150px',
                  }}
                >
                  {user?.name}
                </Typography>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Tooltip title={user?.name + ''}>
            <span>
              {user?.avatar && (
                <Avatar
                  avatar={user?.avatar}
                  onClickAvatar={() => {}}
                  css={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    border: 'none',
                  }}
                ></Avatar>
              )}
            </span>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default PulseCheckTopbar;
