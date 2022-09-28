import {
  ACTIONS_COLUMN,
  FEEDBACK_QUESTIONS,
  FEEDBACK_QUESTIONS_COLORS,
  PULSE_CHECK_QUESTIONS,
  QUICK_PULSE_CHECK_QUESTIONS,
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

import { BoardContext } from '../contexts/BoardContext';
import React from 'react';
import { RetroColumn } from './RetroColumn';
import StarIcon from '@mui/icons-material/Star';

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

  const [words, setWords] = React.useState<Word[]>([]);
  const [actions, setActions] = React.useState<string[]>([]);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [feedback, setFeedback] = React.useState<any | undefined>();
  const [islanded, setIsLanded] =React.useState(true);
  React.useEffect(() => {
    const cardValues = [] as string[];
    console.log("startedDate",startedDate);
    columns[ACTIONS_COLUMN].groups.forEach(group =>
      group.cards.forEach(card => {
        actions.push(card.value);
      })
    );
    setActions(actions);

    columns[WHAT_WENT_WELL_COLUMN].groups.forEach(group =>
      group.cards.forEach(card => {
        const clean = card.value.replace(/[\W_]+/g, ' ').trim();
        if (clean !== '') cardValues.push(clean);
      })
    );

    const total = Object.values(cardValues).join(' ').toLowerCase().split(' ');
    let wordsMaps = [];
    if (total.length !== 0) {
      const noStopwords = removeStopwords(total, [
        ...eng,
        ...WORD_CLOUD_IGNORE_WORDS,
      ]);
      wordsMaps = noStopwords
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
    setWords(wordsMaps);

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
    <Box
      ref={ref}
      sx={{
        maxWidth: '1000px',
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      <Typography sx={{ margin: '20px 0  0 10px', fontSize: '16px' }}>
        Retro name :<span style={{ fontWeight: 'bold' }}>{retroName}</span>
      </Typography>
      <Typography sx={{ margin: '0 0 0 10px', fontSize: '16px' }}>
        Date :{' '}
        <span style={{ fontWeight: 'bold' }}>
          {startedDate?.toLocaleDateString()}
        </span>
      </Typography>

      {words.length !== 0 ? (
        <>
          <Typography
            variant="h5"
            sx={{ margin: '10px', fontSize: '18px', marginTop: '30px' }}
          >
            Celebrate what went well
          </Typography>
          <Box
            sx={{
              border: '2px solid gray',
              margin: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <WordCloud data={words}></WordCloud>
          </Box>{' '}
        </>
      ) : null}

      {actions.length !== 0 ? (
        <>
          <Typography
            variant="h5"
            sx={{ margin: '10px', fontSize: '18px', marginTop: '30px' }}
          >
            Actions
          </Typography>
          <RetroColumn
            leftHeaderComponent={undefined}
            rightHeaderComponent={undefined}
            noHeightLimit
            noHeader
            expandAllGroups
            column={columns[ACTIONS_COLUMN]}
            showEditBox={false}
            setIslanded={setIsLanded}
            setShowEditBox={() => {}}
            cardGroups={columns[ACTIONS_COLUMN].groups}
          />
        </>
      ) : null}

      <>
        <Typography
          variant="h5"
          sx={{ margin: '10px', fontSize: '18px', marginTop: '30px' }}
        >
          Pulse Check
        </Typography>
        <Box
          sx={{
            border: '2px solid gray',
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
      </>

      {/* {feedback ? ( */}
      <>
        <Typography
          variant="h5"
          sx={{ margin: '10px', fontSize: '18px', marginTop: '30px' }}
        >
          Feedback for facilitator
        </Typography>
        <Box
          sx={{
            border: '2px solid gray',
            margin: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom:"50px"
          }}
        >
          {feedback ? (
            <Grid container sx={{ justifyContent: 'center' }}>
              {FEEDBACK_QUESTIONS.map((v, index) => (
                <Grid
                  item
                  xs={12 / FEEDBACK_QUESTIONS.length}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Card variant="outlined" sx={{ margin: '10px' }}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        sx={{
                          justifyContent: 'center',
                          display: 'flex',
                          gap: '5px',
                          alignItems: 'center',
                        }}
                      >
                        {(feedback[0][index] / feedback[1][index]).toFixed(1)}
                        <StarIcon
                          sx={{
                            fontSize: 40,
                            color: FEEDBACK_QUESTIONS_COLORS[index],
                          }}
                        />
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          justifyContent: 'center',
                          display: 'flex',
                          gap: '5px',
                          alignItems: 'center',
                        }}
                      >
                        {feedback[1][index]} response
                        {feedback[1][index] === 1 ? '' : 's'}
                      </Typography>
                      <Typography>{FEEDBACK_QUESTIONS[index]}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <span style={{ fontSize: '16px' }}>
              No responses have been submitted
            </span>
          )}
        </Box>{' '}
      </>
      {/* ) : null} */}
    </Box>
  );
});
