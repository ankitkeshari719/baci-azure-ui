import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import commonStyles from './../../style.module.scss';
import gif from '../../assets/img/participant_waiting.gif';
import useLoadRetro from '../../hooks/useLoadRetro';
import StartRetroButton from '../../elements/StartRetroButton';
import Toolbar from '../../elements/Toolbar';
import { GlobalContext } from '../../contexts/GlobalContext';
import theme from '../../theme/theme';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';

export function ParticipantWaitingPage() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [retroName, setRetroName] = React.useState(
    sessionStorage.getItem('retroname') || ''
  );
  const [animateFirst, setAnimateFirst] = React.useState(false);
  const [animatesecond, setAnimatesecond] = React.useState(false);
  const [animateThird, setAnimateThird] = React.useState(false);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  useLoadRetro();
  return (
    <>
      {isXsUp ? (
        <Grid container>
          <DeploymentPopUp />
          <Box sx={{ width: '100%', height: 'calc(100vh)', overflowY: 'auto' }}>
            <Grid xs={12} item>
              <Toolbar />
            </Grid>
            <Grid xs={12} item>
              <Box
                sx={{
                  height: 'calc(100vh - 100px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  margin: '8px',
                }}
              >
                {/* Welcome Text */}
                <Typography variant="h6" color={commonStyles.primaryDark}>
                  Welcome to ‘{global?.currentRetro?.name}’ !
                </Typography>
                {/* Lets go Text */}
                <Typography
                  color={commonStyles.primaryDark}
                  variant="h6"
                  sx={{ marginTop: '8px' }}
                >
                  Let’s go over last 2 weeks
                </Typography>
                {/* Relax facilitator Text */}
                <Typography
                  color={commonStyles.secondaryMain}
                  variant="h6"
                  sx={{ marginTop: '56px' }}
                >
                  Relax while facilitator starts the retro...
                </Typography>
                {/* Image */}
                <Box sx={{ marginTop: '32px' }}>
                  <img width={'280px'} src={gif}></img>
                </Box>
              </Box>
            </Grid>
          </Box>
          <StartRetroButton></StartRetroButton>
        </Grid>
      ) : (
        <Grid container>
          <Box
            style={{
              width: '100%',
              height: 'calc(100vh)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflowY: 'auto',
            }}
          >
            <DeploymentPopUp />
            <Grid xs={12} item>
              <Toolbar />
            </Grid>
            {/* Welcome Text */}
            <Grid
              xs={12}
              item
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Typography variant="h2" color={commonStyles.primaryDark}>
                Welcome to ‘{global?.currentRetro?.name}’ !
              </Typography>
            </Grid>
            {/* Lets go Text */}
            <Grid
              xs={12}
              item
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Typography color={commonStyles.primaryDark} variant="h4">
                Let’s go over last 2 weeks
              </Typography>
            </Grid>
            {/* Relax facilitator Text */}
            <Grid
              xs={12}
              item
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <Typography color={commonStyles.secondaryMain} variant="h4">
                Relax while facilitator starts the retro...
              </Typography>
            </Grid>
            {/* Image */}
            <Grid
              xs={12}
              item
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <img width={isXsUp ? '280px' : '500px'} src={gif}></img>
            </Grid>
          </Box>
          <StartRetroButton></StartRetroButton>
        </Grid>
      )}
    </>
  );
}
