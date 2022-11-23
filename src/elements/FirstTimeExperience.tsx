import { Button, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const FirstTimeExperience = () => {
  const finishRetro = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let elem = document.getElementById('publish0');
    // if (elem != null && elem != undefined) {elem.style.backgroundColor = 'red';
    if (elem != null && elem != undefined) {
      console.log(elem.getBoundingClientRect(), 'vishal');
      var d = document.getElementById('publishDiv');
      var publishPaper = document.getElementById('publishPaper');
      if (d != null && d !== undefined) {
        d.style.position = 'absolute';

        d.style.left = elem.getBoundingClientRect().x - 12 + 'px';
        d.style.top =
          elem.getBoundingClientRect().y -
          elem.getBoundingClientRect().width / 2 +
          'px';
        d.style.width = elem.getBoundingClientRect().width + 'px';
        d.style.height = elem.getBoundingClientRect().width + 'px';
        d.style.padding = '10px';
        if (publishPaper != null && publishPaper != undefined) {
          publishPaper.style.display = 'flex';
          publishPaper.style.top =
            elem.getBoundingClientRect().y +
            elem.getBoundingClientRect().width / 2 +
            'px';
          publishPaper.style.left =
            elem.getBoundingClientRect().x +
            elem.getBoundingClientRect().width +
            'px';
        }
      }
    }
    showFinish();
  }, []);

  const showFinish = () => {
    let elem = document.getElementById('finishRetro');
    let publishPaper = document.getElementById('publishPaper');
    if (publishPaper != null && publishPaper != undefined)
      publishPaper.style.display = 'none';

    // if (elem != null && elem != undefined) {elem.style.backgroundColor = 'red';
    if (elem != null && elem != undefined) {
      console.log(elem.getBoundingClientRect(), 'vishal');
      var d = document.getElementById('publishDiv');
      var finishPaper = document.getElementById('finishPaper');
      if (d != null && d !== undefined) {
        d.style.position = 'absolute';

        d.style.left = elem.getBoundingClientRect().x - 12 + 'px';
        d.style.top =
          elem.getBoundingClientRect().y -
          elem.getBoundingClientRect().width / 2 +
          'px';
        d.style.width = elem.getBoundingClientRect().width + 'px';
        d.style.height = elem.getBoundingClientRect().width + 'px';
        d.style.padding = '10px';
        if (finishPaper != null && finishPaper != undefined) {
          finishPaper.style.display = 'flex';
          finishPaper.style.top =
            elem.getBoundingClientRect().y +
            elem.getBoundingClientRect().width / 2 +
            'px';
          finishPaper.style.left =
            elem.getBoundingClientRect().x -
            finishPaper.getBoundingClientRect().width +
            // elem.getBoundingClientRect().width +
            'px';
        }
      }
    }
  };
  return (
    <div>
      <Box
        sx={{
          zIndex: '10000',
          position: 'absolute',
          width: '100%',
          display: 'flex',
          height: '100vh',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'gray',
          opacity: 0.2,
        }}
      >
        <div
          id="publishDiv"
          style={{
            background: 'antiquewhite',
            borderRadius: '50%',
            border: '2px solid white',
          }}
        ></div>

        <div
          id="finishRetroDiv"
          style={{
            background: 'antiquewhite',
            borderRadius: '50%',
            border: '2px solid white',
          }}
        ></div>
      </Box>
      <Paper
        id="publishPaper"
        sx={{
          width: '434px',
          height: '258px',
          zIndex: '100001',
          position: 'absolute',
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          color: '#EE7538',
          fontSize: '16px',
          padding: '15px',
        }}
        elevation={3}
      >
        <Typography pl="47" pr="47">
          1/2
        </Typography>
        <Typography align="center" pl="47" pr="47">
          Participants see their own cards only until you click ‘Publish’.
          Participants will then see all cards, grouping and will be able to
          vote
        </Typography>
        <Box sx={{ display: 'flex', flexDiection: 'row', width: '80%' }}>
          <Box sx={{ display: 'flex', width: '35%' }}></Box>
          <Box
            component="span"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '65%',
              alignItems: 'center',
              height: '40px',
              justifyContent: 'space-between',
            }}
          >
            <Button
              variant="contained"
              sx={{
                padding: '10px 20px',
                borderRadius: '24px',
                fontSize: '16px',
                width: '100px',
              }}
            >
              Next
            </Button>
            <Typography
              sx={{
                color: '#4285F4',
                textDecorationLine: 'underline',
                cursor: 'pointer',
              }}
            >
              Skip Intro
            </Typography>
          </Box>
        </Box>
      </Paper>
      <Paper
        id="finishPaper"
        sx={{
          width: '434px',
          height: '258px',
          zIndex: '100001',
          position: 'absolute',
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          color: '#EE7538',
          fontSize: '16px',
          padding: '15px',
        }}
        elevation={3}
      >
        <Typography pl="47" pr="47">
          2/2
        </Typography>
        <Typography align="center" pl="47" pr="47">
          Hit "FINISH RETRO" at the end of the session to access Retro Summary.
          All Participants will see Feedback questions
        </Typography>
        <Box sx={{ display: 'flex', flexDiection: 'row', width: '80%' }}>
          <Box
            component="span"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '65%',
              alignItems: 'center',
              height: '40px',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              sx={{
                color: '#4285F4',
                textDecorationLine: 'underline',
                cursor: 'pointer',
              }}
            >
              Back
            </Typography>
            <Button
              variant="contained"
              sx={{
                padding: '10px 20px',
                borderRadius: '24px',
                fontSize: '16px',
                width: '100px',
              }}
            >
              Done
            </Button>
          </Box>
          <Box sx={{ display: 'flex', width: '35%' }}></Box>
        </Box>
      </Paper>
    </div>
  );
};

export default FirstTimeExperience;
