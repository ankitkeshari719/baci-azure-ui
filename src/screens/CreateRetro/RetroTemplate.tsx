import * as React from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Dialog,
  FormHelperText,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { templatesData } from './const';
import { LearnMore } from './LearnMore';
import { ContainedButton } from '../../components/ContainedButton';
import { OutlinedButton } from '../../components/OutlinedButton';

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

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

type Props = {
  activePanel: string;
  selectedTemplate: any;
  templateError: string;
  handleTemplate: (selectedPulseCheck: any) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
};

export function RetroTemplate({
  activePanel,
  templateError,
  selectedTemplate,
  handleTemplate,
  onClickNext,
  onClickBack,
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
          }}
        >
          {activePanel != 'templatePanel' && selectedTemplate != null ? (
            <>
              <Box
                className="tabSummary"
                sx={{
                  color: '#4E4E4E !important',
                }}
              >
                {selectedTemplate?.templateName}
              </Box>
              <Box
                className="timeFrameSummary"
                sx={{
                  color: '#4E4E4E !important',
                  ml: 5,
                }}
              >
                Customized
              </Box>
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color: activePanel === 'templatePanel' ? '#2c69a1 !important' : '#4E4E4E !important',
              }}
            >
              Retro Template
            </Typography>
          )}
        </Box>
        {activePanel === 'templatePanel' && (
          <Box sx={{ mt: 4 }}>
            <>
              {templatesData.map(template => {
                return (
                  <Card
                    key={template.templateId}
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
                          // onClick={handleClickOpen}
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
              {templateError !== '' && (
                <FormHelperText sx={{ color: 'orange', mt: 2 }}>
                  {templateError}
                </FormHelperText>
              )}
              <Box
                sx={{
                  width: '10%',
                  display: 'flex',
                  flex: '1 0 auto',
                  alignItems: 'flex-end',
                  justifyContent: 'space-between',
                }}
              >
                <ContainedButton
                  name="Next"
                  onClick={() =>
                    onClickNext('templatePanel', 'pulseCheckPanel')
                  }
                  style={{
                    mt: 5,
                    minWidth: '75px !important',
                    height: '36px !important',
                  }}
                />
                <OutlinedButton
                  name="Back"
                  onClick={() => onClickBack('detailsPanel')}
                  style={{
                    minWidth: '75px !important',
                    height: '36px !important',
                    mt: 5,
                  }}
                />
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
