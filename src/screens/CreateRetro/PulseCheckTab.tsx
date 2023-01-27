import * as React from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  CardActions,
  Grid,
  useMediaQuery,
  Dialog,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import Slider from 'react-slick';

import { pulseChecksData, pulseCheckInterface } from './const';
import { ContainedButton, OutlinedButton } from '../../components';
import * as Icons from 'heroicons-react';
import { createUseStyles } from 'react-jss';
import theme from '../../theme/theme';
import { LearnMorePulseCheck } from './LearnMorePulseCheck';

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
  selectedPulseCheck: pulseCheckInterface | null;
  onClickBack: (previousPanel: string) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  handlePulseCheck: (selectedPulseCheck: pulseCheckInterface) => void;
  handlePulseCheckSelectClick: (selectedTemplateId: string) => void;
};

export function PulseCheckTab({
  activePanel,
  selectedPulseCheck,
  onClickNext,
  onClickBack,
  handlePulseCheck,
  handlePulseCheckSelectClick,
}: Props) {
  const [height, setHeight] = React.useState(0);
  const classes = useStyles();
  const isMdUp: any = useMediaQuery(theme.breakpoints.only('md'));
  const isXsUp: any = useMediaQuery(theme.breakpoints.only('xs'));
  const [openLearnMoreDialog, setOpenLearnMoreDialog] = React.useState(false);

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

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

  // Learn More Dialog Open / Close
  const handleLearnMoreDialog = () => {
    setOpenLearnMoreDialog(true);
  };

  const closeLearnMoreDialog = () => {
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
          {activePanel != 'pulseCheckPanel' && selectedPulseCheck != null ? (
            <>
              <Box
                className="tabSummary"
                sx={{
                  color: '#4E4E4E !important',
                }}
              >
                {selectedPulseCheck?.name + ' Pulse Check'}
              </Box>
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color:
                  activePanel === 'pulseCheckPanel'
                    ? '#2c69a1 !important'
                    : '#4E4E4E !important',
              }}
            >
              Pulse Check Layout
            </Typography>
          )}
        </Box>
        {activePanel === 'pulseCheckPanel' && (
          <>
            <Box sx={{ mt: 4 }}>
              <Slider {...settings}>
                {pulseChecksData.map(pulseCheck => {
                  return (
                    <Card
                      key={pulseCheck.id}
                      sx={{
                        display: 'flex !important',
                        flexDirection: 'column !important',
                        justifyContent: 'space-between !important',
                        minHeight: '440px',
                        height: isMdUp
                          ? height / 2 + 20 + 'px'
                          : isXsUp
                          ? height / 2 + 60 + 'px'
                          : height / 2 - 40 + 'px',
                        width: 'calc(100% - 50px) !important',
                        background: pulseCheck.checked
                          ? 'rgba(206, 239, 255, 0.4)'
                          : '#ffffff',
                        border: pulseCheck.checked
                          ? '2px solid #2C69A1'
                          : '1px solid #E3E3E3',
                        boxShadow: 'none',
                        borderRadius: '2px',
                        '&:hover': {
                          backgroundColor: 'rgba(206, 239, 255, 0.4)',
                        },
                      }}
                      onClick={() => handlePulseCheck(pulseCheck)}
                    >
                      <CardContent>
                        {pulseCheck.checked ? (
                          <Box component="div" className="imageContainer">
                            <Box
                              component="img"
                              alt="Logo"
                              src={pulseCheck.pulseCheckImage}
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
                              src={pulseCheck.pulseCheckImage}
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
                        {/* Template Name */}
                        <Typography
                          className="templateName"
                          component="div"
                          sx={{ mt: 2 }}
                        >
                          {pulseCheck.name}
                        </Typography>
                        {/* Template Description */}
                        <Typography
                          className="templateDescription"
                          component="div"
                          sx={{ mt: 2 }}
                        >
                          {pulseCheck.description}
                        </Typography>
                      </CardContent>
                      {pulseCheck.id !== 'pulse_check_not_req' && (
                        <CardActions
                          disableSpacing
                          sx={{
                            padding: '16px',
                          }}
                        >
                          <Button
                            size="small"
                            sx={{ padding: '0px' }}
                            disabled={pulseCheck.isComingSoon}
                            onClick={handleLearnMoreDialog}
                          >
                            <Typography className="templateLink">
                              Learn More
                            </Typography>
                          </Button>
                        </CardActions>
                      )}
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
                    onClickNext('pulseCheckPanel', 'userDetailPanel')
                  }
                  style={{
                    mt: 5,
                    minWidth: '75px !important',
                    height: '36px !important',
                  }}
                />
                <OutlinedButton
                  name="Back"
                  onClick={() => onClickBack('templatePanel')}
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
        <LearnMorePulseCheck
          selectedPulseCheck={selectedPulseCheck}
          closeLearnMoreDialog={closeLearnMoreDialog}
          handlePulseCheckSelectClick={handlePulseCheckSelectClick}
        />
      </Dialog>
    </>
  );
}
