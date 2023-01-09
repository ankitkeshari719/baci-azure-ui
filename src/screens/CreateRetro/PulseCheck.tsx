import * as React from 'react';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  FormHelperText,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { pulseChecksData, pulseCheckInterface } from './const';
import { ContainedButton, OutlinedButton } from '../../components';

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
  pulseCheckError: string;
  selectedPulseCheck: pulseCheckInterface | null;
  onClickBack: (previousPanel: string) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  handlePulseCheck: (selectedPulseCheck: pulseCheckInterface) => void;
};

export function PulseCheck({
  activePanel,
  pulseCheckError,
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
                  color: '#4E4E4E',
                }}
              >
                {selectedPulseCheck?.name}
              </Box>
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color:
                  activePanel === 'pulseCheckPanel' ? '#2c69a1' : '#4E4E4E',
              }}
            >
              Pulse Check Layout
            </Typography>
          )}
        </Box>
        {activePanel === 'pulseCheckPanel' && (
          <Box sx={{ mt: 4 }}>
            <>
              {pulseChecksData.map(pulseCheck => {
                return (
                  <Card
                    key={pulseCheck.id}
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
                    onClick={() => handlePulseCheck(pulseCheck)}
                  >
                    <CardContent>
                      {!pulseCheck.checked ? (
                        <Box
                          component="img"
                          alt="Logo"
                          src={pulseCheck.templateImageNotChecked}
                        />
                      ) : (
                        <Box
                          component="img"
                          alt="Logo"
                          src={pulseCheck.templateImageChecked}
                        />
                      )}
                      <Typography
                        className="templateName"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        {pulseCheck.name}
                      </Typography>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        {pulseCheck.description}
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
                        <Button size="small" sx={{ padding: '0px' }}>
                          <Typography className="textLink">
                            Learn More
                          </Typography>
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                );
              })}
              {pulseCheckError !== ' ' && (
                <FormHelperText sx={{ color: 'orange', mt: 2 }}>
                  {pulseCheckError}
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
                  }}
                />
              </Box>
            </>
          </Box>
        )}
      </Box>
    </>
  );
}
