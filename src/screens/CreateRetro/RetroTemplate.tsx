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
import Slider from 'react-slick';
import { templatesData } from './const';
import { settings } from './SliderConst';
import { LearnMore } from './LearnMore';
import { ContainedButton } from '../../components/ContainedButton';
import { OutlinedButton } from '../../components/OutlinedButton';
import { CustomizeTemplate } from './CustomizeTemplate';

type Props = {
  activePanel: string;
  selectedTemplate: any;
  templateError: string;
  templates: any;
  handleCheckedTemplate: (selectedPulseCheck: any) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
};

export function RetroTemplate({
  activePanel,
  templateError,
  selectedTemplate,
  handleCheckedTemplate,
  onClickNext,
  onClickBack,
  templates,
}: Props) {
  const [openLearnMoreDialog, setOpenLearnMoreDialog] = React.useState(false);
  const [openCustomTemplateDialog, setOpenCustomTemplateDialog] =
    React.useState(false);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  // Learn More Dialog Open / Close
  const handleLearnMoreDialog = () => {
    setOpenLearnMoreDialog(true);
  };

  const closeLearnMoreDialog = () => {
    setOpenLearnMoreDialog(false);
  };

  // Custom Template Dialog Open / Close
  const handleCustomTemplateDialog = () => {
    setOpenCustomTemplateDialog(true);
  };

  const closeCustomTemplateDialog = () => {
    setOpenCustomTemplateDialog(false);
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
                color:
                  activePanel === 'templatePanel'
                    ? '#2c69a1 !important'
                    : '#4E4E4E !important',
              }}
            >
              Retro Template
            </Typography>
          )}
        </Box>
        {activePanel === 'templatePanel' && (
          <Box sx={{ mt: 4 }}>
            <>
              <Slider {...settings}>
                {templatesData.map(template => {
                  return (
                    <Card
                      key={template.templateId}
                      sx={{
                        maxWidth: '420px',
                        height: height / 2,
                        background: '#ffffff',
                        borderRadius: '2px',
                        margin: '8px',
                        '&:hover': {
                          backgroundColor: 'rgba(206, 239, 255, 0.4)',
                        },
                      }}
                      onClick={() => handleCheckedTemplate(template)}
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
                            onClick={handleLearnMoreDialog}
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
                            onClick={handleCustomTemplateDialog}
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
              </Slider>
              {templateError !== '' && (
                <FormHelperText sx={{ color: '#d32f2f', mt: 2 }}>
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
      <Dialog
        fullScreen
        open={openLearnMoreDialog}
        onClose={closeLearnMoreDialog}
      >
        <LearnMore closeLearnMoreDialog={closeLearnMoreDialog} />
      </Dialog>
      <Dialog
        fullScreen
        open={openCustomTemplateDialog}
        onClose={closeCustomTemplateDialog}
      >
        <CustomizeTemplate
          closeCustomTemplateDialog={closeCustomTemplateDialog}
          selectedTemplate={selectedTemplate}
        />
      </Dialog>
    </>
  );
}
