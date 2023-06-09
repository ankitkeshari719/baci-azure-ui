import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import commonStyles from './../../style.module.scss';
import gif from '../../assets/img/participant_waiting.gif';
import useLoadRetro from '../../helpers/hooks/useLoadRetro';
import StartRetroButton from '../../components/Elements/StartRetroButton';
import Toolbar from '../../components/Elements/Toolbar';
import { GlobalContext } from '../../contexts/GlobalContext';
import theme from '../../helpers/theme/theme';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import useReRoute from '../../helpers/hooks/useReRoute';

export function ParticipantWaitingPage() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [retroName, setRetroName] = React.useState(
    sessionStorage.getItem('retroname') || ''
  );
  const [animateFirst, setAnimateFirst] = React.useState(false);
  const [animatesecond, setAnimatesecond] = React.useState(false);
  const [animateThird, setAnimateThird] = React.useState(false);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));

  // Re-Routing rules added
  useReRoute();

  useLoadRetro();

  return (
    <>
      {isXsUp ? (
        <Box
          sx={{
            height: 'calc(var(--app-height))',
            overflowY: 'auto',
          }}
        >
          <DeploymentPopUp />
          <Toolbar />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              margin: '8px',
            }}
          >
            {/* Welcome Text */}
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '28px',
                textAlign: 'center',
                letterSpacing: '0.5px',
                color: '#2C69A1',
              }}
            >
              Welcome to ‘{global?.currentRetro?.name}’ !
            </Typography>
            {/* Lets go Text */}
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '20px',
                textAlign: 'center',
                letterSpacing: '0.6px',
                color: '#2C69A1',
                marginTop: '8px',
              }}
            >
              Let’s go over last 2 weeks
            </Typography>
            {/* Relax facilitator Text */}
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '20px',
                textAlign: 'center',
                letterSpacing: '0.6px',
                color: '#EE7538',
                marginTop: '24px',
              }}
            >
              Relax while facilitator starts the retro...
            </Typography>
            {/* Image */}
            <Box sx={{ marginTop: '8px' }}>
              <img
                width={'280px'}
                src={gif}
                style={{ minWidth: '288px' }}
              ></img>
            </Box>
          </Box>
          <StartRetroButton></StartRetroButton>
        </Box>
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
                marginTop: '16px',
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
