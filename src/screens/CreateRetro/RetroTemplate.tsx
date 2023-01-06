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
  activePanel: string;
  expandedPanel: string;
  allPanels: string[];
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
  selectedTemplate: any;
  handleTemplate: (selectedPulseCheck: any) => void;
};

export function RetroTemplate({
  activePanel,
  expandedPanel,
  allPanels,
  onClickNext,
  onClickBack,
  handleTemplate,
  selectedTemplate,
}: Props) {
  const [openLearnMoreDialog, setOpenLearnMoreDialog] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  const handleClickOpen = () => {
    setOpenLearnMoreDialog(true);
  };

  const handleClose = () => {
    setOpenLearnMoreDialog(false);
  };

  return (
    <>
      {/* Template Panel */}
      <Box sx={{ borderBottom: 1, borderColor: '#CCCCCC', py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          {activePanel != 'templatePanel' && selectedTemplate != null ? (
            <>
              <Box
                className="accordionSummary"
                sx={{
                  color:
                    activePanel != 'templatePanel' &&
                    selectedTemplate?.templateName != ''
                      ? '#4E4E4E'
                      : '#2c69a1',
                }}
              >
                {selectedTemplate?.templateName}
              </Box>
              <Box className="timeframeSummary">Customized</Box>
            </>
          ) : (
            <Typography className="accordionSummary">Retro Template</Typography>
          )}
        </Box>
        {activePanel === 'templatePanel' && (
          <Box sx={{ mt: 4 }}>
            <>
              {templatesData.map(template => {
                return (
                  <Card
                    sx={{
                      maxWidth: '420px',
                      height: height / 2 - 100 + 'px',
                      background: '#ffffff',
                      borderRadius: '2px',
                      margin: '8px',
                      '&:hover': {
                        backgroundColor: 'rgba(206, 239, 255, 0.4)',
                      },
                    }}
                    onClick={() => handleTemplate(template)}
                  >
                    <CardContent>
                      {!template.checked ? (
                        <Box
                          component="img"
                          alt="Logo"
                          src={template.templateImageNotChecked}
                        />
                      ) : (
                        <Box
                          component="img"
                          alt="Logo"
                          src={template.templateImageChecked}
                        />
                      )}
                      <Typography
                        className="templateName"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        {template.templateName}
                      </Typography>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        {template.templateDescription}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flex: '1 0 auto',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                          mt: 5,
                        }}
                      >
                        <Button
                          size="small"
                          onClick={handleClickOpen}
                          sx={{ padding: '0px' }}
                        >
                          <Typography className="textLink">
                            Learn More
                          </Typography>
                        </Button>
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
                    </CardContent>
                  </Card>
                );
              })}
              <Box
                sx={{
                  width: '10%',
                  display: 'flex',
                  flex: '1 0 auto',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  variant="contained"
                  className="nextButton"
                  onClick={() =>
                    onClickNext('templatePanel', 'pulseCheckPanel')
                  }
                >
                  Next
                </Button>
                <Button
                  variant="outlined"
                  className="backButton"
                  onClick={() => onClickBack('detailsPanel')}
                >
                  Back
                </Button>
              </Box>
            </>
          </Box>
        )}
      </Box>
      <Dialog fullScreen open={openLearnMoreDialog} onClose={handleClose}>
        <LearnMore handleClose={handleClose} />
      </Dialog>
    </>
  );
}
