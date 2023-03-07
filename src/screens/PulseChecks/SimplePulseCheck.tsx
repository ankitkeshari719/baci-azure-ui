import * as React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
  Link,
  styled,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';
import commonStyles from './../../style.module.scss';
import './styles.scss';
import theme from '../../theme/theme';
import * as Icons from 'heroicons-react';

import Bluepulse from '../../assets/img/bluepulse.png';
import Greypulse from '../../assets/img/greypulse.png';
import happy from '../../assets/img/happy.png';
import sad from '../../assets/img/sad.png';
import neutral from '../../assets/img/neutral.png';
import happyMask from '../../assets/img/Happy_Mask.png';
import sadMask from '../../assets/img/sad_mask.png';
import neutralMask from '../../assets/img/Neutral_Mask.png';
import { BoardContext } from '../../contexts/BoardContext';
import { useNavigate } from 'react-router-dom';
import { ConfirmContext } from '../../contexts/ConfirmContext';
import { GlobalContext, ActionType } from '../../contexts/GlobalContext';
import useLoadRetro from '../../hooks/useLoadRetro';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { ContainedButton } from '../../components';

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

type Props = {
  pulseCheck: any;
};

export default function SimplePulseCheck({ pulseCheck }: Props) {
  const navigate = useNavigate();
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [{ user, currentRetro }, dispatch] = React.useContext(GlobalContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);
  const {
    state: { fullPulseCheck, users },
    commitAction,
  } = React.useContext(BoardContext);

  const [showBlankErrors, setShowBlankErrors] = React.useState(false);
  const selectedQuestions =
    pulseCheck && pulseCheck.value.map((q: string) => React.useState(-1));
  const [scrollDownButton, setScrollDownButton] = React.useState(true);
  const [showSharePanel, setShowSharePanel] = React.useState(false);
  const [pulse1, setPulse1] = React.useState(false);
  const [pulse2, setPulse2] = React.useState(false);
  const [pulse3, setPulse3] = React.useState(false);
  const [openHelpPopup, SetOpenHelpPopup] = React.useState(false);
  const scrollableRef = React.useRef<HTMLDivElement>(null);
  const [popupTitle, setPopupTitle] = React.useState('');
  const [popupContent, setPopupContent] = React.useState('');
  useLoadRetro();

  React.useEffect(() => {
    if (
      users.length > 0 &&
      user != undefined &&
      user.id != undefined &&
      user.id != ''
    ) {
      const currentUser: any = users.find(user1 => user1.userId === user.id);
      if (currentUser?.pulseCheckQuestions.length > 0) {
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
        return;
      }
    }

    const gPulseCheckState = sessionStorage.getItem('pulseCheckState');

    if (gPulseCheckState) {
      const parseGPulseCheckState = JSON.parse(gPulseCheckState);
      if (
        parseGPulseCheckState &&
        parseGPulseCheckState.pulseSubmitState &&
        parseGPulseCheckState?.retroId === currentRetro?.id
      ) {
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
      return;
    }
  }, [users, user?.id && user?.id != '']);

  React.useEffect(() => {
    selectedQuestions.forEach((s: ((arg0: number) => void)[]) => {
      s[1](-1);
    });
  }, [fullPulseCheck]);

  React.useEffect(() => {
    onScroll();
  });

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: user.id,
    });
  };

  function setPulseBar(value: any) {
    if (
      (value === 0 && pulse1 == false) ||
      selectedQuestions[value][0] !== -1
    ) {
      setPulse1(true);
    } else if (
      (value = (1 && pulse2 == false) || selectedQuestions[value][0] !== -1)
    ) {
      setPulse2(true);
    } else if (
      (value = (2 && pulse3 == false) || selectedQuestions[value][0] !== -1)
    ) {
      setPulse3(true);
    }
  }

  const onScroll = () => {
    if (scrollableRef.current) {
      setScrollDownButton(
        scrollableRef.current.scrollHeight - 10 >
          scrollableRef.current.scrollTop + scrollableRef.current?.clientHeight
      );
    }
  };

  const handleClose = () => {
    SetOpenHelpPopup(false);
  };

  function setPopupData(index: any) {
    setPopupTitle(pulseCheck && pulseCheck.value[index]);
    setPopupContent(pulseCheck.valueDescription[index]);
  }

  const submitPulseCheck = () => {
    const someBlank =
      selectedQuestions.findIndex((q: number[]) => q[0] === -1) !== -1;
    const submitter = async () => {
      // Submit
      await saveAndProcessAction(BoardActionType.SUBMIT_PULSE_CHECK, {
        questions: selectedQuestions.map((q: any[], i: any) => ({
          id: String(i),
          entry: q[0],
        })),
      });
      setConfirmAction(undefined);
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
      sessionStorage.setItem(
        'pulseCheckState',
        JSON.stringify(pulseCheckState)
      );
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

  const skipPulseCheck = () => {
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

  return (
    <>
      <Grid
        container
        spacing={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isXsUp ? '8px' : '56px',
          overflowY: isXsUp ? 'scroll' : 'auto',
          height: isXsUp ? 'calc(100vh - 192px)' : 'calc(100vh - 64px)',
        }}
      >
        {/* Text one */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              background: 'white',
            }}
          >
            <Typography variant={isXsUp ? 'h6' : 'h4'} className="textOne">
              Let's start with a quick Pulse Check to see how you are feeling
            </Typography>
          </Box>
        </Grid>
        {/* Text two */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              background: 'white',
              marginTop: isXsUp ? '16px' : '40px',
            }}
          >
            <Typography className="textTwo">
              Your identity will be confidential
            </Typography>
          </Box>
        </Grid>
        {/* Pulsebar Image */}
        {!isXsUp ? (
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: isXsUp ? '16px' : '40px',
              }}
            >
              <span
                className={pulse1 ? 'pulseLineBlue' : 'pulseLineGrey'}
              ></span>
              <img src={pulse1 ? Bluepulse : Greypulse}></img>
              <span
                className={pulse2 ? 'pulseLineBlue' : 'pulseLineGrey'}
              ></span>
              <img src={pulse2 ? Bluepulse : Greypulse}></img>
              <span
                className={pulse3 ? 'pulseLineBlue' : 'pulseLineGrey'}
              ></span>
              <img src={pulse3 ? Bluepulse : Greypulse}></img>
              <span
                className={pulse3 ? 'pulseLineBlue' : 'pulseLineGrey'}
              ></span>
            </Box>{' '}
          </Grid>
        ) : null}
        {/* QUICK PULSE CHECK QUESTIONS Section */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: isXsUp ? 'column' : 'row',
              marginTop: isXsUp ? '16px' : '40px',
            }}
          >
            {pulseCheck &&
              pulseCheck.value.map((question: any, index: any) => (
                <Grid
                  item
                  xs={12}
                  lg={4}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  key={index}
                >
                  <Box>
                    {/* Question Part */}
                    <Typography className="question">
                      {question}
                      {isXsUp ? (
                        <Icons.QuestionMarkCircleOutline
                          size={20}
                          color={commonStyles.secondaryMain}
                          style={{
                            marginBottom: '-5px',
                            marginLeft: '5px',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            SetOpenHelpPopup(true);
                            setPopupData(index);
                          }}
                        />
                      ) : (
                        <Tooltip
                          placement="top"
                          title={pulseCheck.valueDescription[index]}
                        >
                          <Icons.QuestionMarkCircleOutline
                            size={20}
                            color={commonStyles.secondaryMain}
                            style={{ marginBottom: '-5px', marginLeft: '5px' }}
                          />
                        </Tooltip>
                      )}
                    </Typography>
                    {/* Image Part */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: isXsUp ? '24px' : '48px',
                      }}
                    >
                      {/* Sad */}
                      <Box
                        sx={{
                          width: !isXsUp ? '64px' : '52px',
                          height: !isXsUp ? '64px' : '52px',
                        }}
                      >
                        <Box
                          style={{
                            backgroundImage: 'url(' + sad + ')',
                            width: '40px',
                            height: '40px',
                          }}
                          onClick={() => {
                            selectedQuestions[index][1](1);
                            setPulseBar(index);
                          }}
                        ></Box>
                        <img
                          src={sadMask}
                          style={{
                            marginLeft: !isXsUp ? '-10px' : '-6px',
                            marginTop: !isXsUp ? '-50px' : '-45px',
                            width: !isXsUp ? '64px' : '52px',
                            height: !isXsUp ? '64px' : '52px',
                            display:
                              selectedQuestions[index][0] === 1
                                ? 'block'
                                : 'none',
                          }}
                        />
                      </Box>
                      {/* Neutral */}
                      <Box
                        sx={{
                          width: !isXsUp ? '64px' : '52px',
                          height: !isXsUp ? '64px' : '52px',
                        }}
                      >
                        <Box
                          style={{
                            backgroundImage: 'url(' + neutral + ')',
                            width: '40px',
                            height: '40px',
                            marginRight: '32px',
                          }}
                          onClick={() => {
                            selectedQuestions[index][1](2);
                            setPulseBar(index);
                          }}
                        ></Box>
                        <img
                          src={neutralMask}
                          style={{
                            marginLeft: !isXsUp ? '-10px' : '-6px',
                            marginTop: !isXsUp ? '-50px' : '-45px',
                            width: !isXsUp ? '64px' : '52px',
                            height: !isXsUp ? '64px' : '52px',
                            display:
                              selectedQuestions[index][0] === 2
                                ? 'block'
                                : 'none',
                          }}
                        ></img>
                      </Box>
                      {/* Happy */}
                      <Box
                        sx={{
                          width: !isXsUp ? '64px' : '52px',
                          height: !isXsUp ? '64px' : '52px',
                        }}
                      >
                        <Box
                          style={{
                            backgroundImage: 'url(' + happy + ')',
                            width: '40px',
                            height: '40px',
                          }}
                          onClick={() => {
                            selectedQuestions[index][1](3);
                            setPulseBar(index);
                          }}
                        ></Box>
                        <img
                          src={happyMask}
                          style={{
                            marginLeft: !isXsUp ? '-10px' : '-6px',
                            marginTop: !isXsUp ? '-50px' : '-45px',
                            width: isXsUp ? '52px' : '64px',
                            height: isXsUp ? '52px' : '64px',
                            display:
                              selectedQuestions[index][0] === 3
                                ? 'block'
                                : 'none',
                          }}
                        ></img>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
          </Box>
        </Grid>
        {/* Submit and go to retro button */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: isXsUp ? '16px' : '40px',
            }}
          >
            <ContainedButton
              name="Submit and go to retro"
              onClick={submitPulseCheck}
              style={{
                minWidth: '260px !important',
                height: '36px !important',
              }}
            />
          </Box>
        </Grid>
        {/* Skip Pulse Check button */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              cursor: 'pointer',
              marginTop: isXsUp ? '24px' : '0px',
            }}
          >
            <Link className="infoLink" onClick={skipPulseCheck}>
              Skip Pulse Check
            </Link>
          </Box>
        </Grid>
        <Dialog open={openHelpPopup} onClose={handleClose}>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '24px',
            }}
          >
            <Typography variant="h6" color={commonStyles.secondaryMain}>
              {popupTitle}
            </Typography>
          </DialogTitle>
          <DialogContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="h5"
              color={commonStyles.grey60}
              sx={{ textAlign: 'justify' }}
            >
              {popupContent}
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <Button
              variant="outlined"
              className="secondaryButton"
              onClick={handleClose}
              sx={{ width: '100%' }}
            >
              <span className="secondaryButtonText">close</span>
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  );
}
