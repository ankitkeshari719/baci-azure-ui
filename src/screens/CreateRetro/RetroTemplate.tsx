import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Button,
  Card,
  CardContent,
  Box,
  Grid,
  Dialog,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { responsive, templatesData } from './const';
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
  selectedTemplate: any;
  handleTemplate: (selectedPulseCheck: any) => void;
};

export function RetroTemplate({
  expandedPanel,
  allPanels,
  onClickNext,
  onClickBack,
  handleTemplate
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
              {templatesData.map(template => {
                return (
                  <Card sx={styles.card} onClick={() => handleTemplate(template)}>
                    <CardContent>
                      <Box
                        component="img"
                        sx={{
                          width: '348px',
                          height: '180px',
                          objectFit: 'cover',
                        }}
                        alt="Logo"
                        src={template.templateImage}
                      />
                      <Typography
                        className="templateName"
                        component="div"
                        sx={{ mt: 1 }}
                      >
                        {template.templateName}
                      </Typography>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 1 }}
                      >
                        {template.templateDescription}
                      </Typography>
                      <Grid
                        container
                        sx={{
                          width: '88%',
                          position: 'absolute',
                          bottom: '16px',
                        }}
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
                );
              })}
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
