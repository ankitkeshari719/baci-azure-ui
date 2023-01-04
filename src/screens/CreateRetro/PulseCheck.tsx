import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  Box,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive } from './const';

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
  onClickChange: (currentPanel: string) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
};

export function PulseCheck({
  expandedPanel,
  allPanels,
  onClickChange,
  onClickNext,
  onClickBack,
}: Props) {
  return (
    <>
      {/* Template Panel */}
      <Accordion
        expanded={expandedPanel === 'pulseCheckPanel'}
        sx={{ boxShadow: 'none' }}
      >
        <AccordionSummary>
          <Typography className="accordionSummary">
            Pulse Check Layout
          </Typography>
          {allPanels.includes('pulseCheckPanel') && (
            <Typography
              className="changeText"
              onClick={() => onClickChange('pulseCheckPanel')}
            >
              Change
            </Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <>
            <Carousel responsive={responsive}>
              <Card sx={styles.card}>
                <CardContent>
                  <Box
                    component="img"
                    sx={{
                      width: '348px',
                      height: '180px',
                      objectFit: 'cover',
                    }}
                    alt="Logo"
                    src="https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0="
                  />
                  <Typography
                    className="templateName"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    Pulse Check Not Required{' '}
                  </Typography>
                  <Typography
                    className="templateDescription"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    An oldie but a goodie, also known as the PPT Framework
                    created in the 60s, it has long been the benchmark to
                    understanding workforce management.{' '}
                  </Typography>
                  <Grid
                    container
                    sx={{ width: '88%', position: 'absolute', bottom: '16px' }}
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
              <Card sx={styles.card}>
                <CardContent>
                  <Box
                    component="img"
                    sx={{
                      width: '348px',
                      height: '180px',
                      objectFit: 'cover',
                    }}
                    alt="Logo"
                    src="https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0="
                  />
                  <Typography
                    className="templateName"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    Simple (3 Questions){' '}
                  </Typography>
                  <Typography
                    className="templateDescription"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    An oldie but a goodie, also known as the PPT Framework
                    created in the 60s, it has long been the benchmark to
                    understanding workforce management.
                  </Typography>
                  <Grid
                    container
                    sx={{ width: '88%', position: 'absolute', bottom: '16px' }}
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
              <Card sx={styles.card}>
                <CardContent>
                  <Box
                    component="img"
                    sx={{
                      width: '348px',
                      height: '180px',
                      objectFit: 'cover',
                    }}
                    alt="Logo"
                    src="https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0="
                  />
                  <Typography
                    className="templateName"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    Business Agility (7 Questions){' '}
                  </Typography>
                  <Typography
                    className="templateDescription"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    An oldie but a goodie, also known as the PPT Framework
                    created in the 60s, it has long been the benchmark to
                    understanding workforce management. picture.{' '}
                  </Typography>
                  <Grid
                    container
                    sx={{ width: '88%', position: 'absolute', bottom: '16px' }}
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
