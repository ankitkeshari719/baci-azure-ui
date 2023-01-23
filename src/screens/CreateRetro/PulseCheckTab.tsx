import * as React from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  CardActions,
  Grid,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import Slider from 'react-slick';

import { pulseChecksData, pulseCheckInterface } from './const';
import { ContainedButton, OutlinedButton } from '../../components';
import * as Icons from 'heroicons-react';
import { settings } from './SliderConst';

type Props = {
  activePanel: string;
  selectedPulseCheck: pulseCheckInterface | null;
  onClickBack: (previousPanel: string) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  handlePulseCheck: (selectedPulseCheck: pulseCheckInterface) => void;
};

export function PulseCheckTab({
  activePanel,
  selectedPulseCheck,
  onClickNext,
  onClickBack,
  handlePulseCheck,
}: Props) {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

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
                        maxWidth: '26rem',
                        width: '26rem',
                        height: '25rem',
                        background: '#ffffff',
                        border: '1px solid #E3E3E3',
                        boxShadow: 'none',
                        borderRadius: '2px',
                        margin: '8px',
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
                      <CardActions sx={{ padding: '16px' }}>
                        <Button size="small" sx={{ padding: '0px' }}>
                          <Typography className="templateLink">
                            Learn More
                          </Typography>
                        </Button>
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
    </>
  );
}
