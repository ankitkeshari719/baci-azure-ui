import * as React from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Dialog,
  CardActions,
  Grid,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import Slider from 'react-slick';
import { templatesData } from './const';
import { LearnMore } from './LearnMore';
import { ContainedButton } from '../../components/ContainedButton';
import { OutlinedButton } from '../../components/OutlinedButton';
import { CustomizeTemplate } from './CustomizeTemplate';
import * as Icons from 'heroicons-react';
import { createUseStyles } from 'react-jss';

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <Icons.ChevronRight
      size={32}
      className={className}
      style={{
        ...style,
        width: '42px',
        height: '42px',
        display: 'block',
        right: '0px',
        color: '#0F172A',
        fontSize: '14px',
        cursor: 'pointer',
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
        width: '42px',
        height: '42px',
        display: 'block',
        left: '0px',
        color: '#0F172A',
        fontSize: '14px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    />
  );
}

const useStyles = createUseStyles({
  sliderContainer: {
    '& .slick-list': {
      marginLeft: '60px !important',
      marginRight: '60px  !important',
      padding: '0px  !important',
    },
  },
});

type Props = {
  activePanel: string;
  selectedTemplate: any;
  templates: any;
  handleCheckedTemplate: (selectedPulseCheck: any) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
  handleTemplateSelectClick: (selectedTemplateId: string) => void;
  setSelectedTemplate: (selectedTemplate: any) => void;
};

export function RetroTemplateTab({
  activePanel,
  selectedTemplate,
  handleCheckedTemplate,
  onClickNext,
  onClickBack,
  handleTemplateSelectClick,
  templates,
  setSelectedTemplate,
}: Props) {
  const [openLearnMoreDialog, setOpenLearnMoreDialog] = React.useState(false);
  const [openCustomTemplateDialog, setOpenCustomTemplateDialog] =
    React.useState(false);
  const [isTemplateCustomized, setIsTemplateCustomized] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const classes = useStyles();

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    className: classes.sliderContainer,
    centerMode: true,
    responsive: [
      {
        breakpoint: 1700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          speed: 500,
        },
      },
      {
        breakpoint: 1260,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 500,
        },
      },
    ],
  };

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
                {selectedTemplate?.templateName + ' Retro Template'}
              </Box>
              {isTemplateCustomized && (
                <Box
                  className="timeFrameSummary"
                  sx={{
                    color: '#4E4E4E !important',
                    ml: 5,
                  }}
                >
                  Customized
                </Box>
              )}
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
          <>
            <Box sx={{ mt: 4 }}>
              <Slider {...settings}>
                {templatesData.map(template => {
                  return (
                    <Card
                      key={template.templateId}
                      sx={{
                        display: 'flex !important',
                        flexDirection: 'column !important',
                        justifyContent: 'space-between !important',
                        minHeight: '440px',
                        height: height / 2 + 20 + 'px',
                        width: 'calc(100% - 50px) !important',
                        background: template.checked
                          ? 'rgba(206, 239, 255, 0.4)'
                          : '#ffffff',
                        border: template.checked
                          ? '2px solid #2C69A1'
                          : '1px solid #E3E3E3',
                        boxShadow: 'none',
                        borderRadius: '2px',
                        '&:hover': {
                          backgroundColor: 'rgba(206, 239, 255, 0.4)',
                        },
                      }}
                      onClick={() => handleCheckedTemplate(template)}
                    >
                      <CardContent>
                        {template.checked ? (
                          <Box component="div" className="imageContainer">
                            <Box
                              component="img"
                              alt="Logo"
                              src={template.templateImage}
                              className="imageMain"
                            />
                            <Icons.CheckCircle
                              size={20}
                              color="#159ADD"
                              style={{
                                width: '24px',
                                height: '24px',
                              }}
                              className="imageChild_1"
                            />
                          </Box>
                        ) : (
                          <Box component="div" className="imageContainer">
                            <Box
                              component="img"
                              alt="Logo"
                              src={template.templateImage}
                              className="imageMain"
                            />
                            <Box
                              component="img"
                              width="18px"
                              height="18px"
                              alt="Logo"
                              src="/images/empty_circle.png"
                              className="imageChild_2"
                            />
                          </Box>
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
                      </CardContent>
                      <CardActions
                        disableSpacing
                        sx={{
                          padding: '16px',
                        }}
                      >
                        <Grid item xs={12}>
                          <Box sx={{ float: 'left' }}>
                            <Button
                              size="small"
                              onClick={handleLearnMoreDialog}
                              sx={{ padding: '0px' }}
                            >
                              <Typography className="templateLink">
                                Learn More
                              </Typography>
                            </Button>
                          </Box>
                          <Box sx={{ float: 'right' }}>
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
                        </Grid>
                      </CardActions>
                    </Card>
                  );
                })}
              </Slider>
            </Box>
            <Grid item xs={2}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
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
                    ml: 6,
                  }}
                />
              </Box>
            </Grid>
          </>
        )}
      </Box>
      <Dialog
        fullScreen
        open={openLearnMoreDialog}
        onClose={closeLearnMoreDialog}
      >
        <LearnMore
          selectedTemplate={selectedTemplate}
          closeLearnMoreDialog={closeLearnMoreDialog}
          handleCustomTemplateDialog={handleCustomTemplateDialog}
          handleTemplateSelectClick={handleTemplateSelectClick}
        />
      </Dialog>
      <Dialog
        fullScreen
        open={openCustomTemplateDialog}
        onClose={closeCustomTemplateDialog}
      >
        <CustomizeTemplate
          closeCustomTemplateDialog={closeCustomTemplateDialog}
          selectedTemplate={selectedTemplate}
          handleTemplateSelectClick={handleTemplateSelectClick}
          setSelectedTemplate={setSelectedTemplate}
          setIsTemplateCustomized={setIsTemplateCustomized}
        />
      </Dialog>
    </>
  );
}
