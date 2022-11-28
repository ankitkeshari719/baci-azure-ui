import {
  ACTIONS_COLUMN,
  FEEDBACK_QUESTIONS,
  FEEDBACK_QUESTIONS_COLORS,
  FEEDBACK_QUESTIONS_FILLED,
  FEEDBACK_QUESTIONS_OUTLINE,
  PULSE_CHECK_QUESTIONS,
  QUICK_PULSE_CHECK_QUESTIONS,
  WHAT_DIDNT_GO_WELL,
  WHAT_WENT_WELL_COLUMN,
  WORD_CLOUD_IGNORE_WORDS,
} from '../constants';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  styled,
  LinearProgress,
  linearProgressClasses,
  Button,
} from '@mui/material';
import StackedBarChart, { Question } from './PulseCheckChart';
import WordCloud, { Word } from './WordCloud';
import { eng, removeStopwords } from 'stopword';
import commonStyles from './../style.module.scss';
import './../global.scss';
import { BoardContext } from '../contexts/BoardContext';
import React from 'react';
import { RetroColumn } from './RetroColumn';
import StarIcon from '@mui/icons-material/Star';
import * as Icons from 'heroicons-react';
import Toolbar from '../elements/Toolbar';
import { GlobalContext } from '../contexts/GlobalContext';
import { display } from '@mui/system';
import ReactToPrint from 'react-to-print';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
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
        color: '#343434'
      },
      min: 0,
      max: 100,
      ticks: {
        // forces step size to be 50 units
        stepSize: 10
      },
      

    },
    y:{
      border: {
        display: false
      },
      grid: {
        display: false,
        drawOnChartArea: false,
        drawTicks: true,
      },
    }
  },
 
  elements: {
    bar: {
      
    },
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
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: '32px',
  borderRadius: '16px',
  marginTop: '32px',
  marginLeft: '100px',
  width: '600px',
  //  "& .MuiLinearProgress-colorPrimary": {
  //   backgroundColor: "#f6ce95"
  // },
  // "& .MuiLinearProgress-barColorPrimary": {
  //   backgroundColor: "#f0ad4e"
  // },

  [`&.${linearProgressClasses.colorPrimary}`]: {
    background: 'none',
  },
  // [`& .${linearProgressClasses.bar}`]: {
  //   borderRadius: 16,
  //   backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  // },
}));

export const Report = React.forwardRef((props, ref) => {
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
  const [barData, setBarData] = React.useState<
    { 1: any; 2: any; 3: any }[]
  >([]);
  const [actions, setActions] = React.useState<string[]>([]);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [feedback, setFeedback] = React.useState<any | undefined>();
  const [islanded, setIsLanded] = React.useState(true);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [retroDate, setRetroDate] = React.useState('');

  const componentRef = React.createRef<HTMLDivElement>();
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
    // console.log(wordsMaps_wentWell);
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
    // console.log(wordsMaps_didntWentWell);
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
        // console.log(feedback);
      });
      // [feedbackValues, feedbackCount].map((index)=>{
      //   index[0][index]=index[0][index]/ index[1][index]
      // })
      // console.log([feedbackValues, feedbackCount]);
      user.pulseCheckQuestions.forEach(question => {
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

    // console.log('total pulsecount', totalPulseCheckCount);
    if (Object.keys(feedbackValues).length !== 0) {
      setFeedback([feedbackValues, feedbackCount]);
    }

    setQuestions(newQuestions);
    //formated data for bar chart
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
    })
    // console.log('sample', sampleArray);
    let tempArr : any = [];
    if(sampleArray.length === 3){
      tempArr.push([sampleArray[0][0], sampleArray[1][0], sampleArray[2][0]]);
      tempArr.push([sampleArray[0][1], sampleArray[1][1], sampleArray[2][1]]);
      tempArr.push([sampleArray[0][2], sampleArray[1][2], sampleArray[2][2]]);
    }

    setBarData(tempArr);
    // console.log('bar', barData);
    // console.log('format', newQuestions, feedbackValues, feedbackCount);
  }, [lastStateUpdate]);

  return (
    // <Box
    //   ref={ref}
    //   sx={{
    //     maxWidth: '1000px',
    //     display: 'flex',
    //     width: '100%',
    //     flexDirection: 'column',
    //   }}
    // >
    //   <Typography sx={{ margin: '20px 0  0 10px', fontSize: '16px' }}>
    //     Retro name :<span style={{ fontWeight: 'bold' }}>{retroName}</span>
    //   </Typography>
    //   <Typography sx={{ margin: '0 0 0 10px', fontSize: '16px' }}>
    //     Date :{' '}
    //     <span style={{ fontWeight: 'bold' }}>
    //       {startedDate?.toLocaleDateString()}
    //     </span>
    //   </Typography>

    //   {words.length !== 0 ? (
    //     <>
    //       <Typography
    //         variant="h5"
    //         sx={{ margin: '10px', fontSize: '18px', marginTop: '30px' }}
    //       >
    //         Celebrate what went well
    //       </Typography>
    //       <Box
    //         sx={{
    //           border: '2px solid gray',
    //           margin: '20px',
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //         }}
    //       >
    //         <WordCloud data={words}></WordCloud>
    //       </Box>{' '}
    //     </>
    //   ) : null}

    //   {actions.length !== 0 ? (
    //     <>
    //       <Typography
    //         variant="h5"
    //         sx={{ margin: '10px', fontSize: '18px', marginTop: '30px' }}
    //       >
    //         Actions
    //       </Typography>
    //       <RetroColumn
    //         leftHeaderComponent={undefined}
    //         rightHeaderComponent={undefined}
    //         noHeightLimit
    //         noHeader
    //         expandAllGroups
    //         column={columns[ACTIONS_COLUMN]}
    //         columnId={columns[ACTIONS_COLUMN].id}
    //         showEditBox={false}
    //         setIslanded={setIsLanded}
    //         setShowEditBox={() => {}}
    //         cardGroups={columns[ACTIONS_COLUMN].groups}
    //       />
    //     </>
    //   ) : null}

    // <>
    //   <Typography
    //     variant="h5"
    //     sx={{ margin: '10px', fontSize: '18px', marginTop: '30px' }}
    //   >
    //     Pulse Check
    //   </Typography>
    //    <Box
    //      sx={{
    //       border: '2px solid gray',
    //       margin: '20px',
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //     }}
    //   >
    //     {questions.length !== 0 ? (
    //       <StackedBarChart questions={questions}></StackedBarChart>
    //     ) : (
    //       <span style={{ fontSize: '16px' }}>
    //         No responses have been submitted
    //       </span>
    //     )}
    //   </Box>{' '}
    // </>

    //   {/* {feedback ? ( */}
    //   <>
    //     <Typography
    //       variant="h5"
    //       sx={{ margin: '10px', fontSize: '18px', marginTop: '30px' }}
    //     >
    //       Feedback for facilitator
    //     </Typography>
    //     <Box
    //       sx={{
    //         border: '2px solid gray',
    //         margin: '20px',
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         marginBottom:"50px"
    //       }}
    //     >
    //       {feedback ? (
    //         <Grid container sx={{ justifyContent: 'center' }}>
    //           {FEEDBACK_QUESTIONS.map((v, index) => (
    //             <Grid
    //               item
    //               xs={12 / FEEDBACK_QUESTIONS.length}
    //               sx={{ display: 'flex', justifyContent: 'center' }}
    //             >
    //               <Card variant="outlined" sx={{ margin: '10px' }}>
    //                 <CardContent>
    //                   <Typography
    //                     variant="h5"
    //                     sx={{
    //                       justifyContent: 'center',
    //                       display: 'flex',
    //                       gap: '5px',
    //                       alignItems: 'center',
    //                     }}
    //                   >
    //                     {(feedback[0][index] / feedback[1][index]).toFixed(1)}
    //                     <StarIcon
    //                       sx={{
    //                         fontSize: 40,
    //                         color: FEEDBACK_QUESTIONS_COLORS[index],
    //                       }}
    //                     />
    //                   </Typography>
    //                   <Typography
    //                     sx={{
    //                       fontWeight: 'bold',
    //                       justifyContent: 'center',
    //                       display: 'flex',
    //                       gap: '5px',
    //                       alignItems: 'center',
    //                     }}
    //                   >
    //                     {feedback[1][index]} response
    //                     {feedback[1][index] === 1 ? '' : 's'}
    //                   </Typography>
    //                   <Typography>{FEEDBACK_QUESTIONS[index]}</Typography>
    //                 </CardContent>
    //               </Card>
    //             </Grid>
    //           ))}
    //         </Grid>
    //       ) : (
    //         <span style={{ fontSize: '16px' }}>
    //           No responses have been submitted
    //         </span>
    //       )}
    //     </Box>{' '}
    //   </>
    //   {/* ) : null} */}
    // </Box>
    <Box
      style={{
        height: '985px',
        overflowY: 'scroll',
      }}
    >
      <Grid container>
        <Toolbar />
        <Grid
          container
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center', //this will allow flex-end to move item to the right
          }}
          mt="48px"
        >
          <Grid lg={8}>
            <Grid item display="flex" justifyContent="center">
              <Typography
                color={commonStyles.secondaryMain}
                fontSize={commonStyles.font16}
              >
                Summary
              </Typography>
            </Grid>
            <Grid item display="flex" justifyContent="flex-end">
              <Icons.Share
                size={20}
                color="#4E4E4E"
                style={{ marginRight: '46px' }}
              ></Icons.Share>
              <Icons.Download
                size={20}
                color="#4E4E4E"
                style={{ marginRight: '46px' }}
              ></Icons.Download>
              <ReactToPrint
                pageStyle="@page { size: A4; scale: 0.90 }"
                trigger={() => (
                  <Icons.Printer
                    size={20}
                    color="#4E4E4E"
                    style={{ cursor: 'pointer' }}
                  ></Icons.Printer>
                )}
                content={() => componentRef.current}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            ref={componentRef}
            display="flex"
            lg={8}
            xs={12}
            direction="column"
            item
          >
            <Grid item sx={{ flexDirection: 'row' }}>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                mt="20px"
              >
                <Typography variant="h2" color={commonStyles.PrimaryMain}>
                  {global.currentRetro?.name}
                </Typography>
              </Box>
              <Box
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                mt="12px"
              >
                <Typography variant="h4" color={commonStyles.PrimaryMain}>
                  {retroDate}
                </Typography>
              </Box>
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
              <Box mt="48px" sx={styles.actionBox}>
                <Typography
                  ml="24px"
                  mt="24px"
                  color="#8A38F5"
                  variant="h4"
                  sx={styles.textOpacity}
                >
                  Actions
                </Typography>
                <Box>
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
              <Grid item mt="48px" sx={styles.pulseCheckBox}>
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
                  {/* <StackedBarChart questions={questions}></StackedBarChart> */}
                  {QUICK_PULSE_CHECK_QUESTIONS.length !== 0 ? (
                    // <Grid container >
                    //   <Grid item xs={12} flexDirection='row' justifyContent='center'>
                    //     { questions.map((que, i)=>(
                    //       <Box sx={{ alignItems: "baseline",
                    //       display: "flex",
                    //       flexDirection: "row",
                    //       justifyContent: "center"}}>
                    //       <Typography>{que.question}</Typography>
                    //       <BorderLinearProgress variant="determinate" sx={{"& .MuiLinearProgress-barColorPrimary": {
                    //         backgroundColor: getBarColor(80)
                    //       }}} value={50} />
                    //       </Box>
                    //   ))

                    //   }
                    //     {/* <StackedBarChart questions={questions}></StackedBarChart> */}
                    //   </Grid>
                    // </Grid>
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
                          style={{width: '700px', height: '250px', border: 'none'}}
                            options={options}
                            data={{
                              labels: QUICK_PULSE_CHECK_QUESTIONS,             // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object

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
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography>No responses have been submitted</Typography>
                    </Box>
                  )}
                </Box>{' '}
              </Grid>
              <Grid
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
                                  fontWeight: 500
                                }}
                              >
                                {(
                                  feedback[0][index] / feedback[1][index]
                                ).toFixed(1)}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                                mt='14.5px'
                                mb='14.5px'
                              >
                                {[1, 2, 3, 4, 5].map(i =>
                                  i <=
                                  feedback[0][index] / feedback[1][index] ? (
                                    <Icons.Star
                                      size={22}
                                      color="#FCB34C"
                                      style={{margin: '8px'}}
                                    ></Icons.Star>
                                  ) : (
                                    <Icons.StarOutline
                                      size={22}
                                      color='#808080'
                                      style={{margin: '8px'}}
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
                              <Typography mt="24px" mb="25px" sx={{
                                  fontWeight: 400,
                                  fontSize: '16px',
                                  justifyContent: 'center',
                                  display: 'flex',
                                  color: '#343434',
                                  alignItems: 'center',
                                }}>
                                {FEEDBACK_QUESTIONS[index]}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Typography>No responses have been submitted</Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Grid>
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
      </Grid>
    </Box>
  );
});
