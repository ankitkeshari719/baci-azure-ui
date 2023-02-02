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
} from '@mui/material';
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

const styles = {
  whatWentwellBox: {
    background: 'rgba(11, 102, 35,0.04)',
    border: '1px solid rgba(11, 102, 35,0.5)',
    borderRadius: '20px',
    height: '392px',
  },
  whatdidnwellBox: {
    background: 'rgba(247, 151, 34, 0.04)',
    border: '1px solid rgba(247, 151, 34, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    height: '392px',
  },
  actionBox: {
    background: 'rgba(138, 56, 245, 0.04)',
    border: '1px solid rgba(138, 56, 245, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    minHeight: '392px',
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

export const SummaryReport = React.forwardRef((props, ref) => {
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const {
    state: {
      lastStateUpdate,
      startedDate,
      columns,
      retroName,
      fullPulseCheck,
      users,
    },
  } = React.useContext(BoardContext);

  const [wentWellwords, setwentWellwords] = React.useState<Word[]>([]);
  const [didntWentWellwords, setdidntWentWellwords] = React.useState<Word[]>(
    []
  );
  const [barData, setBarData] = React.useState<{ 1: any; 2: any; 3: any }[]>(
    []
  );
  const [actions, setActions] = React.useState<string[]>([]);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [feedback, setFeedback] = React.useState<any | undefined>();
  const [islanded, setIsLanded] = React.useState(true);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [retroDate, setRetroDate] = React.useState('');
  let componentRef = React.useRef(null);
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
    const longEnUSFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date());
    setRetroDate(longEnUSFormatter);
  });

  React.useEffect(() => {
    const wentWell_cardValues = [] as string[];
    const didntWentWell_cardValues = [] as string[];

    columns[ACTIONS_COLUMN].groups.forEach(group =>
      group.cards.forEach(card => {
        actions.push(card.value);
      })
    );
    setActions(actions);
    //for went well word cloud
    columns[WHAT_WENT_WELL_COLUMN].groups.forEach(group =>
      group.cards.forEach(card => {
        const clean = card.value.replace(/[\W_]+/g, ' ').trim();
        if (clean !== '') wentWell_cardValues.push(clean);
      })
    );

    //for went well word cloud
    const total = Object.values(wentWell_cardValues)
      .join(' ')
      .toLowerCase()
      .split(' ');
    let wordsMaps_wentWell = [];
    if (total.length !== 0) {
      const noStopwords = removeStopwords(total, [
        ...eng,
        ...WORD_CLOUD_IGNORE_WORDS,
      ]);

      wordsMaps_wentWell = noStopwords
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
    setwentWellwords(wordsMaps_wentWell);

    //for didn't went well word cloud
    columns[WHAT_DIDNT_GO_WELL].groups.forEach(group =>
      group.cards.forEach(card => {
        const clean = card.value.replace(/[\W_]+/g, ' ').trim();

        if (clean !== '') didntWentWell_cardValues.push(clean);
      })
    );
    const totalvalues = Object.values(didntWentWell_cardValues)
      .join(' ')
      .toLowerCase()
      .split(' ');
    let wordsMaps_didntWentWell = [];
    if (totalvalues.length !== 0) {
      const noStopwords = removeStopwords(totalvalues, [
        ...eng,
        ...WORD_CLOUD_IGNORE_WORDS,
      ]);

      wordsMaps_didntWentWell = noStopwords
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
    setdidntWentWellwords(wordsMaps_didntWentWell);

    //get total count of user submitted the pulsechek

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
  return (
    <>
      <Grid
        container
        spacing={0}
        sx={{
          backgroundColor: '#F5F5F5',
          padding: isXsUp ? '8px' : '56px',
          overflowY: isXsUp ? 'scroll' : 'auto',
          height: isXsUp ? 'calc(100vh - 120px)' : 'calc(100vh - 24px)',
        }}
      >
        {/* Line 1 */}
        <Grid
          item
          xs={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            userSelect: 'none',
          }}
        >
          <Typography className="textTypeOne">Report For</Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            userSelect: 'none',
          }}
        >
          <Typography className="textTypeThree">
            {global.currentRetro?.name}
          </Typography>
        </Grid>
        <Grid item style={{ flexGrow: '1' }}></Grid>
        <Grid
          item
          xs={1}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            userSelect: 'none',
          }}
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
            onClick={() => {
              console.log('Here');
            }}
          />
        </Grid>
        {/* Line 2 */}

        {/* Retro Date */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
            }}
          >
            <Typography variant={isXsUp ? 'h6' : 'h4'} className="textOne">
              {retroDate}
            </Typography>
          </Box>
        </Grid>
        {/* Pulse Check */}
        <Grid item xs={12} mt="48px" sx={styles.pulseCheckBox}>
          <Grid item>
            <Typography
              ml="24px"
              mt="24px"
              color="#343434"
              variant="h4"
              sx={styles.textOpacity}
            >
              Pulse Check
            </Typography>
          </Grid>
          <Box
            sx={{
              margin: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {QUICK_PULSE_CHECK_QUESTIONS.length !== 0 ? (
              <>
                <Box
                  sx={{
                    margin: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {questions.length !== 0 ? (
                    <Bar
                      style={{
                        width: '700px',
                        height: '250px',
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
                  ) : (
                    <span style={{ fontSize: '16px' }}>
                      No responses have been submitted
                    </span>
                  )}
                </Box>{' '}
              </>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography>No responses have been submitted</Typography>
              </Box>
            )}
          </Box>{' '}
        </Grid>
        {/* What Went Well */}
        <Grid item xs={12}>
          <Box mt="48px" sx={styles.whatWentwellBox}>
            <Typography
              ml="24px"
              mt="24px"
              color="#0B6623"
              variant="h4"
              sx={styles.textOpacity}
            >
              What Went Well
            </Typography>

            {wentWellwords.length !== 0 ? (
              <>
                <Grid
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="272px"
                >
                  <WordCloud
                    data={wentWellwords}
                    showOn="whatWentWell"
                  ></WordCloud>
                </Grid>{' '}
              </>
            ) : null}
          </Box>
        </Grid>
        {/* What Didn’t Go Well */}
        <Grid item xs={12}>
          <Box mt="48px" sx={styles.whatdidnwellBox}>
            <Typography
              ml="24px"
              mt="24px"
              color="#F79722"
              variant="h4"
              sx={styles.textOpacity}
            >
              What Didn’t Go Well
            </Typography>
            {didntWentWellwords.length !== 0 ? (
              <>
                <Grid
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="272px"
                >
                  <WordCloud
                    data={didntWentWellwords}
                    showOn="whatDidntWentWell"
                  ></WordCloud>
                </Grid>{' '}
              </>
            ) : null}
          </Box>
        </Grid>
        {/* Actions */}
        <Grid item xs={12}>
          <Box mt="48px" sx={styles.actionBox} className="page-break ">
            <Typography
              ml="24px"
              mt="24px"
              color="#8A38F5"
              variant="h4"
              sx={styles.textOpacity}
            >
              Actions
            </Typography>
            <Box ml="24px" mt="24px" mr="24px">
              {actions.length !== 0 ? (
                <>
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
                </>
              ) : null}
            </Box>
          </Box>
        </Grid>
        {/* Feedback for facilitator */}
        <Grid
          xs={12}
          mt="48px"
          item
          flexDirection="row"
          justifyContent="center"
          sx={styles.facilitatorFeedbackBox}
        >
          <Grid item>
            <Typography
              ml="24px"
              mt="24px"
              color="#343434"
              variant="h4"
              sx={styles.textOpacity}
            >
              Feedback for facilitator
            </Typography>
          </Grid>
          <Grid item mt="32px" mb="48px">
            {feedback ? (
              <Grid
                container
                sx={{ flexDirection: 'row', justifyContent: 'center' }}
              >
                {FEEDBACK_QUESTIONS.map((v, index) => (
                  <Grid
                    item
                    xs={12 / FEEDBACK_QUESTIONS.length}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                    key={index + 'feed'}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        margin: '10px',
                        maxWidth: '351px',
                        height: '238px',
                        background: '#FFFFFF',
                        borderRadius: '10px',
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h2"
                          sx={{
                            justifyContent: 'center',
                            display: 'flex',
                            gap: '5px',
                            alignItems: 'center',
                            fontWeight: 500,
                          }}
                        >
                          {(feedback[0][index] / feedback[1][index]).toFixed(1)}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                          }}
                          mt="14.5px"
                          mb="14.5px"
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
                          sx={{
                            fontWeight: 400,
                            fontSize: '16px',
                            justifyContent: 'center',
                            display: 'flex',
                            color: '#808080',
                            alignItems: 'center',
                          }}
                          mt="4px"
                        >
                          {feedback[1][index]} Response
                          {feedback[1][index] === 1 ? '' : 's'}
                        </Typography>
                        <Typography
                          mt="24px"
                          mb="25px"
                          sx={{
                            fontWeight: 400,
                            fontSize: '16px',
                            justifyContent: 'center',
                            display: 'flex',
                            color: '#343434',
                            alignItems: 'center',
                          }}
                        >
                          {FEEDBACK_QUESTIONS[index]}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography>No responses have been submitted</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
        {/* Thank You Note */}
        <Grid item xs={12}>
          <Box
            mt="96px"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h1" color={commonStyles.secondaryMain}>
              Thank You for using{' '}
            </Typography>
            <Typography
              mr="10px"
              ml="10px"
              variant="h1"
              color={commonStyles.PrimaryMain}
            >
              BACI
            </Typography>
            <Typography variant="h1" color={commonStyles.secondaryMain}>
              Retros
            </Typography>
          </Box>
        </Grid>
        {/* SignUp */}
        <Grid item xs={12}>
          <Box
            mt="31px"
            mb="105px"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              mr="5px"
              sx={{ fontSize: '16px', textDecoration: 'underline' }}
              color={commonStyles.info}
            >
              SignUp
            </Typography>
            <Typography
              sx={{ fontSize: '16px' }}
              color={commonStyles.primaryDark}
            >
              to explore more exciting features!
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
});
