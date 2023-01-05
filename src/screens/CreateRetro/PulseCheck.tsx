import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { pulseChecksData, pulseCheckInterface, responsive } from './const';

const styles = {
  card: {
    maxWidth: '420px',
    height: '400px',
    background: '#ffffff',
    borderRadius: '2px',
    margin: '8px',
    '&:hover': {
      backgroundColor: 'rgba(206, 239, 255, 0.4)',
    },
  },
};

type Props = {
  expandedPanel: string;
  allPanels: string[];
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
  selectedPulseCheck: pulseCheckInterface | null;
  handlePulseCheck: (selectedPulseCheck: pulseCheckInterface) => void;
};

export function PulseCheck({
  expandedPanel,
  allPanels,
  onClickNext,
  onClickBack,
  selectedPulseCheck,
  handlePulseCheck,
}: Props) {
  return (
    <>
      {/* Template Panel */}
      <Accordion
        expanded={expandedPanel === 'pulseCheckPanel'}
        sx={{
          borderRadius: '0px',
        }}
      >
        <AccordionSummary>
          {allPanels.includes('pulseCheckPanel') &&
          selectedPulseCheck != null ? (
            <Typography className="accordionSummary">
              {selectedPulseCheck.name}
            </Typography>
          ) : (
            <Typography className="accordionSummary">
              Pulse Check Layout
            </Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <>
            <Carousel responsive={responsive}>
              {pulseChecksData.map(pulseCheck => {
                return (
                  <Card
                    sx={styles.card}
                    onClick={() => handlePulseCheck(pulseCheck)}
                  >
                    <CardContent>
                      {!pulseCheck.checked ? (
                        <Box
                          component="img"
                          sx={{
                            width: '348px',
                            height: '180px',
                          }}
                          alt="Logo"
                          src={pulseCheck.templateImageNotChecked}
                        />
                      ) : (
                        <Box
                          component="img"
                          sx={{
                            width: '348px',
                            height: '180px',
                          }}
                          alt="Logo"
                          src={pulseCheck.templateImageChecked}
                        />
                      )}
                      <Typography
                        className="templateName"
                        component="div"
                        sx={{ mt: 1 }}
                      >
                        {pulseCheck.name}
                      </Typography>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 1 }}
                      >
                        {pulseCheck.description}
                      </Typography>
                      <Grid
                        container
                        sx={{
                          width: '88%',
                          position: 'absolute',
                          bottom: '16px',
                        }}
                      >
                        <Grid item sm={12}>
                          <Box display="flex" justifyContent="flex-start">
                            <Button
                              size="small"
                              // onClick={handleClickOpen}
                              sx={{ padding: '0px' }}
                            >
                              <Typography className="textLink">
                                Learn More
                              </Typography>
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </Carousel>
            <Grid container spacing={0}>
              <Grid item sm={1}>
                <Button
                  variant="contained"
                  className="nextButton"
                  onClick={() =>
                    onClickNext('pulseCheckPanel', 'userDetailPanel')
                  }
                >
                  Next
                </Button>
              </Grid>
              <Grid item sm={1}>
                <Button
                  variant="outlined"
                  className="backButton"
                  onClick={() => onClickBack('templatePanel')}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
