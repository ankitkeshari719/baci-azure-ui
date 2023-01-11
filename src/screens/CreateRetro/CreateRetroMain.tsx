import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { CreateRetroWithTemplatePage } from './CreateRetroWithTemplatePage';
import { TopBar } from './TopBar';
import { ShareParticipants } from './shareParticipants';

export function CreateRetroMain() {
  const [isRetroStart, setIsRetroStart] = React.useState<boolean>(false);

  function handleStartRetro() {
    setIsRetroStart(true);
  }

  return (
    <>
      <Box className="mainContainer">
        <TopBar />
        <Grid container spacing={0}>
          <Grid item xs={12} md={isRetroStart ? 7 : 12}>
            <CreateRetroWithTemplatePage
              handleStartRetro={handleStartRetro}
              isRetroStart={isRetroStart}
            />
          </Grid>
          {isRetroStart && (
            <Grid item xs={12} md={5}>
              <ShareParticipants />
            </Grid>
          )}
        </Grid>
      </Box>
    </>
  );
}
