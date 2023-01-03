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

type Props = {
  expandedPanel: string;
  allPanels: string[];
  onClickChange: (currentPanel: string) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
};

export function RetroTemplate({
  expandedPanel,
  allPanels,
  onClickChange,
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
      <Accordion expanded={expandedPanel === 'templatePanel'}>
        <AccordionSummary>
          <Typography className="accordionSummary">Retro Template</Typography>
          {allPanels.includes('templatePanel') && (
            <Typography
              className="changeText"
              onClick={() => onClickChange('templatePanel')}
            >
              Change
            </Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <>
            <Carousel responsive={responsive}>
              <Card className="card">
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="180"
                  image="https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0="
                />
                <CardContent>
                  <Typography className="templateName" component="div">
                    Simple 1
                  </Typography>
                  <Typography variant="body2" className="templateDescription">
                    A classic template for retros.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button size="small" onClick={handleClickOpen}>
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
                </CardActions>
              </Card>
              <Card className="card">
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="180"
                  image="https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0="
                />
                <CardContent>
                  <Typography className="templateName" component="div">
                    Simple 2
                  </Typography>
                  <Typography variant="body2" className="templateDescription">
                    A classic template for retros.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button size="small" onClick={handleClickOpen}>
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
                </CardActions>
              </Card>
              <Card className="card">
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="180"
                  image="https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0="
                />
                <CardContent>
                  <Typography className="templateName" component="div">
                    Simple 3
                  </Typography>
                  <Typography variant="body2" className="templateDescription">
                    A classic template for retros.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button size="small">
                          <Typography
                            className="textLink"
                            onClick={handleClickOpen}
                          >
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
                </CardActions>
              </Card>
              <Card className="card">
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="180"
                  image="https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0="
                />
                <CardContent>
                  <Typography className="templateName" component="div">
                    Simple4
                  </Typography>
                  <Typography variant="body2" className="templateDescription">
                    A classic template for retros.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button size="small">
                          <Typography
                            className="textLink"
                            onClick={handleClickOpen}
                          >
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
                </CardActions>
              </Card>
              <Card className="card">
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="180"
                  image="https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0="
                />
                <CardContent>
                  <Typography className="templateName" component="div">
                    Simple 5
                  </Typography>
                  <Typography variant="body2" className="templateDescription">
                    A classic template for retros.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button size="small">
                          <Typography
                            className="textLink"
                            onClick={handleClickOpen}
                          >
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
                </CardActions>
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
