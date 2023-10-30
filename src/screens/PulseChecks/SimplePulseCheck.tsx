import * as React from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
  useMediaQuery,
  Link,
  Divider,
} from '@mui/material';
import commonStyles from './../../style.module.scss';
import './styles.scss';

import theme from '../../helpers/theme/theme';
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
import useLoadRetro from '../../helpers/hooks/useLoadRetro';
import { BoardActionType } from '../../helpers/statemachine/BoardStateMachine';
import { ContainedButton, TextButton } from '../../components';
import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  CaptionRegularTypography,
  H5SemiBoldTypography,
} from '../../components/CustomizedTypography';
import { UserContext } from '../../contexts/UserContext';
import { BASIC, ENTERPRISE } from '../../constants/applicationConst';

type Props = {
  pulseCheck: any;
};

export default function SimplePulseCheck({ pulseCheck }: Props) {
  const navigate = useNavigate();
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [{ user, currentRetro }, dispatch] = React.useContext(GlobalContext);
  const [gUser] = React.useContext(UserContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);
  const {
    state: { fullPulseCheck, users },
    commitAction,
  } = React.useContext(BoardContext);

  const [showBlankErrors, setShowBlankErrors] = React.useState(false);
  const selectedQuestions =
    pulseCheck && pulseCheck.value.map((q: string) => React.useState(-1));
  const [scrollDownButton, setScrollDownButton] = React.useState(true);
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
        if(gUser?.azureUser?. roleName ===ENTERPRISE){
          navigate('/enterprise/sessions/board/' + currentRetro?.id);
        }
       else if(gUser?.azureUser?. roleName ===BASIC){
          navigate('/basic/sessions/board/' + currentRetro?.id);
        }
        else{
          navigate('/board/' + currentRetro?.id);
        }
        
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
        if(gUser?.azureUser?. roleName ===ENTERPRISE){
          navigate('/enterprise/sessions/board/' + currentRetro?.id);
        }
       else if(gUser?.azureUser?. roleName ===BASIC){
          navigate('/basic/sessions/board/' + currentRetro?.id);
        }
       
        else {

          navigate('/board/' + currentRetro?.id);}
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


      if(gUser?.azureUser?. roleName ===ENTERPRISE){
        navigate('/enterprise/sessions/board/' + currentRetro?.id);
      }
     else if(gUser?.azureUser?. roleName ===BASIC){
        navigate('/basic/sessions/board/' + currentRetro?.id);
      }
     
      else navigate('/board/' + currentRetro?.id);


  
  
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
        if(gUser?.azureUser?. roleName ===ENTERPRISE){
          navigate('/enterprise/sessions/board/' + currentRetro?.id);
        }
       else if(gUser?.azureUser?. roleName ===BASIC){
          navigate('/basic/sessions/board/' + currentRetro?.id);
        }
       
        else navigate('/board/' + currentRetro?.id);
       
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
          height: 'calc(100vh - 70px)',
        }}
      >
        {/* Let's start with a quick Pulse Check to see how you are feeling Text */}
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
            <BodyRegularTypography
              label={
                "Let's start with a quick Pulse Check to see how you are feeling"
              }
              style={{ color: '#343434', textAlign: 'center' }}
            />
          </Box>
        </Grid>
        {/* Your identity will be confidential Text */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
              background: 'white',
              marginTop: isXsUp ? '16px' : '36px',
            }}
          >
            <CaptionRegularTypography
              label={'Your identity will be confidential'}
              style={{ color: '#EE7538', textAlign: 'center', opacity: '0.8' }}
            />
          </Box>
        </Grid>
        {/* Pulse bar Image */}
        {!isXsUp ? (
          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: isXsUp ? '16px' : '64px',
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
              marginTop: isXsUp ? '80px' : '180px',
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
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                      }}
                    >
                      <BodySemiBoldTypography label={question} />
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
                    </Box>
                    {/* Image Part */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: isXsUp ? '32px' : '48px',
                      }}
                    >
                      {/* Sad */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
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
                            marginLeft: !isXsUp ? '-50px' : '-44px',
                            marginTop: !isXsUp ? '0px' : '5px',
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
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: !isXsUp ? '64px' : '52px',
                          height: !isXsUp ? '64px' : '52px',
                        }}
                      >
                        <Box
                          style={{
                            backgroundImage: 'url(' + neutral + ')',
                            width: '40px',
                            height: '40px',
                          }}
                          onClick={() => {
                            selectedQuestions[index][1](2);
                            setPulseBar(index);
                          }}
                        ></Box>
                        <img
                          src={neutralMask}
                          style={{
                            marginLeft: !isXsUp ? '-50px' : '-44px',
                            marginTop: !isXsUp ? '0px' : '5px',
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
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
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
                            marginLeft: !isXsUp ? '-50px' : '-44px',
                            marginTop: !isXsUp ? '0px' : '5px',
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
                    {isXsUp && index != 2 && (
                      <Divider
                        color="#E3E3E3"
                        style={{
                          width: '100%',
                          marginTop: '32px',
                          marginBottom: '32px',
                        }}
                      />
                    )}
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
              marginTop: isXsUp ? '16px' : '180px',
            }}
          >
            <ContainedButton
              name="Submit and go to retro"
              onClick={submitPulseCheck}
              style={{
                minWidth: '260px !important',
                height: '36px !important',
              }}
              size={'medium'}
            />
          </Box>
        </Grid>
        {/* Skip Pulse Check button */}
        <Grid
          item
          xs={12}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <TextButton
            id={'Skip_Pulse_Check'}
            label={'Skip Pulse Check'}
            onClick={skipPulseCheck}
            size={'medium'}
            style={{
              marginTop: isXsUp ? '24px' : '40px',
              textDecorationLine: 'underline',
            }}
          />
        </Grid>
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
          <BodySemiBoldTypography
            label={popupTitle}
            style={{ textAlign: 'center', color: '#EE7538' }}
          />
        </DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <H5SemiBoldTypography
            label={popupContent}
            style={{
              textAlign: 'justifyContent',
              color: '#676767',
              lineHeight: '24px',
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <ContainedButton
            name="close"
            onClick={handleClose}
            style={{
              width: '100%',
              minHeight: '44px',
            }}
            size={'medium'}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
