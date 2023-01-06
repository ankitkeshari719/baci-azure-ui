import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  FormControl,
  Grid,
  TextField,
  FormHelperText,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { RETRONAME_CHARACTER_LIMIT } from './const';

const styles = {
  retroNameTextField: {
    minWidth: '300px',
    '& .MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontSize: '14px',
    },
    '& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
      color: 'rgba(0, 0, 0, 0.6) !important',
    },
  },
  timeFramefield: {
    minWidth: '300px',
    '& label': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontSize: '14px',
      '&.Mui-focused': {
        color: 'rgba(0, 0, 0, 0.6) !important',
      },
    },
  },
};

type Props = {
  activePanel: string;
  expandedPanel: string;
  allPanels: string[];
  retroName: string;
  retroTimeframe: string;
  retroNameError: string;
  retroNameWarning: string;
  timeframeRef: any;
  isTimeFrameSet: boolean;
  handleRetroNameChange: (e: React.SetStateAction<string>) => void;
  handleTimeFrame: (e: React.SetStateAction<string>) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
};

export function BaciDetails({
  activePanel,
  expandedPanel,
  allPanels,
  retroName,
  retroTimeframe,
  retroNameError,
  retroNameWarning,
  timeframeRef,
  isTimeFrameSet,
  handleRetroNameChange,
  handleTimeFrame,
  onClickNext,
}: Props) {
  return (
    <>
      {/* Template Panel */}
      <Box sx={{ borderBottom: 1, borderColor: '#CCCCCC' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            cursor: 'pointer',
            py: activePanel != 'detailsPanel' ? 4 : 0,
          }}
        >
          {activePanel != 'detailsPanel' &&
          retroName != '' &&
          retroTimeframe != '' ? (
            <>
              <Box
                className="accordionSummary"
                sx={{
                  color:
                    activePanel != 'detailsPanel' && retroName != ''
                      ? '#4E4E4E'
                      : '#2c69a1',
                }}
              >
                {retroName}
              </Box>
              <Box
                className="timeframeSummary"
                sx={{
                  color:
                    activePanel != 'detailsPanel' && retroTimeframe != ''
                      ? '#4E4E4E'
                      : '#2c69a1',
                }}
              >
                {retroTimeframe}
              </Box>
            </>
          ) : (
            <Typography className="accordionSummary">BACI Details</Typography>
          )}
        </Box>
        {activePanel === 'detailsPanel' && (
          <Box>
            <Box sx={{ mt: 4 }}>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <TextField
                        autoFocus
                        variant="standard"
                        label="Retro Name"
                        inputProps={{
                          maxLength: RETRONAME_CHARACTER_LIMIT,
                        }}
                        value={retroName}
                        error={!!retroNameError}
                        helperText={retroNameError}
                        sx={styles.retroNameTextField}
                        onChange={e =>
                          handleRetroNameChange(e.currentTarget.value)
                        }
                        multiline
                        onKeyDown={e => {
                          if (e.keyCode === 13) {
                            e.preventDefault();
                            timeframeRef.current?.focus();
                          }
                        }}
                      />
                      {retroNameWarning !== ' ' && (
                        <FormHelperText sx={{ color: 'orange' }}>
                          {retroNameWarning}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
                      <TextField
                        inputRef={timeframeRef}
                        variant="standard"
                        label="Period to retrospect on"
                        sx={styles.timeFramefield}
                        value={retroTimeframe}
                        select
                        onChange={e => handleTimeFrame(e?.target?.value)}
                      >
                        <MenuItem disableRipple value={'1 day'}>
                          1 day
                        </MenuItem>
                        <MenuItem value={'1 week'}>1 week</MenuItem>
                        <MenuItem value={'2 weeks'}>2 weeks</MenuItem>
                        <MenuItem value={'3 weeks'}>3 weeks</MenuItem>
                        <MenuItem value={'4 weeks'}>4 weeks</MenuItem>
                        <MenuItem value={'N/A'}>N/A</MenuItem>
                      </TextField>
                      {isTimeFrameSet && (
                        <FormHelperText
                          style={{ color: '#d32f2f', marginLeft: '5px' }}
                        >
                          Please enter time frame
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </FormControl>
            </Box>
            <Box sx={{ my: 4 }}>
              <Button
                variant="contained"
                className="nextButton"
                onClick={() => onClickNext('detailsPanel', 'templatePanel')}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
