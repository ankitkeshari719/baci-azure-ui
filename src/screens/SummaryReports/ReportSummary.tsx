import React from 'react';
import { Bar } from 'react-chartjs-2';
import { eng, removeStopwords } from 'stopword';
import ReactToPrint from 'react-to-print';
import moment from 'moment';
import * as Icons from 'heroicons-react';
import theme from '../../theme/theme';
import {
  Box,
  Grid,
  Typography,
  styled,
  useMediaQuery,
  Dialog,
  TextField,
  Divider,
  FormHelperText,
} from '@mui/material';
import { Row, Col, Container, Table } from 'react-bootstrap';
import './styles.scss';
import '../../global.scss';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  WORD_CLOUD_IGNORE_WORDS,
  PULSE_CHECK_QUESTIONS,
  QUICK_PULSE_CHECK_QUESTIONS,
  FEEDBACK_QUESTIONS,
} from '../../constants';
import { Question } from '../../elements/PulseCheckChart';
import WordCloud, { Word } from '../../elements/WordCloud';
import { RetroColumn } from '../../elements/RetroColumn';
import { BoardContext } from '../../contexts/BoardContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { ViewParticipants } from './ViewParticipants';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Avatar from '../../elements/Avatar';
import { ContainedButton } from '../../components';
import { addFeedback } from '../../msal/services';
import happy from '../../assets/img/happy.png';
import sad from '../../assets/img/sad.png';
import neutral from '../../assets/img/neutral.png';
import happyMask from '../../assets/img/Happy_Mask.png';
import sadMask from '../../assets/img/sad_mask.png';
import neutralMask from '../../assets/img/Neutral_Mask.png';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { FeedbackSubmitDialog } from './FeedbackSubmitDialog';
import DevelopAction from './DevelopAction';
import DidNotWentWell from './DidNotWentWell';
import WhatWentWell from './WhatWentWellCoulmn';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  scales: {
    x: {
      title: {
        display: true,
        text: '% Response',
        color: '#343434',
      },
      min: 0,
      max: 100,
      ticks: {
        // forces step size to be 50 units
        stepSize: 10,
      },
    },
    y: {
      border: {
        display: false,
      },
      grid: {
        display: false,
        drawOnChartArea: false,
        drawTicks: true,
      },
    },
  },

  elements: {
    bar: {},
  },
  plugins: {
    legend: {
      position: 'right' as const,
    },
  },
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const styles = {
  whatWentWellBox: {
    background: 'rgba(11, 102, 35,0.04)',
    border: '1px solid rgba(11, 102, 35,0.5)',
    borderRadius: '20px',
    height: '392px',
    width: '100% !important',
  },
  whatDidNotWellBox: {
    background: 'rgba(247, 151, 34, 0.04)',
    border: '1px solid rgba(247, 151, 34, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    height: '392px',
    width: '100% !important',
  },
  actionBox: {
    background: 'rgba(138, 56, 245, 0.04)',
    border: '1px solid rgba(138, 56, 245, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    minHeight: '392px',
    width: '100% !important',
  },
  pulseCheckBox: {
    background: 'rgba(52, 52, 52, 0.04)',
    border: '1px solid rgba(52, 52, 52, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    height: '392px',
  },
  facilitatorFeedbackBox: {
    background: 'rgba(52, 52, 52, 0.04)',
    border: '1px solid rgba(52, 52, 52, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    height: '392px',
  },
  textOpacity: {
    opacity: 0.9,
  },
};

export const ReportSummary = React.forwardRef((props, ref) => {
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [feedbackRatings, setFeedbackRatings] = React.useState<{
    sad: number;
    neutral: number;
    happy: number;
  }>({ sad: 0, neutral: 0, happy: 0 });

  let componentRef = React.useRef(null);
  const {
    state: {
      startedDate,
      endedDate,
      columns,
      lastStateUpdate,
      fullPulseCheck,
      users,
      feedbackSubmitted,
      isFeedbackSubmittedByFacilitator,
    },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [timeTaken, setTimeTaken] = React.useState<string>('');

  const [isWellCloudOpen, setIsWellCloudOpen] = React.useState(false);
  const [isNotWellCloudOpen, setIsNotWellCloudOpen] = React.useState(false);
  const [isAllActionOpen, setIsAllAction] = React.useState(false);
  const [isViewParticipantsDialogOpen, setIsViewParticipantsDialogOpen] =
    React.useState(false);
  const [isFeedbackSubmitDialogOpen, setIsFeedbackSubmitDialogOpen] =
    React.useState(false);
  // Column Name
  const [wentWellColumnName, setWentWellColumnName] =
    React.useState<string>('');
  const [didNotWentWellColumnName, setDidNotWentWellColumnName] =
    React.useState<string>('');
  const [actionColumnName, setActionColumnName] = React.useState<string>('');

  // Cloud Data
  const [wentWellWords, setWentWellWords] = React.useState<Word[]>([]);
  const [didNotWentWellWords, setDidNotWentWellWords] = React.useState<Word[]>(
    []
  );
  // Card Data
  const [wentWellCardData, setWentWellCardData] = React.useState<any>([]);
  const [didNotWentWellCardData, setDidNotWentWellCardData] =
    React.useState<any>([]);
  const [actionCardData, setActionCardData] = React.useState<any>([]);
  // Top Voted Card
  const [wentWellTopVotedCards, setWentWellTopVotedCards] = React.useState<any>(
    []
  );
  const [wentWellTopVotedCardsPrint_1, setWentWellTopVotedCardsPrint_1] =
    React.useState<any>([]);
  const [wentWellTopVotedCardsPrint_2, setWentWellTopVotedCardsPrint_2] =
    React.useState<any>([]);
  const [didNotWentWellTopVotedCards, setDidNotWentWellTopVotedCards] =
    React.useState<any>([]);
  const [
    didNotWentWellTopVotedCardsPrint_1,
    setDidNotWentWellTopVotedCardsPrint_1,
  ] = React.useState<any>([]);
  const [
    didNotWentWellTopVotedCardsPrint_2,
    setDidNotWentWellTopVotedCardsPrint_2,
  ] = React.useState<any>([]);
  const [actionTopVotedCards, setActionTopVotedCards] = React.useState<any>([]);
  const [actionLastVotedCards, setActionLastVotedCards] = React.useState<any>(
    []
  );

  // Unique CreatedBy Length
  const [wentWellCreatedBy, setWentWellCreatedBy] = React.useState<number>();
  const [didNotWentWellCreatedBy, setDidNotWentWellCreatedBy] =
    React.useState<number>();
  const [actionCreatedBy, setActionCreatedBy] = React.useState<number>();

  // Submitted Feedback
  const [submittedFeedback, setSubmittedFeedback] = React.useState<string>('');
  const [feedbackError, setFeedbackError] = React.useState('');
  const [retroFeedbackWarning, setFeedbackWarning] = React.useState('');

  const [barData, setBarData] = React.useState<{ 1: any; 2: any; 3: any }[]>(
    []
  );
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [feedback, setFeedback] = React.useState<any | undefined>();
  const [islanded, setIsLanded] = React.useState(true);
  const [retroDate, setRetroDate] = React.useState('');
  const [isActionCopied, setIsActionCopied] = React.useState(false);

  function getBarColor(val: number) {
    if (val > 50) {
      return '#34A853';
    } else if (val == 50) {
      return '#FBBC05 !important';
    } else {
      return '#EA4335';
    }
  }

  const windowWidth = React.useRef(window.innerWidth);
  const windowHeight = React.useRef(window.innerHeight);

  React.useEffect(() => {
    console.log('width: ', windowWidth.current);
    console.log('height: ', windowHeight.current);
  });

  React.useEffect(() => {
    const wentWellCardValues = [] as string[];
    const didNotWentWellCardValues = [] as string[];
    const actionsCardValues = [] as string[];
    let wentWellWordCloudData = [];
    let didNotWentWellWordCloudData = [];
    let wentWellCards: any[] = [];
    let didNotWentWellCards: any[] = [];
    let actionCards: any[] = [];

    // Time Taken
    const seconds = moment(endedDate).diff(moment(startedDate), 'second') % 60;
    const minutes = moment(endedDate).diff(moment(startedDate), 'minutes');
    const hours = moment(endedDate).diff(moment(startedDate), 'hours');
    const days = moment(endedDate).diff(moment(startedDate), 'days');
    const weeks = moment(endedDate).diff(moment(startedDate), 'weeks');

    let timeTaken: string = '';
    if (weeks != 0) {
      timeTaken = timeTaken + weeks + ' ' + 'weeks' + ' ';
    }

    if (days != 0) {
      timeTaken = timeTaken + days + ' ' + 'days' + ' ';
    }
    if (hours != 0) {
      timeTaken = timeTaken + hours + ' ' + 'hours' + ' ';
    }
    if (minutes != 0) {
      timeTaken = timeTaken + minutes + ' ' + 'minutes' + ' ';
    }
    if (seconds != 0) {
      timeTaken = timeTaken + seconds + ' ' + 'seconds';
    }

    setTimeTaken(timeTaken);

    columns.map(column => {
      if (column.id === '0') {
        setWentWellColumnName(column.name);
      }
      if (column.id === '1') {
        setDidNotWentWellColumnName(column.name);
      }
      if (column.id === '2') {
        setActionColumnName(column.name);
      }
    });
    console.log('columns:: ', columns);

    // --------------------------------------------------- What Went Well Data ------------------------------------------------
    columns.forEach(column => {
      if (column.id === '0') {
        column.groups.forEach(group => {
          group.cards.forEach(card => {
            const clean = card.value.replace(/[\W_]+/g, ' ').trim();
            if (clean !== '') wentWellCardValues.push(clean);
          });
        });
      }
    });

    // What Went Well Total
    const wentWellCardValuesTotal = Object.values(wentWellCardValues)
      .join(' ')
      .toLowerCase()
      .split(' ');

    // Getting the what went well word cloud data
    if (wentWellCardValuesTotal.length !== 0) {
      const noStopWords = removeStopwords(wentWellCardValuesTotal, [
        ...eng,
        ...WORD_CLOUD_IGNORE_WORDS,
      ]);

      wentWellWordCloudData = noStopWords
        .reduce((current: { text: string; size: number }[], text: string) => {
          const exist = current.find(c => c.text === text);
          if (exist) {
            exist.size++;
          } else if (text.length > 2) {
            current.push({ text, size: 1 });
          }
          return current;
        }, [])
        .filter((entry: { text: string; size: number }) => entry.size >= 2);
    }
    setWentWellWords(wentWellWordCloudData);

    // What went well Cards Data
    columns.forEach(column => {
      if (column.id === '0') {
        column.groups.forEach(group => {
          group.cards.forEach(card => {
            wentWellCards.push(card);
          });
        });
      }
    });

    wentWellCards.sort(
      (a, b) => parseFloat(b.reacts.length) - parseFloat(a.reacts.length)
    );

    const wentWellUniqueCreatedBy: any[] = wentWellCards
      .map((card: any) => {
        return card.createdBy;
      })
      .filter((item, i, ar) => ar.indexOf(item) === i);
    setWentWellCreatedBy(wentWellUniqueCreatedBy.length);
    setWentWellCardData(wentWellCards);
    setWentWellTopVotedCards(
      windowWidth.current <= 1500
        ? wentWellCards.slice(0, 3)
        : wentWellCards.slice(0, 4)
    );
    setWentWellTopVotedCardsPrint_1(wentWellCards.slice(0, 2));
    setWentWellTopVotedCardsPrint_2(wentWellCards.slice(2, 4));

    // ------------------------------------------------------------- Did Not Went Well Data ---------------------------------------------------------
    columns.forEach(column => {
      if (column.id === '1') {
        column.groups.forEach(group => {
          group.cards.forEach(card => {
            const clean = card.value.replace(/[\W_]+/g, ' ').trim();
            if (clean !== '') didNotWentWellCardValues.push(clean);
          });
        });
      }
    });

    //  Did Not Went Well Total
    const didNotWellCardValuesTotal = Object.values(didNotWentWellCardValues)
      .join(' ')
      .toLowerCase()
      .split(' ');

    // Getting the what went did not well word cloud data
    if (didNotWellCardValuesTotal.length !== 0) {
      const noStopWords = removeStopwords(didNotWellCardValuesTotal, [
        ...eng,
        ...WORD_CLOUD_IGNORE_WORDS,
      ]);

      didNotWentWellWordCloudData = noStopWords
        .reduce((current: { text: string; size: number }[], text: string) => {
          const exist = current.find(c => c.text === text);

          if (exist) {
            exist.size++;
          } else if (text.length > 2) {
            current.push({ text, size: 1 });
          }
          return current;
        }, [])
        .filter((entry: { text: string; size: number }) => entry.size >= 2);
    }
    setDidNotWentWellWords(didNotWentWellWordCloudData);

    // What did not went well Cards Data
    columns.forEach(column => {
      if (column.id === '1') {
        column.groups.forEach(group => {
          group.cards.forEach(card => {
            didNotWentWellCards.push(card);
          });
        });
      }
    });

    didNotWentWellCards.sort(
      (a, b) => parseFloat(b.reacts.length) - parseFloat(a.reacts.length)
    );

    const didNotWentWellUniqueCreatedBy: any[] = didNotWentWellCards
      .map((card: any) => {
        return card.createdBy;
      })
      .filter((item, i, ar) => ar.indexOf(item) === i);
    setDidNotWentWellCreatedBy(didNotWentWellUniqueCreatedBy.length);
    setDidNotWentWellCardData(didNotWentWellCards);
    setDidNotWentWellTopVotedCards(
      windowWidth.current <= 1500
        ? didNotWentWellCards.slice(0, 3)
        : didNotWentWellCards.slice(0, 4)
    );
    setDidNotWentWellTopVotedCardsPrint_1(didNotWentWellCards.slice(0, 2));
    setDidNotWentWellTopVotedCardsPrint_2(didNotWentWellCards.slice(2, 4));

    //---------------------------------------------- Develope Action Cards Data -----------------------------------------------------------
    columns.forEach(column => {
      if (column.id === '2') {
        column.groups.forEach(group => {
          group.cards.forEach(card => {
            actionCards.push(card);
          });
        });
      }
    });

    actionCards.sort(
      (a, b) => parseFloat(b.reacts.length) - parseFloat(a.reacts.length)
    );

    const actionUniqueCreatedBy: any[] = actionCards
      .map((card: any) => {
        return card.createdBy;
      })
      .filter((item, i, ar) => ar.indexOf(item) === i);
    setActionCreatedBy(actionUniqueCreatedBy.length);
    setActionCardData(actionCards);
    setActionTopVotedCards(actionCards.slice(0, 4));

    if (actionCards.length > 4) {
      setActionLastVotedCards(actionCards.slice(4, actionCards.length));
    }

    //Get total count of user submitted the pulsechek
    const newQuestions = [] as Question[];
    const feedbackValues = {} as any;
    const feedbackCount = {} as any;
    let totalPulseCheckCount = 0;
    const questionsDef = fullPulseCheck
      ? PULSE_CHECK_QUESTIONS
      : QUICK_PULSE_CHECK_QUESTIONS;

    users.forEach(user => {
      user.feedback.forEach((feedback, i) => {
        if (parseInt(feedback.entry) !== -1) {
          feedbackValues[feedback.id] =
            (feedbackValues[feedback.id] ? feedbackValues[feedback.id] : 0) +
            parseInt(feedback.entry);

          feedbackCount[feedback.id] =
            (feedbackCount[feedback.id] ? feedbackCount[feedback.id] : 0) + 1;
        }
      });

      user?.pulseCheckQuestions.forEach(question => {
        totalPulseCheckCount = totalPulseCheckCount + 1;
        const text = (questionsDef as any)[question.id];
        const entry = newQuestions.find(nq => nq.question === text);
        if (question.entry !== -1) {
          if (!entry) {
            newQuestions.push({
              question: text,
              1: 0,
              2: 0,
              3: 0,
              [String(question.entry)]: 1,
            } as any);
          } else {
            (entry as any)[String(question.entry)]++;
          }
        }
      });
    });

    if (Object.keys(feedbackValues).length !== 0) {
      setFeedback([feedbackValues, feedbackCount]);
    }

    setQuestions(newQuestions);
    const newArr = newQuestions.map(({ question, ...rest }) => {
      return rest;
    });

    newArr.map(data => {
      data[1] = Math.round((data[1] / totalPulseCheckCount) * 100);
      data[2] = Math.round((data[2] / totalPulseCheckCount) * 100);
      data[3] = Math.round((data[3] / totalPulseCheckCount) * 100);
    });

    let sampleArray: any = [];
    newArr.map(data => {
      return sampleArray.push(Object.values(data));
    });

    let tempArr: any = [];
    if (sampleArray.length === 3) {
      tempArr.push([sampleArray[0][0], sampleArray[1][0], sampleArray[2][0]]);
      tempArr.push([sampleArray[0][1], sampleArray[1][1], sampleArray[2][1]]);
      tempArr.push([sampleArray[0][2], sampleArray[1][2], sampleArray[2][2]]);
    }
    setBarData(tempArr);
  }, [lastStateUpdate]);

  React.useEffect(() => {
    const longEnUSFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
    setRetroDate(longEnUSFormatter);
  });

  const handleIsWellCloudOpen = () => {
    setIsWellCloudOpen(!isWellCloudOpen);
  };

  const handleIsNotWellCloudOpen = () => {
    setIsNotWellCloudOpen(!isNotWellCloudOpen);
  };

  const handleIsActionCloudOpen = () => {
    setIsAllAction(!isAllActionOpen);
  };

  const handleViewParticipantsDialogOpen = () => {
    setIsViewParticipantsDialogOpen(true);
  };

  const handleViewParticipantsDialogClose = () => {
    setIsViewParticipantsDialogOpen(false);
  };

  const handleFeedbackSubmitClose = () => {
    setIsFeedbackSubmitDialogOpen(false);
  };

  // Copy to clipboard
  const copyAllActions = () => {
    const actionValues = actionCardData.map((actionCard: any) => {
      return actionCard.value;
    });
    navigator.clipboard.writeText(actionValues);
    setIsActionCopied(true);
  };

  // On change the text field
  const handleTextFieldChange = (e: React.SetStateAction<string>) => {
    if (e == '') {
      setFeedbackWarning('');
    } else {
      setFeedbackError('');
    }
    if (e.length >= 200) {
      let count = 250 - e.length;

      if (count === 0) {
        setFeedbackWarning('No more character remaining');
      } else {
        setFeedbackWarning('Character remaining -' + `${count}`);
      }
    } else {
      setFeedbackWarning('');
    }
    setSubmittedFeedback(e);
  };

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  // Submit Feedback
  const submitFeedback = async () => {
    if (submittedFeedback === '') {
      setFeedbackError('Please enter feedback message.');
      return;
    }

    let rating: number = 0;
    if (feedbackRatings.sad === 1) {
      rating = 0;
    }
    if (feedbackRatings.neutral === 1) {
      rating = 1;
    }
    if (feedbackRatings.happy === 1) {
      rating = 2;
    }
    if (submittedFeedback) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      saveAndProcessAction(BoardActionType.UPDATE_RETRO_DETAILS, {
        feedbackSubmitted: true,
        isFeedbackSubmittedByFacilitator: 1,
      });
      await addFeedback(
        global.currentRetro?.id as string,
        global.user,
        rating,
        submittedFeedback
      ).then(
        res => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
          setFeedbackError('');
          setIsFeedbackSubmitDialogOpen(true);
        },
        err => {
          console.log('err', err);
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
          dispatch({
            type: ActionType.SET_SNACK_MESSAGE,
            payload: {
              snackMessage: {
                snackMessageType: 'error',
                message: 'Error while submitting the feedback',
              },
            },
          });
          setFeedbackError('');
        }
      );
    }
  };

  return (
    <>
      {/* Start Container */}
      <Container
        fluid
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
          backgroundColor: '#F5F5F5',
          paddingLeft: isXsUp
            ? '8px'
            : windowWidth.current >= 2560
            ? '370px'
            : '56px',
          paddingRight: isXsUp
            ? '8px'
            : windowWidth.current >= 2560
            ? '370px'
            : '56px',
          paddingTop: isXsUp
            ? '8px'
            : windowWidth.current >= 2560
            ? '32px'
            : '16px',
          paddingBottom: isXsUp
            ? '8px'
            : windowWidth.current >= 2560
            ? '32px'
            : '32px',
        }}
      >
        <Box ref={componentRef} id="scrollableDiv">
          {/* Line 1 */}
          <Row id="line_1">
            <Col
              xs="4"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeOne">Report For</Typography>
              <Typography className="textTypeThree" ml={2}>
                {global.currentRetro?.name}
              </Typography>
            </Col>
            <Col
              xs={{ span: 1, offset: 7 }}
              className="d-flex justify-content-end align-items-center"
            >
              <ReactToPrint
                trigger={() => (
                  <Icons.DownloadOutline
                    size={20}
                    color="#4E4E4E"
                    style={{
                      cursor: 'pointer',
                    }}
                  />
                )}
                content={() => componentRef.current}
              />
            </Col>
          </Row>
          {/* Line 1 print */}
          <Row id="line_1_react_print" style={{ display: 'none' }}>
            <Col xs="12">
              <Table striped>
                <tr style={{ border: '1px solid #CCCCCC' }}>
                  <td style={{ border: '1px solid #CCCCCC' }}>
                    <Typography className="textTypeOne">Report For</Typography>
                  </td>
                  <td style={{ border: '1px solid #CCCCCC' }}>
                    <Typography
                      className="textTypeThree"
                      sx={{ textAlign: ' start !important' }}
                    >
                      {global.currentRetro?.name}
                    </Typography>
                  </td>
                </tr>
                <tr style={{ border: '1px solid #CCCCCC' }}>
                  <td style={{ border: '1px solid #CCCCCC' }}>
                    <Typography className="textTypeOne">Date</Typography>
                  </td>
                  <td style={{ border: '1px solid #CCCCCC' }}>
                    <Typography
                      className="textTypeTwo"
                      sx={{ textAlign: ' start !important' }}
                    >
                      {moment(startedDate, 'DD MMM YYYY').format('Do MMM YYYY')}
                    </Typography>
                  </td>
                </tr>
                <tr style={{ border: '1px solid #CCCCCC' }}>
                  <td style={{ border: '1px solid #CCCCCC' }}>
                    <Typography className="textTypeOne">Time Taken</Typography>
                  </td>
                  <td style={{ border: '1px solid #CCCCCC' }}>
                    <Typography
                      className="textTypeTwo"
                      sx={{ textAlign: ' start !important' }}
                    >
                      {timeTaken}
                    </Typography>
                  </td>
                </tr>
                <tr style={{ border: '1px solid #CCCCCC' }}>
                  <td style={{ border: '1px solid #CCCCCC' }}>
                    <Typography className="textTypeOne">
                      No. Of Participants
                    </Typography>
                  </td>
                  <td style={{ border: '1px solid #CCCCCC' }}>
                    <Typography
                      className="textTypeTwo"
                      sx={{ textAlign: ' start !important' }}
                    >
                      {users.length}
                    </Typography>
                  </td>
                </tr>
              </Table>
            </Col>
          </Row>
          {/* Line 2 */}
          <Row id="line_2" style={{ marginTop: '36px' }}>
            <Col
              xs="3"
              lg="2"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeOne">Date</Typography>
              <Typography className="textTypeTwo" ml={2}>
                {moment(startedDate, 'DD MMM YYYY').format('Do MMM YYYY')}
              </Typography>
            </Col>
            <Col
              xs="4"
              lg="3"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeOne">Time Taken</Typography>
              <Typography className="textTypeTwo" ml={2}>
                {timeTaken}
              </Typography>
            </Col>
            <Col
              xs="2"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeOne">
                No. Of Participants
              </Typography>
              <Typography className="textTypeTwo" ml={2}>
                {users.length}
              </Typography>
            </Col>
            <Col
              xs={{ span: 2, offset: 1 }}
              lg={{ span: 2, offset: 3 }}
              className="d-flex justify-content-end align-items-center"
            >
              <Typography
                className="viewParticipants"
                onClick={handleViewParticipantsDialogOpen}
              >
                View Participants
              </Typography>
            </Col>
          </Row>
          {/* Pulse Check Section 1*/}
          <Row style={{ marginTop: '36px' }}>
            <Col
              xs="12"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeFour">
                Participant’s Pulse Check Report
              </Typography>
            </Col>
          </Row>
          {/* Pulse Check Section 2*/}
          <Row style={{ marginTop: '16px' }}>
            {questions.length !== 0 ? (
              <Col
                xs="6"
                className="d-flex justify-content-start align-items-center"
                id="pulse-check-chart"
              >
                <Bar
                  style={{
                    height: '300px',
                    border: 'none',
                  }}
                  options={options}
                  data={{
                    labels: QUICK_PULSE_CHECK_QUESTIONS, // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
                    datasets: [
                      {
                        data: barData[0],
                        label: 'Happy',
                        backgroundColor: '#84CA97',
                      },
                      {
                        data: barData[1],
                        label: 'Neutral',
                        backgroundColor: '#FBBC05',
                      },
                      {
                        data: barData[2],
                        label: 'Sad',
                        backgroundColor: '#F28D85',
                      },
                    ],
                  }}
                ></Bar>
              </Col>
            ) : (
              <>
                <Col
                  xs="12"
                  className="d-flex justify-content-start align-items-center"
                  id="pulse-check-not-data"
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '240px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      background: '#FAFAFA',
                      border: '1px solid #CCCCCC',
                    }}
                  >
                    <Box component="div">
                      <img src="/svgs/LineChart.svg" />
                    </Box>
                    <Box
                      component="div"
                      sx={{ textAlign: 'justify', marginTop: '16px' }}
                    >
                      <Typography className="text1">
                        Sorry, Pulse Check was not selected
                      </Typography>
                    </Box>
                    <Box
                      component="div"
                      sx={{
                        width: '40%',
                        textAlign: 'justify',
                        marginTop: '16px',
                      }}
                    >
                      <Typography>
                        Pulse Check helps the team to quickly understand their
                        feelings about work. Conducting it consistently will
                        help the team to track progress and also to compare &
                        contrast against BACI retro outcomes.
                      </Typography>
                    </Box>
                  </Box>
                </Col>
                <Box
                  id="pulse-check-not-data-print"
                  sx={{ display: 'none !important' }}
                >
                  <Col
                    xs="12"
                    className="d-flex justify-content-start align-items-center"
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '300px',
                        minHeight: '300px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        background: '#FAFAFA',
                        border: '1px solid #CCCCCC',
                      }}
                    >
                      <Box component="div">
                        <img src="/svgs/LineChart.svg" />
                      </Box>
                      <Box
                        component="div"
                        sx={{ textAlign: 'justify', marginTop: '16px' }}
                      >
                        <Typography className="text1">
                          Sorry, Pulse Check was not selected
                        </Typography>
                      </Box>
                      <Box
                        component="div"
                        sx={{
                          width: '40%',
                          textAlign: 'justify',
                          marginTop: '16px',
                        }}
                      >
                        <Typography>
                          Pulse Check helps the team to quickly understand their
                          feelings about work. Conducting it consistently will
                          help the team to track progress and also to compare &
                          contrast against BACI retro outcomes.
                        </Typography>
                      </Box>
                    </Box>
                  </Col>
                </Box>
              </>
            )}
          </Row>
          <WhatWentWell
            wentWellColumnName={wentWellColumnName}
            wentWellCreatedBy={wentWellCreatedBy}
            users={users}
            wentWellWords={wentWellWords}
            handleIsWellCloudOpen={handleIsWellCloudOpen}
            isWellCloudOpen={isWellCloudOpen}
            wentWellTopVotedCards={wentWellTopVotedCards}
            wentWellTopVotedCardsPrint_1={wentWellTopVotedCardsPrint_1}
            wentWellTopVotedCardsPrint_2={wentWellTopVotedCardsPrint_2}
          />
          <DidNotWentWell
            didNotWentWellColumnName={didNotWentWellColumnName}
            didNotWentWellCreatedBy={didNotWentWellCreatedBy}
            users={users}
            didNotWentWellWords={didNotWentWellWords}
            handleIsNotWellCloudOpen={handleIsNotWellCloudOpen}
            isNotWellCloudOpen={isNotWellCloudOpen}
            didNotWentWellTopVotedCards={didNotWentWellTopVotedCards}
            didNotWentWellTopVotedCardsPrint_1={
              didNotWentWellTopVotedCardsPrint_1
            }
            didNotWentWellTopVotedCardsPrint_2={
              didNotWentWellTopVotedCardsPrint_2
            }
          />
          <DevelopAction
            actionCardData={actionCardData}
            copyAllActions={copyAllActions}
            handleIsActionCloudOpen={handleIsActionCloudOpen}
            users={users}
            isAllActionOpen={isAllActionOpen}
            actionTopVotedCards={actionTopVotedCards}
            actionLastVotedCards={actionLastVotedCards}
          />

          {/* Feedback for Facilitator 1 */}
          <Row style={{ marginTop: '36px' }}>
            <Col
              xs="12"
              className="d-flex justify-content-start align-items-center"
            >
              <Typography className="textTypeFour">
                Feedback for Facilitator
              </Typography>
            </Col>
          </Row>
          {/* Feedback for Facilitator 2 */}
          {feedback ? (
            <Row style={{ marginTop: '16px' }}>
              {FEEDBACK_QUESTIONS.map((feedbackQuestion, index) => {
                return (
                  <Col
                    xs="4"
                    className="d-flex justify-content-center align-items-center"
                    key={index}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography className="feedbackName">
                        {FEEDBACK_QUESTIONS[index]}
                      </Typography>
                      <Typography
                        sx={{ marginTop: '16px' }}
                        className="feedbackRatingNumber"
                      >
                        {(feedback[0][index] / feedback[1][index]).toFixed(1)}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: '16px',
                        }}
                      >
                        {[1, 2, 3, 4, 5].map(i =>
                          i <= feedback[0][index] / feedback[1][index] ? (
                            <Icons.Star
                              key={i + ''}
                              size={22}
                              color="#FCB34C"
                              style={{ margin: '8px' }}
                            ></Icons.Star>
                          ) : (
                            <Icons.StarOutline
                              key={i + ''}
                              size={22}
                              color="#808080"
                              style={{ margin: '8px' }}
                            ></Icons.StarOutline>
                          )
                        )}
                      </Box>
                      <Typography
                        sx={{ marginTop: '16px' }}
                        className="feedbackResponse"
                      >
                        {feedback[1][index]} Response
                        {feedback[1][index] === 1 ? '' : 's'}
                      </Typography>
                    </Box>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <Row style={{ marginTop: '16px' }}>
              <Col
                xs="12"
                className="d-flex justify-content-start align-items-center"
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '240px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    background: '#FAFAFA',
                    border: '1px solid #CCCCCC',
                  }}
                >
                  <Box
                    component="div"
                    sx={{ textAlign: 'justify', marginTop: '16px' }}
                  >
                    <Typography className="text1">
                      No responses have been submitted
                    </Typography>
                  </Box>
                </Box>
              </Col>
            </Row>
          )}
        </Box>
        {/* Divider */}
        <Divider color="#CDCDD4" style={{ width: '100%', marginTop: '36px' }} />
        {/* Thank You for using BACI Retros */}
        <Row
          style={{
            marginTop: '36px',
            marginBottom:
              isFeedbackSubmittedByFacilitator === 1 ? '56px' : '0px',
          }}
        >
          <Col
            xs="12"
            className="d-flex justify-content-center align-items-center"
          >
            <Typography className="thankingNoteOne" component="div">
              Thank You for using{' '}
              <Typography component="span" className="thankingNoteTwo">
                BACI{' '}
              </Typography>
              Retros
            </Typography>
          </Col>
        </Row>
        {/* Feedback Container */}
        {isFeedbackSubmittedByFacilitator === 0 ? (
          <Box sx={{ marginBottom: '56px' }}>
            {/* Want to suggest BACI a Feedback? */}
            <Row style={{ marginTop: '64px' }}>
              <Col
                xs="12"
                className="d-flex justify-content-center align-items-center"
              >
                <Typography className="textTypeFour">
                  Want to suggest BACI a Feedback?
                </Typography>
              </Col>
            </Row>
            {/* Feedback Rating */}
            <Row style={{ marginTop: '36px' }}>
              <Col
                xs="12"
                className="d-flex justify-content-center align-items-center"
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
                      setFeedbackRatings({ sad: 1, neutral: 0, happy: 0 });
                    }}
                  ></Box>
                  <img
                    src={sadMask}
                    style={{
                      marginLeft: !isXsUp ? '-10px' : '-6px',
                      marginTop: !isXsUp ? '-50px' : '-45px',
                      width: !isXsUp ? '64px' : '52px',
                      height: !isXsUp ? '64px' : '52px',
                      display: feedbackRatings.sad === 1 ? 'block' : 'none',
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
                      setFeedbackRatings({ sad: 0, neutral: 1, happy: 0 });
                    }}
                  ></Box>
                  <img
                    src={neutralMask}
                    style={{
                      marginLeft: !isXsUp ? '-10px' : '-6px',
                      marginTop: !isXsUp ? '-50px' : '-45px',
                      width: !isXsUp ? '64px' : '52px',
                      height: !isXsUp ? '64px' : '52px',
                      display: feedbackRatings.neutral === 1 ? 'block' : 'none',
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
                      setFeedbackRatings({ sad: 0, neutral: 0, happy: 1 });
                    }}
                  ></Box>
                  <img
                    src={happyMask}
                    style={{
                      marginLeft: !isXsUp ? '-10px' : '-6px',
                      marginTop: !isXsUp ? '-50px' : '-45px',
                      width: isXsUp ? '52px' : '64px',
                      height: isXsUp ? '52px' : '64px',
                      display: feedbackRatings.happy === 1 ? 'block' : 'none',
                    }}
                  ></img>
                </Box>
              </Col>
            </Row>
            {/* Feedback Text Field */}
            <Row style={{ marginTop: '36px' }}>
              <Col
                xs="12"
                className="d-flex justify-content-center align-items-center"
              >
                <TextField
                  placeholder="Your Message here..."
                  multiline
                  rows={3}
                  maxRows={4}
                  value={submittedFeedback}
                  onChange={e => handleTextFieldChange(e.currentTarget.value)}
                  sx={{
                    width: '674px',
                    height: '100px',
                    input: {
                      backgroundColor: '#FFFFFF',
                      opacity: '0.7',
                      border: '1px solid #E3E3E3',
                      boxShadow: '2px 5px 8px rgba(44, 105, 161, 0.15)',
                      borderRadius: '8px',
                    },
                    color: '#4D555A',
                    minWidth: '300px',
                  }}
                  inputProps={{ maxLength: 250 }}
                  error={!!feedbackError}
                  helperText={feedbackError}
                />
              </Col>
              <span
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                {retroFeedbackWarning !== ' ' && (
                  <FormHelperText sx={{ color: '#d32f2f' }}>
                    {retroFeedbackWarning}
                  </FormHelperText>
                )}
              </span>
            </Row>
            {/* Feedback Button */}
            <Row style={{ marginTop: '36px' }}>
              <Col
                xs="12"
                className="d-flex justify-content-center align-items-center"
              >
                <ContainedButton
                  name="Submit Feedback"
                  onClick={submitFeedback}
                  style={{
                    minWidth: '185px !important',
                    height: '48px !important',
                  }}
                />
              </Col>
            </Row>
          </Box>
        ) : null}
      </Container>
      {/* End Container */}
      <BootstrapDialog
        open={isViewParticipantsDialogOpen}
        onClose={handleViewParticipantsDialogClose}
        aria-labelledby="customized-dialog-title"
      >
        <ViewParticipants
          handleViewParticipantsDialogClose={handleViewParticipantsDialogClose}
          users={users}
        />
      </BootstrapDialog>
      <BootstrapDialog
        open={isFeedbackSubmitDialogOpen}
        onClose={handleFeedbackSubmitClose}
        aria-labelledby="feedback-submit"
        keepMounted
        PaperProps={{
          sx: {
            width: '800px',
            maxWidth: '800px',
            height: '400px',
            maxHeight: '400px',
            padding: isXsUp ? '16px' : '0px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'hidden',
          },
        }}
        sx={{
          boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
          borderRadius: '20px',
        }}
      >
        <FeedbackSubmitDialog
          handleFeedbackSubmitClose={handleFeedbackSubmitClose}
        />
      </BootstrapDialog>
    </>
  );
});
