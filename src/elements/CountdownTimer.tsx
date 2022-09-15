import { BoardContext } from '../contexts/BoardContext';
import {
  Box,
  Button,
  Card,
  Typography,
  keyframes,
  styled,
} from '@mui/material';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Countdown from 'react-countdown';
import Draggable from 'react-draggable';
import { GlobalContext } from '../contexts/GlobalContext';
import Pause from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import { Stop } from '@mui/icons-material';
import { BoardActionType } from '../statemachine/BoardStateMachine';

const RoundButton = styled('button')({
  background: '#159ADD',
  borderRadius: '25px',
  minWidth: 0,
  color: 'white',
  padding: '5px',
  border: '1px solid #159ADD',
  '&:hover': {
    background: 'white',
    color: '#159ADD',
    border: '1px solid #159ADD',
  },
});

const scale = keyframes`
    0 {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
`;

export function CountdownTimer({
  color,
  bold,
}: {
  color: string;
  bold: boolean;
}) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: {
      countdownFrom,
      countdownDuration,
      countdownPaused,
      countdownExpired,
    },
    commitAction,
  } = React.useContext(BoardContext);
  const countdownRef = React.createRef<Countdown>();
  const countdownInBoxRef = React.createRef<Countdown>();
  const [countdownWindowOpen, setCountdownWindowOpen] = React.useState(false);
  const timedelta = React.useRef(0);
  const previousExpired = React.useRef(false);

  const audio = new Audio('../sounds/ding.mp3');

  // Check disabled for now
  const isRetroCreator = () => true; //global.currentRetro?.creatorId === global.user.id;

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  const incrementTimer = async (amount: number) => {
    await saveAndProcessAction(BoardActionType.INCREMENT_TIMER, {
      fromDuration: countdownDuration,
      amount,
    });
  };

  const decrementTimer = async (amount: number) => {
    await saveAndProcessAction(BoardActionType.DECREMENT_TIMER, {
      fromDuration: countdownDuration,
      amount,
    });
  };

  const startTimer = async () => {
    await saveAndProcessAction(BoardActionType.START_TIMER, {
      startTime: Date.now() + timedelta.current,
      duration: countdownDuration,
    });
  };

  const stopTimer = async () => {
    await saveAndProcessAction(BoardActionType.STOP_TIMER, {});
  };

  const pauseTimer = async () => {
    await saveAndProcessAction(BoardActionType.PAUSE_TIMER, {
      remaining: countdownDuration - (Date.now() - countdownFrom),
    });
  };

  const resumeTimer = async () => {
    await saveAndProcessAction(BoardActionType.RESUME_TIMER, {
      from: Date.now() + timedelta.current,
    });
  };

  React.useEffect(() => {
    if (countdownRef && countdownRef.current !== null) {
      if (countdownFrom !== -1 && !countdownPaused) {
        (countdownRef.current as any).start();
      } else {
        (countdownRef.current as any).stop();
      }
    }
    if (countdownInBoxRef && countdownInBoxRef.current !== null) {
      if (countdownFrom !== -1 && !countdownPaused) {
        (countdownInBoxRef.current as any).start();
      } else {
        (countdownInBoxRef.current as any).stop();
      }
    }
  }, [
    countdownRef.current,
    countdownInBoxRef.current,
    countdownFrom,
    timedelta.current,
    countdownDuration,
    countdownPaused,
  ]);

  React.useEffect(() => {
    if (
      !previousExpired.current &&
      countdownExpired &&
      global.user.id === global.currentRetro?.creatorId
    ) {
      audio.play();
    }
    previousExpired.current = countdownExpired;
  }, [countdownExpired]);

  return (
    <>
      <Button
        sx={{ color: color, fontWeight: bold ? '700' : '400' }}
        onClick={async () => {
          isRetroCreator();
          setCountdownWindowOpen(!countdownWindowOpen);
          if (countdownExpired) {
            await saveAndProcessAction(BoardActionType.STOP_TIMER, {});
          }
        }}
      >
        {countdownFrom === -1 && !countdownPaused && !countdownExpired ? (
          <AccessTimeIcon></AccessTimeIcon>
        ) : countdownExpired ? (
          <Typography
            sx={{ display: 'flex', animation: `${scale} 500ms linear 10` }}
          >
            <AccessTimeIcon></AccessTimeIcon>
            {`Time's up!`}
          </Typography>
        ) : (
          <Typography color="inherit" fontWeight="inherit">
            <Countdown
              ref={countdownRef}
              autoStart={false}
              date={
                !countdownFrom || countdownFrom === -1
                  ? Date.now() +
                    (countdownDuration ? countdownDuration : 0) +
                    timedelta.current
                  : countdownFrom + countdownDuration
              }
              now={() => Date.now() + timedelta.current}
              onComplete={async () =>
                await saveAndProcessAction(BoardActionType.EXPIRE_TIMER, {})
              }
              renderer={({ minutes, seconds }) => (
                <span>
                  {minutes}:{seconds < 10 ? '0' + seconds : seconds}
                </span>
              )}
            />
          </Typography>
        )}
      </Button>
      <Draggable>
        <Card
          sx={{
            display: countdownWindowOpen ? '' : 'none',
            position: 'fixed',
            top: '50px',
            left: '40px',
            width: '270px',
            height: '150px',
            zIndex: 300,
            background: 'white',
            borderRadius: 0,
            border: '2px solid #9EA6AC',
          }}
        >
          <Button
            onTouchStart={() => setCountdownWindowOpen(false)}
            onClick={() => setCountdownWindowOpen(false)}
            sx={{
              minWidth: '0',
              border: '1px solid #9EA6AC',
              borderRadius: 0,
              padding: '2px',
              margin: '4px',
            }}
          >
            <CloseIcon sx={{ height: '20px', color: '#4D555A' }} />
          </Button>
          {countdownExpired ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                margin: '10px 20px',
                alignItems: 'center',
              }}
            >
              <Typography
                color="inherit"
                style={{
                  fontSize: '1.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  animation: `${scale} 500ms linear 10`,
                }}
              >
                Time's Up!
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                margin: '10px 20px',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  minHeight: '72px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  color="inherit"
                  style={{
                    fontSize: '1.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {countdownFrom === -1 && !countdownPaused ? (
                    <Button
                      onClick={() => decrementTimer(60 * 1000)}
                      onTouchStart={() => decrementTimer(60 * 1000)}
                    >
                      <RemoveIcon></RemoveIcon>
                    </Button>
                  ) : null}
                  <Countdown
                    ref={countdownInBoxRef}
                    autoStart={false}
                    date={
                      !countdownFrom || countdownFrom === -1
                        ? Date.now() +
                          (countdownDuration ? countdownDuration : 0) +
                          timedelta.current
                        : countdownFrom + countdownDuration
                    }
                    now={() => Date.now() + timedelta.current}
                    renderer={({ minutes, seconds }) => (
                      <span>
                        {minutes}:{seconds < 10 ? '0' + seconds : seconds}
                      </span>
                    )}
                  />
                  {countdownFrom === -1 && !countdownPaused ? (
                    <Button
                      onClick={() => incrementTimer(60 * 1000)}
                      onTouchStart={() => incrementTimer(60 * 1000)}
                    >
                      <AddIcon></AddIcon>
                    </Button>
                  ) : null}
                </Typography>
                <Box style={{ display: 'flex', justifyContent: 'center' }}>
                  {countdownFrom !== -1 || countdownPaused ? (
                    <Button
                      onClick={() => incrementTimer(60 * 1000)}
                      onTouchStart={() => incrementTimer(60 * 1000)}
                    >
                      <Typography
                        style={{
                          background: '#4D555A',
                          color: 'white',
                          borderRadius: '3px',
                          padding: '3px',
                        }}
                      >
                        +1m
                      </Typography>
                    </Button>
                  ) : null}
                  {countdownFrom !== -1 || countdownPaused ? (
                    <Button
                      onClick={() => incrementTimer(5 * 60 * 1000)}
                      onTouchStart={() => incrementTimer(5 * 60 * 1000)}
                    >
                      <Typography
                        style={{
                          background: '#4D555A',
                          color: 'white',
                          borderRadius: '3px',
                          padding: '3px',
                        }}
                      >
                        +5m
                      </Typography>
                    </Button>
                  ) : null}
                </Box>
              </div>
              <Box
                style={{
                  display: 'flex',
                  gap: '6px',
                  maxHeight: '36px',
                  minWidth: '80px',
                }}
              >
                {countdownFrom === -1 && !countdownPaused ? (
                  <RoundButton onClick={startTimer} onTouchStart={startTimer}>
                    <PlayArrowIcon></PlayArrowIcon>
                  </RoundButton>
                ) : (
                  <RoundButton onClick={stopTimer} onTouchStart={stopTimer}>
                    <Stop></Stop>
                  </RoundButton>
                )}
                {countdownFrom !== -1 && !countdownPaused ? (
                  <RoundButton onClick={pauseTimer} onTouchStart={pauseTimer}>
                    <Pause></Pause>
                  </RoundButton>
                ) : null}
                {countdownFrom === -1 && countdownPaused ? (
                  <RoundButton onClick={resumeTimer} onTouchStart={resumeTimer}>
                    <PlayArrowIcon></PlayArrowIcon>
                  </RoundButton>
                ) : null}
              </Box>
            </Box>
          )}
        </Card>
      </Draggable>
    </>
  );
}
