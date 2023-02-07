import React from 'react';
import { Bar } from 'react-chartjs-2';
import ReactToPrint from 'react-to-print';
import { eng, removeStopwords } from 'stopword';
import * as Icons from 'heroicons-react';
import theme from '../../theme/theme';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  styled,
  LinearProgress,
  linearProgressClasses,
  useMediaQuery,
  Dialog,
} from '@mui/material';
import { Row, Col, Container } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import './styles.scss';
import '../../global.scss';
import commonStyles from './../../style.module.scss';

import {
  ACTIONS_COLUMN,
  WHAT_WENT_WELL_COLUMN,
  WORD_CLOUD_IGNORE_WORDS,
  WHAT_DIDNT_GO_WELL,
  PULSE_CHECK_QUESTIONS,
  QUICK_PULSE_CHECK_QUESTIONS,
  FEEDBACK_QUESTIONS,
} from '../../constants';
import { Question } from '../../elements/PulseCheckChart';
import WordCloud, { Word } from '../../elements/WordCloud';
import { RetroColumn } from '../../elements/RetroColumn';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { border, borderColor } from '@mui/system';
import { ViewParticipants } from './ViewParticipants';

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
  whatWentwellBox: {
    background: 'rgba(11, 102, 35,0.04)',
    border: '1px solid rgba(11, 102, 35,0.5)',
    borderRadius: '20px',
    height: '392px',
    width: '100% !important',
  },
  whatdidnwellBox: {
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

export default function ReportSummary() {
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const {
    state: { lastStateUpdate, columns, fullPulseCheck, users },
  } = React.useContext(BoardContext);

  const [isWellCloudOpen, setIsWellCloudOpen] = React.useState(false);
  const [isNotWellCloudOpen, setIsNotWellCloudOpen] = React.useState(false);
  const [isActionCloudOpen, setIsActionCloudOpen] = React.useState(false);
  const [isViewParticipantsDialogOpen, setIsViewParticipantsDialogOpen] =
    React.useState(false);
  const [wentWellWords, setWentWellWords] = React.useState<Word[]>([]);

  const [didNotWentWellWords, setDidNotWentWellWords] = React.useState<Word[]>(
    []
  );
  const [actions, setActions] = React.useState<string[]>([]);
  const [barData, setBarData] = React.useState<{ 1: any; 2: any; 3: any }[]>(
    []
  );

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [feedback, setFeedback] = React.useState<any | undefined>();
  const [islanded, setIsLanded] = React.useState(true);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [retroDate, setRetroDate] = React.useState('');

  function getBarColor(val: number) {
    if (val > 50) {
      return '#34A853';
    } else if (val == 50) {
      return '#FBBC05 !important';
    } else {
      return '#EA4335';
    }
  }

  React.useEffect(() => {
    const wentWellCardValues = [] as string[];
    const didNotWentWellCardValues = [] as string[];
    const actionsCardValues = [] as string[];
    let wentWellWordCloudData = [];
    let didNotWentWellWordCloudData = [];

    // What Went Well Data
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

    // Did Not Went Well Data
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

    // Action Data
    columns.forEach(column => {
      if (column.id === '2') {
        column.groups.forEach(group => {
          group.cards.forEach(card => {
            const clean = card.value.replace(/[\W_]+/g, ' ').trim();
            if (clean !== '') actionsCardValues.push(clean);
          });
        });
      }
    });
    console.log('wentWellCardValues', wentWellCardValues);
    console.log('wentWellCardValuesTotal', wentWellCardValuesTotal);
    console.log('wentWellWordCloudData', wentWellWordCloudData);
    console.log('didNotWentWellCardValues', didNotWentWellCardValues);
    console.log('didNotWellCardValuesTotal', didNotWellCardValuesTotal);
    console.log('didNotWentWellWordCloudData', didNotWentWellWordCloudData);
    console.log('actionsCardValues', actionsCardValues);
    setActions(actionsCardValues);

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
    setIsActionCloudOpen(!isActionCloudOpen);
  };

  const handleViewParticipantsDialogOpen = () => {
    setIsViewParticipantsDialogOpen(true);
  };

  const handleViewParticipantsDialogClose = () => {
    setIsViewParticipantsDialogOpen(false);
  };

  return (
    <>
      {/* Start Container */}
      <Container
        fluid
        style={{
          backgroundColor: '#F5F5F5',
          padding: isXsUp ? '8px' : '56px',
          overflowY: isXsUp ? 'scroll' : 'auto',
          height: isXsUp ? 'calc(100vh - 120px)' : 'calc(100vh - 24px)',
        }}
      >
        {/* Line 1 */}
        <Row>
          <Col
            xs="1"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="textTypeOne">Report For</Typography>
          </Col>
          <Col
            xs="2"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="textTypeThree">
              {global.currentRetro?.name}
            </Typography>
          </Col>
          <Col
            xs={{ span: 1, offset: 8 }}
            className="d-flex justify-content-around align-items-center"
          >
            <Icons.ShareOutline
              size={20}
              color="#4E4E4E"
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                console.log('Here');
              }}
            />
            <Icons.DownloadOutline
              size={20}
              color="#4E4E4E"
              style={{
                cursor: 'pointer',
              }}
            />
            {/* <ReactToPrint
              trigger={() => (
                <Icons.DownloadOutline
                  size={20}
                  color="#4E4E4E"
                  style={{
                    cursor: 'pointer',
                  }}
                />
              )}
              content={(<></>)}
            /> */}
          </Col>
        </Row>
        {/* Line 2 */}
        <Row style={{ marginTop: '36px' }}>
          <Col
            xs="2"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="textTypeOne">Date</Typography>
            <Typography className="textTypeTwo" ml={2}>
              28th Jan, 2022
            </Typography>
          </Col>
          <Col
            xs="2"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="textTypeOne">Time Taken</Typography>
            <Typography className="textTypeTwo" ml={2}>
              40min 23sec
            </Typography>
          </Col>
          <Col
            xs="2"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="textTypeOne">No. Of Participants</Typography>
            <Typography className="textTypeTwo" ml={2}>
              40
            </Typography>
          </Col>
          <Col
            xs={{ span: 2, offset: 4 }}
            className="d-flex justify-content-end align-items-center"
          >
            <Typography
              className="viewWorldCould"
              onClick={handleViewParticipantsDialogOpen}
            >
              View Participants
              <Icons.ClipboardCopyOutline
                size={20}
                color="#159ADD"
                style={{
                  cursor: 'pointer',
                  marginLeft: '20px',
                }}
                onClick={() => {
                  console.log('Here');
                }}
              />
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
            >
              <Bar
                style={{
                  height: '260px',
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
                <Box component="div">
                  <Icons.ChartSquareBarOutline
                    size={20}
                    color="#4E4E4E"
                    style={{
                      fontSize: '30px !important',
                      width: '30px',
                      height: '30px',
                      background: '#CEEFFF',
                      color: '#2C69A1',
                      borderRadius: '5px',
                      borderColor: '#CEEFFF',
                    }}
                  />
                </Box>
                <Box component="div">
                  <Typography className="text1">
                    Sorry, Pulse Check was not selected
                  </Typography>
                </Box>
                <Box
                  component="div"
                  sx={{ width: '40%', textAlign: 'justify', marginTop: '16px' }}
                >
                  <Typography>
                    Pulse Check helps the team to quickly understand their
                    feelings about work. Conducting it consistently will help
                    the team to track progress and also to compare & contrast
                    against BACI retro outcomes.
                  </Typography>
                </Box>
              </Box>
            </Col>
          )}
        </Row>
        {/* What Went Well Section 1*/}
        <Row style={{ marginTop: '36px' }}>
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="textTypeFour">What Went Well?</Typography>
          </Col>
        </Row>
        {/* What Went Well Section 2*/}
        <Row style={{ marginTop: '16px' }}>
          <Col
            xs="2"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="participantsResponded">
              Participants Responded
            </Typography>
            <Typography className="participantsResponded" ml={2}>
              12/14
            </Typography>
          </Col>
          <Col
            xs={{ span: 2, offset: 8 }}
            className="d-flex justify-content-end align-items-center"
          >
            <Typography
              className="viewWorldCould"
              onClick={handleIsWellCloudOpen}
            >
              View Word Cloud
            </Typography>
          </Col>
        </Row>
        {/* What Went Well Section 3*/}
        <Row style={{ marginTop: '16px' }}>
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
          >
            {isWellCloudOpen ? (
              <Box sx={styles.whatWentwellBox}>
                {wentWellWords.length !== 0 ? (
                  <Grid
                    item
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="272px"
                  >
                    <WordCloud
                      data={wentWellWords}
                      showOn="whatWentWell"
                    ></WordCloud>
                  </Grid>
                ) : null}
              </Box>
            ) : (
              <>Top voted cards </>
            )}
          </Col>
        </Row>
        {/* What Didn’t Go Well? Section 1*/}
        <Row style={{ marginTop: '36px' }}>
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="textTypeFour">
              What Didn’t Go Well?
            </Typography>
          </Col>
        </Row>
        {/* What Didn’t Go Well? Section 2*/}
        <Row style={{ marginTop: '16px' }}>
          <Col
            xs="2"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="participantsResponded">
              Participants Responded
            </Typography>
            <Typography className="participantsResponded" ml={2}>
              12/14
            </Typography>
          </Col>
          <Col
            xs={{ span: 2, offset: 8 }}
            className="d-flex justify-content-end align-items-center"
          >
            <Typography
              className="viewWorldCould"
              onClick={handleIsNotWellCloudOpen}
            >
              View Word Cloud
            </Typography>
          </Col>
        </Row>
        {/* What Didn’t Go Well? Section 3*/}
        <Row style={{ marginTop: '16px' }}>
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
          >
            {isNotWellCloudOpen ? (
              <Box sx={styles.whatdidnwellBox}>
                {didNotWentWellWords.length !== 0 ? (
                  <Grid
                    item
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="272px"
                  >
                    <WordCloud
                      data={didNotWentWellWords}
                      showOn="whatDidntWentWell"
                    ></WordCloud>
                  </Grid>
                ) : null}
              </Box>
            ) : (
              <>Top Voted Cards </>
            )}
          </Col>
        </Row>
        {/* Actions to be Taken Section 1*/}
        <Row style={{ marginTop: '36px' }}>
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="textTypeFour">
              Actions to be Taken
            </Typography>
          </Col>
        </Row>
        {/* Actions to be Taken Section 2*/}
        <Row style={{ marginTop: '16px' }}>
          <Col
            xs="2"
            className="d-flex justify-content-start align-items-center"
          >
            <Typography className="participantsResponded">
              Participants Responded
            </Typography>
            <Typography className="participantsResponded" ml={2}>
              12/14
            </Typography>
          </Col>
          <Col
            xs={{ span: 2, offset: 8 }}
            className="d-flex justify-content-end align-items-center"
          >
            <Typography
              className="viewWorldCould"
              onClick={handleIsActionCloudOpen}
            >
              View Word Cloud
            </Typography>
          </Col>
        </Row>
        {/* Actions to be Taken Section 3*/}
        <Row style={{ marginTop: '16px' }}>
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
          >
            {isActionCloudOpen ? (
              <Box sx={styles.actionBox}>
                {actions.length !== 0 ? (
                  <RetroColumn
                    leftHeaderComponent={undefined}
                    rightHeaderComponent={undefined}
                    noHeightLimit
                    noHeader
                    expandAllGroups
                    column={columns[ACTIONS_COLUMN]}
                    columnId={columns[ACTIONS_COLUMN].id}
                    showEditBox={false}
                    setIslanded={setIsLanded}
                    setShowEditBox={() => {}}
                    cardGroups={columns[ACTIONS_COLUMN].groups}
                  />
                ) : null}
              </Box>
            ) : (
              <>Action to be taken</>
            )}
          </Col>
        </Row>
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
      </Container>
      {/* End Container */}
      <BootstrapDialog
        open={isViewParticipantsDialogOpen}
        onClose={handleViewParticipantsDialogClose}
        aria-labelledby="customized-dialog-title"
      >
        <ViewParticipants
          handleViewParticipantsDialogClose={handleViewParticipantsDialogClose}
        />
      </BootstrapDialog>
    </>
  );
}
