import {
  AppBar,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Link,
  Slide,
  styled,
  Switch,
  Toolbar,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
  useMediaQuery,
} from '@mui/material';
import {
  PULSE_CHECK_QUESTIONS,
  PULSE_CHECK_QUESTIONS_INFO,
  QUICK_PULSE_CHECK_QUESTIONS,
  QUICK_PULSE_CHECK_QUESTIONS_INFO,
} from '../constants';
import { BoardContext } from '../contexts/BoardContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';

import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import SharePanel from '../elements/SharePanel';
import useLoadRetro from '../hooks/useLoadRetro';
import theme from '../theme/theme';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { PulseCheckSubmitStatus } from '../types';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}>
    {props.children}
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    fontSize: '14px',
  },
}));

export default function PulseCheck() {
  const navigate = useNavigate();

  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));

  const [{ user, currentRetro }, dispatch] = React.useContext(GlobalContext);
  const {
    state: { fullPulseCheck },
    commitAction,
  } = React.useContext(BoardContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);

  const [showBlankErrors, setShowBlankErrors] = React.useState(false);
  const qs = PULSE_CHECK_QUESTIONS.map(q => React.useState(-1));
  const [qsTooltipOpen, setQsTooltipOpen] = React.useState(-1);
  const [introScreen, setIntroScreen] = React.useState<boolean>(true);
  const [scrollDownButton, setScrollDownButton] = React.useState(true);
  const [showSharePanel, setShowSharePanel] = React.useState(false);

  const scrollableRef = React.useRef<HTMLDivElement>(null);
  const questionRef = React.useRef<HTMLDivElement>(null);

  useLoadRetro();

  React.useEffect(() => {
    // console.log(
    //   'gPulseCheckState',

    //   sessionStorage.getItem('pulseCheckState')
    // );
    const gPulseCheckState = sessionStorage.getItem('pulseCheckState');
    if (gPulseCheckState) {
      const parseGPulseCheckState = JSON.parse(gPulseCheckState);
      if (
        parseGPulseCheckState &&
        parseGPulseCheckState.pulseSubmitState &&
        parseGPulseCheckState?.retroId === currentRetro?.id
      ) {
        console.log('already pulse checked');

        navigate('/board/' + currentRetro?.id);
        dispatch({
          type: ActionType.SET_SNACK_MESSAGE,
          payload: {
            snackMessage: {
              snackMessageType: 'warning',
              message: 'You have already submitted the pulse check feedback.',
            },
          },
        });
      }
    }
  }, []);

  const submit = () => {
    const someBlank =
      qs.findIndex(q => q[0] === -1) !== -1 &&
      qs.findIndex(q => q[0] === -1) <
        (fullPulseCheck
          ? PULSE_CHECK_QUESTIONS.length
          : QUICK_PULSE_CHECK_QUESTIONS.length);

    const submitter = async () => {
      // Submit
      await saveAndProcessAction(BoardActionType.SUBMIT_PULSE_CHECK, {
        questions: qs.map((q, i) => ({ id: String(i), entry: q[0] })),
      });
      setConfirmAction(undefined);
      navigate('/board/' + currentRetro?.id);
      dispatch({
        type: ActionType.SET_SNACK_MESSAGE,
        payload: {
          snackMessage: {
            message:
              'Your responses have been successfully submitted. Thank you!',
            snackMessageType: 'success',
          },
        },
      });
      const pulseCheckState = {
        retroId: currentRetro?.id + '',
        pulseSubmitState: true,
      };
      sessionStorage.setItem('pulseCheckState', JSON.stringify(pulseCheckState));
      navigate('/board/' + currentRetro?.id);
    };

    if (someBlank) {
      setShowBlankErrors(true);
      setConfirmAction({
        title: 'Submit',
        text: 'Some questions are blank, are you sure you want to submit?',
        action: 'Submit',
        onConfirm: submitter,
      });
    } else {
      submitter();
    }
  };

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: user.id,
    });
  };

  const skip = () => {
    setConfirmAction({
      title: 'Skip Pulse Check',
      text: 'Are you sure? Your voice matters!',
      action: 'Skip',
      onConfirm: () => {
        navigate('/board/' + currentRetro?.id);
        setConfirmAction(undefined);
      },
    });
  };

  const fullCheckSwitch = () => {
    if (!fullPulseCheck) {
      setConfirmAction({
        title: 'Full Pulse Check',
        text: 'This action will enable Full Pulse Check (7 questions) for All Retro Participants.',
        action: 'Switch',
        onConfirm: async () => {
          await saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
            fullPulseCheck: true,
          });
          setConfirmAction(undefined);
        },
      });
    } else {
      setConfirmAction({
        title: 'Quick Pulse Check',
        text: 'This action will switch All Retro Participants to Quick Pulse Check (3 questions).',
        action: 'Switch',
        onConfirm: async () => {
          await saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
            fullPulseCheck: false,
          });
          setConfirmAction(undefined);
        },
      });
    }
  };

  React.useEffect(() => {
    qs.forEach(s => {
      s[1](-1);
    });
  }, [fullPulseCheck]);

  React.useEffect(() => {
    onScroll();
  });

  const scrollDown = () => {
    scrollableRef.current?.scroll(0, scrollableRef.current?.scrollHeight);
  };

  const onScroll = () => {
    if (scrollableRef.current) {
      setScrollDownButton(
        scrollableRef.current.scrollHeight - 10 >
          scrollableRef.current.scrollTop + scrollableRef.current?.clientHeight
      );
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
      <AppBar component="div" color="primary" position="static" elevation={0}>
        <Toolbar>
          <Grid container spacing={2}>
            <Grid
              item
              xs={!isXsUp && !isSmUp ? 4 : 12}
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <MonitorHeartIcon />
              <Typography
                variant="h6"
                sx={{ paddingLeft: '10px', fontWeight: 'bold' }}
                color="text.white"
                align="center"
              >
                Pulse Check
              </Typography>
            </Grid>

            {!isXsUp && !isSmUp ? (
              <Grid
                item
                xs={4}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    color: 'black',
                    border: '2px #FECE8B solid',
                    padding: '3px',
                    background: 'white',
                  }}
                >
                  Retro Access Code: {currentRetro?.humanId}
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    background: '#FECE8B',
                    color: 'black',
                    padding: '4px',
                    marginLeft: '4px',
                    borderRadius: 0,
                    borderColor: '#FECE8B',
                  }}
                  onClick={() => setShowSharePanel(!showSharePanel)}
                >
                  Share
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </Toolbar>
      </AppBar>

      {showSharePanel ? (
        <Box
          sx={{
            position: 'absolute',
            background: '#88888888',
            top: '46px',
            width: '100vw',
            height: 'calc(var(--app-height) - 46px)',
            display: 'flex',
            zIndex: 22,
          }}
          onClick={() => {
            setShowSharePanel(false);
          }}
        >
          <SharePanel onClose={() => setShowSharePanel(false)} />
        </Box>
      ) : null}

      <Slide direction="up" in={!!introScreen}>
        <Box
          sx={{
            display: !!introScreen ? 'flex' : 'none',
            height: 'var(--app-height)',
            userSelect: 'none',
            background: 'white',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: '20px',
              marginBottom: '40px',
              padding: '20px',
              marginTop: '100px',
            }}
          >
            Let's start with a quick Pulse Check to see how you are feeling
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingTop: '20px',
            }}
          >
            <Button
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#159ADD',
                color: '#fff',
                minWidth: '300px',
                fontSize: '18px',
              }}
              onClick={() => setIntroScreen(false)}
            >
              Go on...
            </Button>
            <Link
              sx={{
                textAlign: 'center',
                cursor: 'pointer',
                marginTop: '20px',
                color: '#727D84',
                textDecorationColor: '#727D84',
                fontSize: '0.9rem',
              }}
              onClick={skip}
            >
              Skip Pulse Check
            </Link>
          </Box>
        </Box>
      </Slide>

      <Slide direction="up" in={!introScreen}>
        <Box
          sx={{
            display: !introScreen ? 'flex' : 'none',
            overflowY: 'scroll',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            userSelect: 'none',
            background: 'white',
          }}
          ref={scrollableRef}
          onScroll={onScroll}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: 'calc(var(--app-height) - 45px)',
              padding: '20px',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Grid container spacing={2} sx={{ display: 'flex', width: '100%' }}>
              {!isXsUp && !isSmUp ? (
                <Grid item xs={2}>
                  &nbsp;
                </Grid>
              ) : null}
              <Grid
                item
                xs={isXsUp || isSmUp ? 12 : 8}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}
                >
                  How have you been feeling at work about...
                </Typography>
              </Grid>
              {!isXsUp && !isSmUp ? (
                <Grid
                  item
                  xs={2}
                  style={{
                    flexDirection: 'row',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                  }}
                >
                  {user.id === currentRetro?.creatorId ? (
                    <FormControlLabel
                      sx={{
                        color: fullPulseCheck ? '#727D84' : '#9EA6AC',
                        'span:nth-child(2)': {
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          maxWidth: '150px',
                        },
                      }}
                      control={
                        <Switch
                          color="info"
                          checked={fullPulseCheck}
                          onChange={fullCheckSwitch}
                        />
                      }
                      label="Full Pulse Check"
                    />
                  ) : null}
                </Grid>
              ) : null}
            </Grid>

            <div
              style={{
                maxWidth: '1000px',
                marginTop: '20px',
                marginBottom: isXsUp ? '0' : '20px',
                border: '1px solid white',
                boxShadow: isXsUp
                  ? 'inset -2px -2px 15px 2px rgba(0,0,0,0.1)'
                  : '',
              }}
            >
              <Grid container sx={{ justifyContent: 'center' }}>
                {(fullPulseCheck
                  ? PULSE_CHECK_QUESTIONS
                  : QUICK_PULSE_CHECK_QUESTIONS
                ).map((question, index) => (
                  <Grid
                    ref={questionRef}
                    item
                    xs={isXsUp ? 12 : 3.8}
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      background: 'none',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      scrollSnapAlign: 'start',
                      borderTop:
                        isXsUp || (index > 2 && index < 6)
                          ? '1px solid lightgray'
                          : '',
                      borderBottom:
                        !isXsUp && index > 2 && index < 6
                          ? '1px solid lightgray'
                          : '',
                      borderLeft:
                        !isXsUp && (index % 3 === 1 || index === 6)
                          ? '1px solid lightgray'
                          : '',
                      borderRight:
                        !isXsUp && (index % 3 === 1 || index === 6)
                          ? '1px solid lightgray'
                          : '',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: isXsUp ? '1rem' : '0.9rem',
                        textAlign: 'center',
                      }}
                    >
                      {index + 1}
                      {isXsUp ? (
                        <>
                          {'/' +
                            (fullPulseCheck
                              ? PULSE_CHECK_QUESTIONS_INFO
                              : QUICK_PULSE_CHECK_QUESTIONS_INFO
                            ).length}
                          <br></br>
                        </>
                      ) : (
                        '.'
                      )}
                      &nbsp;
                      <span>{question}</span>
                      <BootstrapTooltip
                        disableTouchListener
                        open={qsTooltipOpen === index}
                        title={
                          (fullPulseCheck
                            ? PULSE_CHECK_QUESTIONS_INFO
                            : QUICK_PULSE_CHECK_QUESTIONS_INFO)[index]
                        }
                        placement="top"
                        arrow
                      >
                        <Button
                          style={{
                            padding: 0,
                            marginLeft: '10px',
                            minWidth: 0,
                          }}
                          onClick={() =>
                            setQsTooltipOpen(
                              qsTooltipOpen === index ? -1 : index
                            )
                          }
                          onTouchStart={() =>
                            setQsTooltipOpen(
                              qsTooltipOpen === index ? -1 : index
                            )
                          }
                          onMouseEnter={() => setQsTooltipOpen(index)}
                          onMouseLeave={() => setQsTooltipOpen(-1)}
                        >
                          <HelpCenterIcon></HelpCenterIcon>
                        </Button>
                      </BootstrapTooltip>
                    </Typography>
                    <div
                      style={{
                        padding: '10px',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Grid container gap={1} sx={{ justifyContent: 'center' }}>
                        <Grid
                          item
                          xs={3}
                          sx={{ display: 'flex', alignItems: 'flex-end' }}
                        >
                          <Button
                            sx={
                              qs[index][0] === 1
                                ? {
                                    backgroundColor: '#F3715B',
                                    ':hover': { background: '#F3715B' },
                                  }
                                : { ':hover': { background: '#F3715B44' } }
                            }
                            onClick={() => qs[index][1](1)}
                          >
                            <img src="/images/sad-button.png" width="70%" />
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          sx={{ display: 'flex', alignItems: 'flex-end' }}
                        >
                          <Button
                            sx={
                              qs[index][0] === 2
                                ? {
                                    backgroundColor: '#FCB34C',
                                    ':hover': { background: '#FCB34C' },
                                  }
                                : { ':hover': { background: '#FCB34C44' } }
                            }
                            onClick={() => qs[index][1](2)}
                          >
                            <img src="/images/neutral-button.png" width="70%" />
                          </Button>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          sx={{ display: 'flex', alignItems: 'flex-end' }}
                        >
                          <Button
                            sx={
                              qs[index][0] === 3
                                ? {
                                    backgroundColor: '#5BA8DD',
                                    ':hover': { background: '#5BA8DD' },
                                  }
                                : { ':hover': { background: '#5BA8DD44' } }
                            }
                            onClick={() => qs[index][1](3)}
                          >
                            <img src="/images/happy-button.png" width="70%" />
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                    {showBlankErrors && qs[index][0] === -1 ? (
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          color: '#FCB34C',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        This question is blank
                      </Typography>
                    ) : null}
                  </Grid>
                ))}
              </Grid>
            </div>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingTop: '20px',
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  ':hover': { background: '#159ADD' },
                  background: '#159ADD',
                  color: '#fff',
                  minWidth: '300px',
                }}
                onClick={submit}
              >
                Submit & Go to Board
              </Button>
              <Link
                sx={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  margin: '20px 0',
                  color: '#727D84',
                  textDecorationColor: '#727D84',
                  fontSize: '0.9rem',
                }}
                onClick={skip}
              >
                Skip Pulse Check
              </Link>
            </Box>
            {scrollDownButton ? (
              <div
                style={{
                  opacity: scrollDownButton ? 1 : 0,
                  transition: 'opacity 300ms',
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50px',
                  minWidth: '100vw',
                  display: 'flex',
                  alignContent: 'center',
                  justifyContent: 'center',
                  background: 'white',
                }}
              >
                <Button
                  onClick={e => scrollDown()}
                  style={{ minHeight: '30px' }}
                >
                  <KeyboardArrowDownIcon />
                </Button>
              </div>
            ) : null}
          </Box>
        </Box>
      </Slide>
    </Box>
  );
}
