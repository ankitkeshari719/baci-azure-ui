import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { CreateSessionWithTemplatePage } from '../../screens/CreateSession/CreateSessionWithTemplatePage';
import { TopBar } from '../../screens/CreateSession/TopBar';
// import { ShareParticipants } from './shareParticipants';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import '../CreateSession/styles.scss'

export function CreateSessionMain() {
  const [isRetroStart, setIsRetroStart] = React.useState<boolean>(false);

  function handleStartRetro() {
    setIsRetroStart(true);
  }

  return (
    <>
      <Box className="mainContainer" sx={{ overflowY: 'auto' }}>
        <DeploymentPopUp />
        <TopBar />
        {isRetroStart ? (
          <Grid
            container
            spacing={0}
            sx={{ height: 'calc(100vh - 64px) !important' }}
          >
            <Grid
              item
              xs={7}
              sx={{
                padding: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              <CreateSessionWithTemplatePage
                handleStartRetro={handleStartRetro}
                isRetroStart={isRetroStart}
              />
            </Grid>
            <Grid item xs={5}>
              {/* <ShareParticipants /> */}
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={0} style={{padding:"25px"}}>
            <Grid item xs={12}>
              <CreateSessionWithTemplatePage
                handleStartRetro={handleStartRetro}
                isRetroStart={isRetroStart}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
}
