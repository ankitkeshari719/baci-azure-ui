import {
  ACTIONS_COLUMN,
  FEEDBACK_QUESTIONS,
  FEEDBACK_QUESTIONS_COLORS,
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
import Toolbar from '../elements/Toolbar'
import { GlobalContext } from '../contexts/GlobalContext';
const styles = {
  whatWentwellBox:{
    background: "rgba(11, 102, 35,0.04)",
    border: "1px solid rgba(11, 102, 35,0.5)",
    borderRadius: "20px",
    height: '392px'
},
 whatdidnwellBox: {
  background: "rgba(247, 151, 34, 0.04)",
  border: "1px solid rgba(247, 151, 34, 0.5)",
  borderRadius: "20px",
  boxSizing: "border-box",
  height: '392px'
 },
 actionBox: {
  background: "rgba(138, 56, 245, 0.04)",
  border: "1px solid rgba(138, 56, 245, 0.5)",
  borderRadius: "20px",
  boxSizing: "border-box",
height: '392px'
 },
 pulseCheckBox: {
  background: 'rgba(52, 52, 52, 0.04)',
  opacity: 0.5,
  border: "1px solid rgba(52, 52, 52, 0.5)",
  borderRadius: "20px",
  boxSizing: "border-box",
  height: '392px'
 },
 facilitatorFeedbackBox: {
  background: 'rgba(52, 52, 52, 0.04)',
  opacity: 0.5,
  border: "1px solid rgba(52, 52, 52, 0.5)",
  borderRadius: "20px",
  boxSizing: "border-box",
  height: '392px'
 },
 textOpacity: {
  opacity: 0.9
 }
};


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
  const [didntWentWellwords, setdidntWentWellwords] = React.useState<Word[]>([]);
  const [actions, setActions] = React.useState<string[]>([]);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [feedback, setFeedback] = React.useState<any | undefined>();
  const [islanded, setIsLanded] =React.useState(true);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [retroDate, setRetroDate]=React.useState("");

  React.useEffect(()=>{
   
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
    const total = Object.values(wentWell_cardValues).join(' ').toLowerCase().split(' ');
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
    console.log(wordsMaps_wentWell);
    setwentWellwords(wordsMaps_wentWell);
    
//for didn't went well word cloud
columns[WHAT_DIDNT_GO_WELL].groups.forEach(group =>
  group.cards.forEach(card => {
    const clean = card.value.replace(/[\W_]+/g, ' ').trim();

    if (clean !== '') didntWentWell_cardValues.push(clean);
  })
);
    const totalvalues = Object.values(didntWentWell_cardValues).join(' ').toLowerCase().split(' ');
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
    console.log(wordsMaps_didntWentWell);
    setdidntWentWellwords(wordsMaps_didntWentWell);




    const newQuestions = [] as Question[];
    const feedbackValues = {} as any;
    const feedbackCount = {} as any;
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
      user.pulseCheckQuestions.forEach(question => {
        const text = (questionsDef as any)[question.id];
        const entry = newQuestions.find(nq => nq.question === text);
        if (question.entry !== -1) {
          if (!entry) {
            newQuestions.push({
              question: text,
              '1': 0,
              '2': 0,
              '3': 0,
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

    //   <>
    //     <Typography
    //       variant="h5"
    //       sx={{ margin: '10px', fontSize: '18px', marginTop: '30px' }}
    //     >
    //       Pulse Check
    //     </Typography>
    //     <Box
    //       sx={{
    //         border: '2px solid gray',
    //         margin: '20px',
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //       }}
    //     >
    //       {questions.length !== 0 ? (
    //         <StackedBarChart questions={questions}></StackedBarChart>
    //       ) : (
    //         <span style={{ fontSize: '16px' }}>
    //           No responses have been submitted
    //         </span>
    //       )}
    //     </Box>{' '}
    //   </>

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
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '1150px',
        overflowY: 'scroll'
      }}
    >
      <Toolbar />
      <Grid display="flex" xs={8} sx={{ flexDirection: 'column' }} marginRight={commonStyles.m_209}
          marginLeft={commonStyles.m_209}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'column', //this will allow flex-end to move item to the right
            alignItems: 'center',
          }}
          mt="48px"
          
        >
          <Box sx={{ alignSelf: 'flex-end' }}>
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
            <Icons.Printer size={20} color="#4E4E4E"></Icons.Printer>
          </Box>
          <Box sx={{ alignSelf: 'center' }}>
            <Typography
              color={commonStyles.secondaryMain}
              fontSize={commonStyles.font16}
            >
              Summary
            </Typography>
          </Box>
        </Box>
        <Box style={{
            display: 'flex',
            flexDirection: 'row', 
            justifyContent: 'center',
            alignItems: 'center',
          }}
          mt='20px'>
        <Typography
              variant="h2"
              color={commonStyles.PrimaryMain} 
            >
              {global.currentRetro?.name}
            </Typography>
        </Box>
        <Box style={{
            display: 'flex',
            flexDirection: 'row', 
            justifyContent: 'center',
            alignItems: 'center',
          }}
          mt='12px'>
        <Typography
              variant="h4"
              color={commonStyles.PrimaryMain} 
            >
              {retroDate}
            </Typography>
        </Box>
        <Box mt='48px' sx={styles.whatWentwellBox}>
          <Typography ml='24px' mt='24px' color='#0B6623' variant='h4' sx={styles.textOpacity}>What Went Well</Typography>
          
          {wentWellwords.length !== 0 ? (
        <>
         
         <Box m='20px 412px 48px 412px' width='672px' height= '272px'>
            <WordCloud data={wentWellwords} showOn='whatWentWell'></WordCloud>
          </Box>{' '}
        </>
      ) : null}
       
        </Box>
        <Box mt='48px' sx={styles.whatdidnwellBox}>
        <Typography ml='24px' mt='24px' color='#F79722' variant='h4' sx={styles.textOpacity}>What Didn’t Go Well</Typography>
        {didntWentWellwords.length !== 0 ? (
        <>
         
         <Box m='20px 412px 48px 412px' width='672px' height= '272px'>
            <WordCloud data={didntWentWellwords} showOn='whatDidntWentWell'></WordCloud>
          </Box>{' '}
        </>
      ) : null}
        </Box>
        <Box mt='48px' sx={styles.actionBox}>
        <Typography ml='24px' mt='24px' color='#8A38F5' variant='h4' sx={styles.textOpacity}>Actions</Typography>
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
        <Box mt='48px' sx={styles.pulseCheckBox}>
        <Typography ml='24px' mt='24px' color='#343434' variant='h4' sx={styles.textOpacity}>Pulse Check</Typography>
        <Box
          sx={{
            
            margin: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {questions.length !== 0 ? (
            <StackedBarChart questions={questions}></StackedBarChart>
          ) : (
            <span style={{ fontSize: '16px' }}>
              No responses have been submitted
            </span>
          )}
        </Box>{' '}
        </Box>
        <Box mt='48px' sx={styles.facilitatorFeedbackBox}>
        <Typography ml='24px' mt='24px' color='#343434' variant='h4' sx={styles.textOpacity}>Feedback for facilitator</Typography>
        </Box>
        
      </Grid>
    </Box>
  );
});
