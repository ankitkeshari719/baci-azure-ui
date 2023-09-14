import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
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
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import Avatar from './Avatar';
import BACILogo from '../../assets/img/bacilogobeta.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { BoardContext } from '../../contexts/BoardContext';
import { BoardActionType } from '../../helpers/statemachine/BoardStateMachine';
import { RetroDetails } from '../../screens/Board/RetroDetails';
import commonStyles from './../../style.module.scss';
import SessionEndingMessage from '../atoms/SessionEndingMessage';
import LeaveRetroDialog from '../atoms/LeaveRetroDialog';
import theme from '../../helpers/theme/theme';
import { CountdownTimer } from './CountdownTimer';
import FacilitatorDropDown from './FacilitatorDropDown';
import { ContainedButton } from '../CustomizedButton/ContainedButton';
import { ActionInterface } from '../../helpers/types';
import { Row, Col } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { OutlinedButton } from '../CustomizedButton/OutlinedButton';
import CustomizedDialog from '../CustomizedDialog/CustomizedDialog';
import {
  groupSuggestion,
  keywordExtraction,
  createRetroSummary,
} from '../../helpers/msal/services';
const Toolbar = (props: any) => {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const navigate = useNavigate();
  const location = useLocation();

  const [{ currentRetro, user, leaveRetro, loadingFlag }] =
    React.useContext(GlobalContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: {
      retroName,
      retroDuration,
      ended,
      users,
      actionsData,
      columns,
      retroId,
    },
    commitAction,
  } = React.useContext(BoardContext);
  const reloadPage = () => {
    window.location.reload();
    navigate(`/`);
  };
  const showFinishRetroButton =
    !location.pathname.includes('pulsecheck') &&
    !location.pathname.includes('report') &&
    !location.pathname.includes('startRetro') &&
    !location.pathname.includes('waiting') &&
    !location.pathname.includes('offboarding');

  const [openDialog, setOpenDialog] = React.useState(false);
  const [leaveDiaOpen, setLeaveDiaOpen] = React.useState(false);
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
  const [showSessionEndMessage, setShowSessionEndMessage] =
    React.useState(false);
  const id = open ? 'simple-popover' : undefined;
  const [showSummaryButton, setShowSummaryButton] = React.useState(false);

  // Manage Actions Variables
  const [manageActions, setManageActions] = React.useState<ActionInterface[]>(
    []
  );

  React.useEffect(() => {
    let tempActions = actionsData.actions.map(action => {
      return action;
    });
    const sortedManageActions = [...tempActions].sort(
      (a, b) => b.reacts?.length - a.reacts?.length
    );
    setManageActions([...sortedManageActions]);
  }, [actionsData]);

  React.useEffect(() => {
    if (retroName && retroName !== '') setLocalRetroName(retroName);
  }, [retroName]);

  React.useEffect(() => {
    if (!loadingFlag && ended) {
      setShowSummaryButton(true);
    }
  }, [loadingFlag, ended]);

  React.useEffect(() => {
    if (showFinishRetroButton && !leaveRetro) {
      const timer = setInterval(() => {
        const endTime = retroDuration - 5 * 60 * 1000;
        const currentEpoch = Date.now();

        if (
          endTime <= currentEpoch &&
          !location.pathname.includes('startRetro') &&
          !location.pathname.includes('waiting')
        ) {
          setShowSessionEndMessage(true);
          clearTimeout(timer);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [retroDuration !== 0]);

  const [personName, setPersonName] = React.useState<any[]>([]);
  React.useEffect(() => {
    let valueToBeDisplayed: any[] = [global.currentRetro?.creatorId];

    users.forEach(user => {
      if (user.isFacilitator) {
        valueToBeDisplayed.push(user.userId);
      }
      if (user.isFacilitator && user.userId == global.user.id) {
        dispatch({
          type: ActionType.SET_USER,
          payload: {
            user: {
              id: global.user.id,
              name: global.user.name,
              avatar: global.user.avatar,
              userType: 2,
            },
          },
        });
      } else if (
        !user.isFacilitator &&
        user.userId == global.user.id &&
        user.userId != global.currentRetro?.creatorId
      ) {
        dispatch({
          type: ActionType.SET_USER,
          payload: {
            user: {
              id: global.user.id,
              name: global.user.name,
              avatar: global.user.avatar,
              userType: 1,
            },
          },
        });
      }
    });
    setPersonName(valueToBeDisplayed);
  }, [users]);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: user?.id,
    });
  };

  const assignFacilitatorsRights = async (userId: string) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(BoardActionType.SET_FACILITATOR, {
      userIdFac: userId,
    }).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      error => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
    );
  };

  const onClickOfUser = (val: any, user: any) => {
    assignFacilitatorsRights(user);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          width: '100%',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          gap: '8px',
          paddingLeft: isXsUp ? '16px' : '56px',
          paddingRight: isXsUp ? '16px' : '56px',
          paddingTop: isXsUp ? '14px' : 0,
          paddingBottom: isXsUp ? '14px' : 0,
          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)!important',
        }}
      >
        {/* BACI Logo */}
        {location.pathname.includes('report') ? (
          <>
            <Link href="/">
              <img
                src={BACILogo}
                alt="Logo"
                style={{
                  width: isXsUp ? '53px' : '108px',
                  height: isXsUp ? '18px' : '48px',
                }}
                onClick={reloadPage}
              />
            </Link>
          </>
        ) : (
          isXsUp && (
            <Link href="/">
              <img
                src={BACILogo}
                alt="Logo"
                style={{
                  width: isXsUp ? '53px' : '108px',
                  height: isXsUp ? '18px' : '48px',
                }}
                onClick={reloadPage}
              />
            </Link>
          )
        )}

        {/* Retro Name*/}
        {currentRetro?.name &&
          !location.pathname.includes('startRetro') &&
          !location.pathname.includes('offboarding') &&
          (location.pathname.includes('pulsecheck') ||
            window.location.pathname.includes('board')) && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                width: 'calc(100% - 512px)',
              }}
            >
              {user.userType == 2 && !ended ? (
                // Edit Retro name
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
                // Retro Name
                <Typography
                  noWrap
                  sx={{
                    display: 'inline-block',
                    minWidth: isXsUp ? '150px' : '250px',
                    maxWidth: isXsUp ? '150px' : '250px',
                    color: '#2C69A1',
                    ag: 'H3',
                    marginLeft: isXsUp ? '10px' : '24px',
                    fontSize: isXsUp ? '16px!important' : '24px!important',

                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {localRetroName}
                </Typography>
              )}
              {!isXsUp && (
                <>
                  {/* Code and Info of retro */}
                  <span
                    style={{
                      width: '220px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
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
                  {/* Facilitator dropdown */}
                  {!ended ? (
                    <>
                      {global.user.userType == 2 &&
                        !window.location.pathname.includes('pulsecheck') &&
                        !window.location.pathname.includes('feedback') && (
                          <FacilitatorDropDown
                            personName={personName}
                            onClickOfUser={onClickOfUser}
                          />
                        )}
                    </>
                  ) : null}
                </>
              )}
            </Box>
          )}
        <Box component="span" sx={{ flex: '1 1 auto' }}></Box>
        {/* Finish Button*/}
        {showFinishRetroButton && !ended && (
          <>
            {user.userType == 2 ? (
              <>
                <ContainedButton
                  id="finishRetro"
                  name="FINISH RETRO"
                  onClick={async () => {
                    setOpenDialog(true);

                    let columnString: string = '';
                    columns.forEach(column => {
                      const columnName = column.name;
                      columnString = columnString + columnName;

                      column.groups.forEach(group => {
                        const groupName = group.name;
                        columnString = columnString + ' : ' + groupName;

                        group.cards.forEach(card => {
                          const cardValue = card.value;

                          columnString = columnString + ' : ' + cardValue;
                        });
                      });
                    });

                    await createRetroSummary(columnString, retroId).then(
                      (res: any) => {
                        const data = res.response;
                        if (data) {
                          console.log(data);
                        } else {
                          alert('Please try again');
                        }
                      },
                      error => {
                        console.log(error);
                      }
                    );
                  }}
                  style={{
                    minWidth: '150px !important',
                    width: '150px !important',
                    height: '40px !important',
                    marginRight: '40px',
                    display: isXsUp ? 'none' : 'block',
                  }}
                  size={'medium'}
                />
                {showSessionEndMessage && (
                  <SessionEndingMessage
                    hideSessionEndingMessage={() => {
                      setShowSessionEndMessage(false);
                    }}
                    isXsUp={isXsUp}
                  />
                )}
              </>
            ) : (
              <>
                {!leaveRetro && !isXsUp && (
                  <ContainedButton
                    id="leaveRetro"
                    name="LEAVE RETRO"
                    onClick={() => setLeaveDiaOpen(true)}
                    style={{
                      minWidth: '150px !important',
                      width: '150px !important',
                      height: '40px !important',
                      marginRight: '40px',
                      display: isXsUp ? 'none' : 'block',
                    }}
                    size={'medium'}
                  />
                )}
                {showSessionEndMessage && (
                  <SessionEndingMessage
                    isXsUp={isXsUp}
                    hideSessionEndingMessage={() => {
                      setShowSessionEndMessage(false);
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
        {/*  Retro Finished && View Summary Report Button*/}
        {showSummaryButton &&
          !location.pathname.includes('report') &&
          user.userType === 2 && (
            <>
              <Typography
                style={{
                  color: '#EE7538',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontSize: '28px',
                  fontWeight: '500',
                  lineHeight: '38px',
                  letterSpacing: '0.5px',
                }}
                mr="15px"
              >
                Retro Finished
              </Typography>
              <ContainedButton
                id="view-summary"
                name="VIEW SUMMARY"
                onClick={() => navigate('/report/' + currentRetro?.id)}
                style={{
                  minWidth: '150px !important',
                  height: '40px !important',
                  width: '150px !important',
                  marginRight: '16px',
                }}
                size={'medium'}
              />
            </>
          )}
        {/* Review Board Button*/}
        {location.pathname.includes('report') && ended && (
          <>
            <Typography
              style={{
                color: '#EE7538',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontSize: '28px',
                fontWeight: '500',
                lineHeight: '38px',
                letterSpacing: '0.5px',
              }}
              mr="15px"
            >
              Retro Finished
            </Typography>
            <ContainedButton
              id="review-board"
              name="REVIEW BOARD"
              onClick={() => {
                navigate('/board/' + currentRetro?.id);
              }}
              style={{
                minWidth: '150px !important',
                width: '150px !important',
                height: '40px !important',
                marginRight: '16px',
                position: 'initial',
              }}
              size={'medium'}
            />
          </>
        )}
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
      {/* Leave Retro Button */}
      <Box
        sx={{
          display: isXsUp ? 'flex' : 'none',
          flexDirection: 'row-reverse!important',
          justifyContent: 'space-between',
          width: '100%!important',
          marginTop: '10px',
          marginBottom: isXsUp ? '10px' : 0,
        }}
      >
        {!leaveRetro && showFinishRetroButton && (
          <ContainedButton
            id="leaveRetroIsXsUp"
            name="LEAVE RETRO"
            onClick={() => setLeaveDiaOpen(true)}
            style={{
              minWidth: '150px !important',
              width: '150px !important',
              height: '40px !important',
              marginRight: '16px',
              position: 'initial',
            }}
            size={'medium'}
          />
        )}
        {!ended && (
          <CountdownTimer color={'#2B9FDE'} bold={true}></CountdownTimer>
        )}
      </Box>
      {/* Finish Retro Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            minHeight: '64px',
            background: '#FFFFFF !important',
            borderRadius: '10px',
            border: '1px solid #EDC707',
            padding: '24px',
          },
        }}
      >
        <Box
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
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
              End Retro ?
            </span>
          </span>
        </Box>
        {/* Two Lines */}
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '28px',
          }}
        >
          <span
            style={{
              color: '#343434',
              fontSize: '20px',
              width: '488px',
              textAlign: 'center',
            }}
          >
            This will end retro for all participants.
          </span>
          <span
            style={{
              color: '#343434',
              fontSize: '20px',
              width: '488px',
              textAlign: 'center',
            }}
          >
            {' '}
            All participants will see feedback screen.
          </span>
        </Box>
        {/* Divider */}
        <Divider
          color="#EE7538"
          style={{
            width: '100%',
            border: '1px dashed #EE7538',
            marginTop: '28px',
          }}
        />
        {/* Manage Actions List */}
        <DialogContent sx={{ padding: '12px 24px', margin: '16px 0px' }}>
          {manageActions.length === 0 ? (
            <Box className="d-flex justify-content-center align-items-center">
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  letterSpacing: '0.3px',
                  color: '#EE7538',
                }}
              >
                No Actions Identified!
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box className="d-flex justify-content-center align-items-center">
                <Typography className="textTypeFour">
                  {manageActions.length}
                  {manageActions.length === 1 ? ' Action' : ' Actions'}{' '}
                  Identified
                </Typography>
              </Box>
              <Box sx={{ marginTop: '28px' }}>
                {manageActions.map((action: ActionInterface, index: number) => {
                  const labelId = `action-label-${action.id}`;
                  return (
                    <Row
                      style={{ marginTop: index > 0 ? '16px' : '0px' }}
                      key={labelId}
                    >
                      <Col
                        xs="12"
                        className="d-flex justify-content-start align-items-center"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                            fill="#FBBC05"
                            stroke="#FBBC05"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <Typography
                          color="black"
                          style={{
                            fontWeight: 400,
                            fontSize: '14px',
                            color: '#FBBC05',
                            marginLeft: '6px',
                          }}
                        >
                          {action.reacts.length === 0
                            ? 0
                            : action.reacts.length}
                        </Typography>
                        <Box
                          sx={{
                            marginLeft: '24px',
                          }}
                        >
                          {action?.assigneeAvatar === '' ||
                          action.assigneeAvatar === undefined ? (
                            <LazyLoadImage
                              width="40px !important"
                              height="40px !important"
                              style={{
                                borderRadius: '50%',
                                border: 'none',
                              }}
                              src={'/svgs/DefaultUser.svg'}
                            ></LazyLoadImage>
                          ) : (
                            <Avatar
                              avatar={action?.assigneeAvatar}
                              onClickAvatar={() => {}}
                              css={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: 'none',
                              }}
                            ></Avatar>
                          )}
                        </Box>
                        <Typography
                          style={{ marginLeft: '12px' }}
                          className="actionValue"
                        >
                          {action.value}
                        </Typography>
                      </Col>
                    </Row>
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        {/* Divider */}
        {manageActions.length > 0 && (
          <Divider
            color="#EE7538"
            style={{
              width: '100%',
              border: '1px dashed #EE7538',
            }}
          />
        )}
        <DialogActions
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: '28px',
          }}
        >
          <ContainedButton
            id="END_RETRO_AND_VIEW_SUMMARY"
            name="END RETRO AND VIEW SUMMARY"
            size={'medium'}
            onClick={() => {
              props.onFinishRetro(), setOpenDialog(false);
            }}
          />

          <OutlinedButton
            id=" CONTINUE_WITH_RETRO"
            label=" CONTINUE WITH RETRO"
            size={'medium'}
            onClick={() => setOpenDialog(false)}
          />
        </DialogActions>
      </Dialog>
      {/* Leave Retro Dialog */}
      <CustomizedDialog
        type="success"
        title="Are you done with the retro?"
        subTitle="In case of any doubts, please confirm with facilitator before leaving"
        open={leaveDiaOpen}
        onClose={(value: any) => {
          if (value) props.onFinishRetro();
          setLeaveDiaOpen(false);
        }}
      />
    </Box>
  );
};

export default Toolbar;
