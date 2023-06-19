import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  useMediaQuery,
} from '@mui/material';
import {
  FEATURE_FLAGS,
  FEEDBACK_QUESTIONS,
  FEEDBACK_QUESTIONS_COLORS,
  FEEDBACK_QUESTIONS_FILLED,
  FEEDBACK_QUESTIONS_OUTLINE,
} from '../../constants';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import './../../global.scss';
import React from 'react';
import { BoardActionType } from '../../helpers/statemachine/BoardStateMachine';
import { BoardContext } from '../../contexts/BoardContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { FeedbackEntry } from '../../helpers/types';
import { ConfirmContext } from '../../contexts/ConfirmContext';
import { useNavigate } from 'react-router-dom';
import theme from '../../helpers/theme/theme';
import {
  CaptionRegularTypography,
  H5SemiBoldTypography,
} from '../CustomizedTypography';
import { TextButton } from '../CustomizedButton/TextButton';
import { ContainedButton } from '../CustomizedButton/ContainedButton';
import * as Icons from 'heroicons-react';

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '6px',
  borderRadius: '4px',
  marginTop: '32px',

  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export default function FeedbackPopup(props: {
  show: boolean;
  showThankYou: boolean;
}) {
  React.useState(false);
  const [index, setIndex] = React.useState(0);
  const qs = FEEDBACK_QUESTIONS.map(q => React.useState(0));
  const { commitAction } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);
  const [isBarSet, setIsBarSet] = React.useState(true);
  const [barvalue, setbarvalue] = React.useState(0);
  const [showThankYou, setShowThankYou] = React.useState(false);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const navigate = useNavigate();

  const handleNext = () => {
    let newIndex = index + 1;
    setIndex(newIndex);
    setIsBarSet(true);
  };

  const handlePrevious = () => {
    let newIndex = index - 1;
    setIndex(newIndex);
    setIsBarSet(false);
  };

  function setFeedbackBar(index: number) {
    if (isBarSet && qs[index][0] === 0) {
      setbarvalue(barvalue + 100 / qs.length);
      setIsBarSet(false);
    }
  }

  React.useEffect(() => {
    setShowThankYou(props.showThankYou);
    if (props.showThankYou) {
      setTimeout(() => setShowThankYou(false), 5000);
    }
  }, []);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(
      actionName as BoardActionType,
      { parameters, userId: global.user.id },
      false
    );
  };

  const submitFeedback = async () => {
    await saveAndProcessAction(BoardActionType.SUBMIT_FEEDBACK, {
      feedback: qs.map(
        (q, i) =>
          ({
            id: '' + i,
            entry: '' + q[0],
          } as FeedbackEntry)
      ),
    });
    dispatch({
      type: ActionType.SET_SNACK_MESSAGE,
      payload: {
        snackMessage: {
          message: 'Your feedback has been successfully submitted. Thank you!',
          snackMessageType: 'success',
        },
      },
    });
    setConfirmAction(undefined);
    if (
      FEATURE_FLAGS.report &&
      global.currentRetro?.creatorId === global.user.id
    ) {
      navigate('/report/' + global.currentRetro.id);
    } else {
      navigate(`/offboarding`);
    }
  };

  const closeFeedback = () => {
    navigate(`/offboarding`);
  };

  return (
    <Dialog
      open={props.show}
      keepMounted
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isXsUp ? '16px' : '16px',
          overflowX: 'hidden',
        },
      }}
      sx={{
        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
        borderRadius: '20px',
      }}
      aria-describedby="alert-dialog-slide-description"
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
        }}
      >
        <Icons.X
          size={20}
          style={{
            cursor: 'pointer',
          }}
          onClick={closeFeedback}
        />
      </Box>
      {showThankYou ? (
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src="/images/RetroFinish.gif"></img>
          <H5SemiBoldTypography
            label={'The retro is finished!'}
            style={{ color: ' #EE7538' }}
          />
        </DialogContent>
      ) : (
        <>
          <DialogTitle mt="20px">
            {/* Please help facilitator with your feedback text  */}
            <H5SemiBoldTypography
              label={'Please help facilitator with your feedback'}
              style={{ color: ' #EE7538' }}
            />
          </DialogTitle>
          {/* Your identity will be confidential text */}
          <CaptionRegularTypography
            label={'Your identity will be confidential'}
            style={{ color: ' #EE7538', marginTop: '40px' }}
          />
          {/* Bar */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginTop: '32px',
            }}
          >
            <BorderLinearProgress
              variant="determinate"
              value={barvalue}
              style={{
                width: isXsUp ? '80%' : '600px',
              }}
            />
          </Box>
          {/* Feedback Question and Rating */}
          <DialogContent
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              textAlign: 'center',
              marginTop: '48px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <H5SemiBoldTypography
                label={FEEDBACK_QUESTIONS[index]}
                style={{ color: '#343434' }}
              />
              <Box
                sx={{
                  width: '216px',
                  height: '40px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: !isXsUp ? '48px' : '24px',
                }}
              >
                {[1, 2, 3, 4, 5].map(i => (
                  <Button
                    sx={{
                      color: FEEDBACK_QUESTIONS_COLORS[index],
                      minWidth: 0,
                    }}
                    onClick={() => {
                      qs[index][1](i);
                      setFeedbackBar(index);
                    }}
                  >
                    {i > qs[index][0]
                      ? FEEDBACK_QUESTIONS_OUTLINE[index]
                      : FEEDBACK_QUESTIONS_FILLED[index]}
                  </Button>
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ width: '100%' }}>
            {!isXsUp ? (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: index >= 1 ? 'space-between' : 'flex-end',
                }}
                m="20px"
              >
                {index >= 1 && (
                  <TextButton
                    id={'Previous'}
                    label={'Previous'}
                    size={'small'}
                    onClick={handlePrevious}
                  />
                )}
                {!(index === FEEDBACK_QUESTIONS_COLORS.length - 1) ? (
                  <TextButton
                    id={'Next'}
                    label={'Next'}
                    size={'small'}
                    onClick={handleNext}
                  />
                ) : (
                  <ContainedButton
                    id="Submit_Feedback"
                    name="Submit Feedback"
                    onClick={submitFeedback}
                    size={'small'}
                  />
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: index >= 1 ? 'space-between' : 'flex-end',
                  alignItems: 'center',
                  flexDirection: !(index >= 1) ? 'row' : 'row-reverse',
                }}
              >
                {!(index === FEEDBACK_QUESTIONS_COLORS.length - 1) ? (
                  <TextButton
                    id={'Next'}
                    label={'Next'}
                    size={'small'}
                    onClick={handleNext}
                  />
                ) : (
                  <ContainedButton
                    id="Submit_Feedback"
                    name="Submit Feedback"
                    onClick={submitFeedback}
                    size={'small'}
                  />
                )}

                {index >= 1 && (
                  <TextButton
                    id={'Previous'}
                    label={'Previous'}
                    size={'small'}
                    onClick={handlePrevious}
                  />
                )}
              </Box>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
