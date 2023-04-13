import * as React from 'react';
import { Box, Grid, Typography, useMediaQuery, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import animation from '../../assets/img/Retro_Finished_SVG.png';
import './../../global.scss';
import './styles.scss';
import { ContainedButton } from '../../components';
import theme from '../../theme/theme';
import useScreenOrientation from '../../hooks/useScreenOrientation';
import BACILogo from '../../assets/img/bacilogo.png';
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

  const reloadPage = () => {
    window.location.reload();
    navigate(`/`);
  };

  return (
    <>
      <Box
        sx={{
          height: 'calc(var(--app-height))',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
            paddingLeft:
              isXsUp || window.screen.width <= 1280 ? '16px' : '56px',
            paddingRight: isXsUp || window.screen.width <= 1280 ? '16px' : '56px',
            paddingTop: isXsUp || window.screen.width <= 1280 ? '14px' : 0,
            paddingBottom: isXsUp || window.screen.width <= 1280 ? '14px' : 0,
            boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)!important',
            height: '64px',
          }}
        >
          <Link href="/">
            <img
              src={BACILogo}
              alt="Logo"
              style={{
                width: isXsUp ? '53px' : '82px',
                height: isXsUp ? '18px' : '28px',
              }}
              onClick={reloadPage}
            />
          </Link>
        </Box>
        {isXsUp || window.screen.width <= 1280 ? (
          <>
            {(orientation === PORTRAIT_PRIMARY ||
              orientation === PORTRAIT_SECONDARY) && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
                mt={3}
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
              </Box>
            )}
            {(orientation === LANDSCAPE_PRIMARY ||
              orientation === LANDSCAPE_SECONDARY) && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  padding: '16px',
                }}
                mt={3}
              >
                <Grid item xs={12}>
                  <Box>
                    <img
                      width={'280px'}
                      src={animation}
                      style={{ minWidth: '288px' }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
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
          <Grid container className="main" mt={3}>
            <Grid item>
              <img
                src={animation}
                style={{ widows: '100%', height: 'auto' }}
              ></img>
            </Grid>
            <Grid item>
              <Typography className="firstText">Retro is Finished</Typography>
            </Grid>
            <Grid item>
              <Typography className="secondText" mt={3}>
                Could not find the page you are looking for!
              </Typography>
            </Grid>
            <Grid item>
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
          </Grid>
        )}
      </Box>
    </>
  );
}
