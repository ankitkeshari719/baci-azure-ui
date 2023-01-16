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
import Slider from 'react-slick';
import * as Icons from 'heroicons-react';
import { CustomizeTemplate } from './CustomizeTemplate';

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Icons.ChevronRight
      size={32}
      className={className}
      style={{
        ...style,
        display: 'block',
        right: '0px',
        color: '#0F172A',
        fontSize: '14px',
        cursor: 'pointer'
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Icons.ChevronLeft
      size={32}
      className={className}
      style={{
        ...style,
        display: 'block',
        left: '0px',
        color: '#0F172A',
        fontSize: '14px',
        cursor: 'pointer'
      }}
      onClick={onClick}
    />
  );
}

const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  className: 'center',
  centerMode: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

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
}: Props) {
  const [openLearnMoreDialog, setOpenLearnMoreDialog] = React.useState(false);
  const [openCustomTemplateDialog, setOpenCustomTemplateDialog] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

  const handleLearnMoreDialog = () => {
    setOpenLearnMoreDialog(true);
  };

  const closeLearnMoreDialog = () => {
    setOpenLearnMoreDialog(false);
  };

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
      <Dialog fullScreen open={openLearnMoreDialog} onClose={closeLearnMoreDialog}>
        <LearnMore closeLearnMoreDialog={closeLearnMoreDialog} />
      </Dialog>
      <Dialog fullScreen open={openCustomTemplateDialog} onClose={closeCustomTemplateDialog}>
        <CustomizeTemplate closeCustomTemplateDialog={closeCustomTemplateDialog} />
      </Dialog>
    </>
  );
}
