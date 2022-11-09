import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
  Typography,
} from '@mui/material';
import {
  FEATURE_FLAGS,
  FEEDBACK_QUESTIONS,
  FEEDBACK_QUESTIONS_COLORS,
  FEEDBACK_QUESTIONS_FILLED,
  FEEDBACK_QUESTIONS_OUTLINE,
} from '../constants';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import commonStyles from './../style.module.scss';
import './../global.scss';
import React from 'react';
import { display } from '@mui/system';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { BoardContext } from '../contexts/BoardContext';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { FeedbackEntry } from '../types';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { useNavigate } from 'react-router-dom';
import closeImage from '../assets/img/Vectorclose.png'
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '6px',
  borderRadius: '4px',
  marginTop: '32px',
  marginLeft: '100px',
  width: '600px',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

export default function FeedbackPopup(props: { show: boolean;  }) {
  const [index, setIndex] = React.useState(0);
  const qs = FEEDBACK_QUESTIONS.map(q => React.useState(0));
  const { commitAction } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const { setConfirmAction } = React.useContext(ConfirmContext);
  const [barvalue, setbarvalue] = React.useState(0);
  const navigate = useNavigate();
  
  const handleNext = () => {
    let newIndex = index + 1;
    setIndex(newIndex);
  }
  const handlePrevious = () => {
    let newIndex = index - 1;
    setIndex(newIndex);
  }
  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(
      actionName as BoardActionType,
      { parameters, userId: global.user.id },
      true
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
            message:
              'Your feedback has been successfully submitted. Thank you!',
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
    const closeFeedback = () =>{
        navigate(`/offboarding`);
    }
  return (
    <Dialog
      open={props.show}
      keepMounted
      PaperProps={{
        sx: {
          width: '800px',
          maxWidth: '800px',
          height: '400px',
          maxHeight: '400px',
          overflowY: 'hidden'
        },
      }}
      sx={{
        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
        borderRadius: '20px',
      }}
      aria-describedby="alert-dialog-slide-description"
    >
        <Box sx={{display: 'flex', justifyContent:'flex-end'}} mr='23px' mt='23px'>
            <img src={closeImage} onClick={closeFeedback}></img>
        </Box>
      <DialogTitle
        mt="20px"
        variant="h3"
        color={commonStyles.secondaryMain}
        textAlign="center"
        p="0px !important"
      >
        Please help facilitator with your feedback
      </DialogTitle>
      <Typography className="identityWillbeConfidentialText">
        Your identity will be confidential
      </Typography>
      <BorderLinearProgress variant="determinate" value={barvalue} />
      <DialogContent
        sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' , overflowY: 'hidden'}}
      >
        <Box>
          <Box>
            <Typography
              variant="h4"
              mt="32px"
              width="488px"
              height="56px"
              id="alert-dialog-slide-description"
            >
              {FEEDBACK_QUESTIONS[index]}
            </Typography>
          </Box>
          <Box
            sx={{
              width: '216px',
              height: '40px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              marginLeft: '25%'
            }}
          >
            {[1, 2, 3, 4, 5].map(i => (
              <Button
                sx={{
                  color: FEEDBACK_QUESTIONS_COLORS[index],
                  minWidth: 0,
                }}
                onClick={() =>{qs[index][1](i); setbarvalue(barvalue + 100/qs.length)} }
                onTouchStart={() => qs[index][1](i)}
              >
                {i > qs[index][0]
                  ? FEEDBACK_QUESTIONS_OUTLINE[index]
                  : FEEDBACK_QUESTIONS_FILLED[index]}
              </Button>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%'}}>
        {index >= 1 &&
            <Button className='popupPrevBtn' onClick={handlePrevious}>Previous</Button>
        }
        {!(index === FEEDBACK_QUESTIONS_COLORS.length-1) &&
            <Button className='popupNextBtn' onClick={handleNext}>Next</Button>
        }
         {(index === FEEDBACK_QUESTIONS_COLORS.length-1) &&
             <Button
             variant="outlined"
             className="submitfeedback"
             onClick={submitFeedback}
           >
             <span className="secondaryButtonText">Submit Feedback</span>
           </Button>
        }
     
        </Box>
        
        
      </DialogActions>
    </Dialog>
  );
}


