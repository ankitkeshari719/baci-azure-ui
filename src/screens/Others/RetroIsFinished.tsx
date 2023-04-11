import * as React from 'react';
import { Box, Grid, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import animation from '../../assets/img/Retro_Finished_SVG.png';
import './../../global.scss';
import './styles.scss';
import { ContainedButton } from '../../components';
import theme from '../../theme/theme';
import useScreenOrientation from '../../hooks/useScreenOrientation';
import {
  LANDSCAPE_PRIMARY,
  LANDSCAPE_SECONDARY,
  PORTRAIT_PRIMARY,
  PORTRAIT_SECONDARY,
} from '../CreateRetro/const';

export function RetroIsFinished() {
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const orientation = useScreenOrientation();

  React.useEffect(() => {
    sessionStorage.removeItem('BoardContext');
    sessionStorage.removeItem('GlobalContext');
    sessionStorage.removeItem('retroname');
    sessionStorage.removeItem('showManual');
    localStorage.removeItem('selectedTemplate');
    localStorage.removeItem('tempSelectedTemplateData');
  }, []);

  const navigate = useNavigate();

  function goToLanding() {
    navigate(`/`);
  }

  return (
    <>
      {isXsUp || window.innerWidth < 700 ? (
        <>
          {(orientation === PORTRAIT_PRIMARY ||
            orientation === PORTRAIT_SECONDARY) && (
            <Box
              sx={{
                height: 'calc(var(--app-height))',
                overflowY: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <Box>
                <img
                  width={'280px'}
                  src={animation}
                  style={{ minWidth: '288px' }}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography className="firstText">Retro is Finished</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography className="secondText" mt={3}>
                  Could not find the page you are looking for!
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ContainedButton
                  id="goHome"
                  name="Go Home"
                  onClick={() => goToLanding()}
                  style={{
                    minWidth: '116px !important',
                    width: '116px !important',
                    height: '40px !important',
                    marginTop: '24px !important',
                  }}
                />
              </Box>
            </Box>
          )}
          {(orientation === LANDSCAPE_PRIMARY ||
            orientation === LANDSCAPE_SECONDARY) && (
            <Box
              sx={{
                height: 'calc(var(--app-height))',
                overflowY: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <Grid item xs={6}>
                <Box>
                  <img
                    width={'280px'}
                    src={animation}
                    style={{ minWidth: '288px' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography className="firstText">
                    Retro is Finished
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography className="secondText" mt={3}>
                    Could not find the page you are looking for!
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ContainedButton
                    id="goHome"
                    name="Go Home"
                    onClick={() => goToLanding()}
                    style={{
                      minWidth: '116px !important',
                      width: '116px !important',
                      height: '40px !important',
                      marginTop: '24px !important',
                    }}
                  />
                </Box>
              </Grid>
            </Box>
          )}
        </>
      ) : (
        <Grid container className="main">
          <img src={animation} style={{ widows: '100%', height: 'auto' }}></img>
          <Typography className="firstText">Retro is Finished</Typography>
          <Typography className="secondText" mt={3}>
            Could not find the page you are looking for!
          </Typography>
          <ContainedButton
            id="goHome"
            name="Go Home"
            onClick={() => goToLanding()}
            style={{
              minWidth: '116px !important',
              width: '116px !important',
              height: '40px !important',
              marginTop: '24px !important',
            }}
          />
        </Grid>
      )}
    </>
  );
}
