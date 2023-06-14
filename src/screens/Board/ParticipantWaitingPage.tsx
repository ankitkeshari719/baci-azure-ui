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
import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  H2SemiBoldTypography,
  H4RegularTypography,
} from '../../components/CustomizedTypography';

export function ParticipantWaitingPage() {
  const [global, dispatch] = React.useContext(GlobalContext);
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
            <H4RegularTypography
              label={'Welcome to ‘' + global?.currentRetro?.name + '’ !'}
              style={{ color: '#2C69A1', textAlign: 'center' }}
            />
            {/* Lets go Text */}
            <BodyRegularTypography
              label={'Let’s go over last 2 weeks'}
              style={{
                textAlign: 'center',
                color: '#2C69A1',
                marginTop: '8px',
              }}
            />
            {/* Relax facilitator Text */}
            <BodySemiBoldTypography
              label={'Relax while facilitator starts the retro...'}
              style={{
                textAlign: 'center',
                color: '#EE7538',
                marginTop: '24px',
              }}
            />
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
              <H2SemiBoldTypography
                label={'Welcome to ‘' + global?.currentRetro?.name + '’ !'}
                style={{ color: '#2C69A1', textAlign: 'center' }}
              />
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
              <H4RegularTypography
                label={'Let’s go over last 2 weeks'}
                style={{
                  textAlign: 'center',
                  color: '#2C69A1',
                  marginTop: '8px',
                }}
              />
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
              <H4RegularTypography
                label={'Relax while facilitator starts the retro...'}
                style={{
                  textAlign: 'center',
                  color: '#EE7538',
                  marginTop: '24px',
                }}
              />
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
