import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  Link,
  Slide,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import { FEATURE_FLAGS } from '../constants';
import React from 'react';
//import { addFeedback } from '../firebase/firestore';
import { addFeedback } from '../msal/services';


import { useNavigate } from 'react-router-dom';

export function Offboarding() {
  const [global, dispatch] = useContext(GlobalContext);
  const [rating, setRating] = useState(-1);
  const [comments, setComments] = useState('');
  const [done, setDone] = useState(!FEATURE_FLAGS.rateApp);
  const navigate = useNavigate();

  const endOffboarding = () => {
    dispatch({ type: ActionType.CLOSE_CURRENT_RETRO });
    navigate('/');
  };

  const submitFeedback = async () => {
    if (rating !== -1 || comments !== '') {
      await addFeedback(
        global.currentRetro?.id as string,
        global.user,
        rating,
        comments
      );
    }
    if (global.currentRetro?.creatorId === global.user.id) {
      navigate('/report/' + global.currentRetro.id);
      return;
    }
    setDone(true);
  };

  return (
    <>
      <CssBaseline />
      <Slide direction="up" in={!done}  key="rate">
        <Box
          sx={{
            display: !done ? 'flex' : 'none',
            height: 'var(--app-height)',
            padding: '60px',
            overflowY: 'scroll',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '18px',
              color: 'white',
              background: '#695F9B',
              width: '100%',
              padding: '10px',
            }}
          >
            Please rate the app, so we can improve
          </Typography>
          <Divider sx={{ margin: '20px' }}></Divider>
          <FormControl sx={{ flexDirection: 'column', display: 'flex' }}>
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              Do you like the BACI app?
            </Typography>
            <Box
              sx={{
                flexDirection: 'row',
                display: 'flex',
                gap: '20px',
                padding: '20px',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={1} />
                {[1, 2, 3, 4, 5].map(i => (
                  <Grid
                    item
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                    xs={2}
                  >
                    <Button
                      sx={{ color: '#FCB34C', padding: 0 }}
                      onClick={() => setRating(i)}
                      onTouchStart={() => setRating(i)}
                    >
                      {i > rating ? (
                        <EmojiEventsOutlinedIcon sx={{ fontSize: 40 }} />
                      ) : (
                        <EmojiEventsIcon sx={{ fontSize: 40 }} />
                      )}
                    </Button>
                  </Grid>
                ))}
                <Grid item xs={1} />
              </Grid>
            </Box>
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
                marginBottom: '10px',
              }}
            >
              Any final comments?
            </Typography>
            <TextField
              variant="outlined"
              value={comments}
              sx={{ fontSize: '20px' }}
              onChange={e => setComments(e.currentTarget.value)}
              multiline
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  submitFeedback();
                }
              }}
            />
          </FormControl>
          <Divider sx={{ margin: '20px' }}></Divider>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            <Button
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#159ADD',
                color: '#fff',
                minWidth: '300px',
              }}
              onClick={() => submitFeedback()}
            >
              Submit
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              marginTop: '20px',
            }}
          >
            <Link
              sx={{
                textAlign: 'center',
                cursor: 'pointer',
                color: '#727D84',
                textDecorationColor: '#727D84',
                fontSize: '0.9rem',
              }}
              onClick={() => setDone(true)}
            >
              Skip
            </Link>
          </Box>
        </Box>
      </Slide>
      <Slide direction="up" in={done} key="thank-you">
        <Box
          sx={{
            display: done ? 'flex' : 'none',
            height: 'var(--app-height)',
            width: '100vw',
            overflowY: 'scroll',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">Thank you!</Typography>
          <Typography
            sx={{
              textAlign: 'center',
              margin: '10px 0',
              fontWeight: 'normal',
              fontSize: '20px',
            }}
          >
            We hope to see you again soon
          </Typography>
          <Box
            sx={{ display: 'flex', justifyContent: 'center', margin: '30px 0' }}
          >
            <Button
              sx={{
                maxWidth: '60px',
                backgroundColor: '#5BA8DD',
                ':hover': { background: '#5BA8DD' },
              }}
              onClick={endOffboarding}
            >
              <img src="/images/happy-button.png" width="70%" />
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              minHeight: '10vh',
            }}
          >
            <Link
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={endOffboarding}
            >
              To return to the main page click here
            </Link>
          </Box>
        </Box>
      </Slide>
    </>
  );
}
