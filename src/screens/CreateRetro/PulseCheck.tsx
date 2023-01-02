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
      <Accordion expanded={expandedPanel === 'pulseCheckPanel'}>
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
              <Card className="card">
                <CardMedia
                  component="img"
                  alt="green iguana"
                  height="180"
                  image="https://media.istockphoto.com/id/1406155599/photo/we-want-your-feedback.webp?s=612x612&w=is&k=20&c=SJY9YoM9glSQj7b0vyyCESaq17t9bs1R6Ah5P5Javk0="
                />
                <CardContent>
                  <Typography className="templateName" component="div">
                    Pulse Check Not Required
                  </Typography>
                  <Typography variant="body2" className="templateDescription">
                    Pulse Check Desc.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button size="small">
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
                    Simple (3 Questions)
                  </Typography>
                  <Typography variant="body2" className="templateDescription">
                    Pulse Check Desc.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button size="small">
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
                    Business Agility (7 Questions)
                  </Typography>
                  <Typography variant="body2" className="templateDescription">
                    Pulse Check Desc.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Grid container>
                    <Grid item sm={6}>
                      <Box display="flex" justifyContent="flex-start">
                        <Button size="small">
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
