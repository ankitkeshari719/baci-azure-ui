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
  Box,
  Grid,
  Dialog,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive } from './const';
import { LearnMore } from './LearnMore';

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
};

export function RetroTemplate({
  expandedPanel,
  allPanels,
  onClickNext,
  onClickBack,
}: Props) {
  const [openLearnMoreDialog, setOpenLearnMoreDialog] = React.useState(false);

  const handleClickOpen = () => {
    setOpenLearnMoreDialog(true);
  };

  const handleClose = () => {
    setOpenLearnMoreDialog(false);
  };

  return (
    <>
      {/* Template Panel */}
      <Accordion
        expanded={expandedPanel === 'templatePanel'}
        sx={{
          borderRadius: '0px',
        }}
      >
        <AccordionSummary>
          <Typography className="accordionSummary">Retro Template</Typography>
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
                    Simple 1
                  </Typography>
                  <Typography
                    className="templateDescription"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    A classic template for retros.
                  </Typography>
                  <Grid
                    container
                    sx={{ width: '88%', position: 'absolute', bottom: '16px' }}
                  >
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button
                          size="small"
                          onClick={handleClickOpen}
                          sx={{ padding: '0px' }}
                        >
                          <Typography className="textLink">
                            Learn More
                          </Typography>
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          className="customButton"
                        >
                          <Typography className="customText">
                            Customize
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
                    4L Retrospective
                  </Typography>
                  <Typography
                    className="templateDescription"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    For the team to share how they feel in a structured manner
                    and capture key learnings and ideas to progress.
                  </Typography>
                  <Grid
                    container
                    sx={{ width: '88%', position: 'absolute', bottom: '16px' }}
                  >
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button
                          size="small"
                          onClick={handleClickOpen}
                          sx={{ padding: '0px' }}
                        >
                          <Typography className="textLink">
                            Learn More
                          </Typography>
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          className="customButton"
                        >
                          <Typography className="customText">
                            Customize
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
                    Sailboat
                  </Typography>
                  <Typography
                    className="templateDescription"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    A fun way to think differently and reflect on the bigger
                    picture.{' '}
                  </Typography>
                  <Grid
                    container
                    sx={{ width: '88%', position: 'absolute', bottom: '16px' }}
                  >
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button
                          size="small"
                          onClick={handleClickOpen}
                          sx={{ padding: '0px' }}
                        >
                          <Typography className="textLink">
                            Learn More
                          </Typography>
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          className="customButton"
                        >
                          <Typography className="customText">
                            Customize
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
                    Start, Stop , Continue{' '}
                  </Typography>
                  <Typography
                    className="templateDescription"
                    component="div"
                    sx={{ mt: 1 }}
                  >
                    The traffic light retro gives everyone in the team an
                    opportunity to talk and quickly identify bottlenecks.{' '}
                  </Typography>
                  <Grid
                    container
                    sx={{ width: '88%', position: 'absolute', bottom: '16px' }}
                  >
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button
                          size="small"
                          onClick={handleClickOpen}
                          sx={{ padding: '0px' }}
                        >
                          <Typography className="textLink">
                            Learn More
                          </Typography>
                        </Button>
                      </Box>
                    </Grid>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          size="small"
                          className="customButton"
                        >
                          <Typography className="customText">
                            Customize
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
                    onClickNext('templatePanel', 'pulseCheckPanel')
                  }
                >
                  Next
                </Button>
              </Grid>
              <Grid item sm={1}>
                <Button
                  variant="outlined"
                  className="backButton"
                  onClick={() => onClickBack('detailsPanel')}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </>
        </AccordionDetails>
      </Accordion>
      <Dialog fullScreen open={openLearnMoreDialog} onClose={handleClose}>
        <LearnMore handleClose={handleClose} />
      </Dialog>
    </>
  );
}
