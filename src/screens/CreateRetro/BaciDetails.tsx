import * as React from 'react';
import {
  FormControl,
  TextField,
  FormHelperText,
  MenuItem,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { RETRONAME_CHARACTER_LIMIT } from './const';
import { ContainedButton } from '../../components/ContainedButton';

const styles = {
  retroNameTextField: {
    minWidth: '300px',
    '& .MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontSize: '16px',
    },
    '& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontSize: '16px',
    },
  },
  timeFramefield: {
    minWidth: '300px',
    '& label': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontSize: '16px',
      '&.Mui-focused': {
        color: 'rgba(0, 0, 0, 0.6) !important',
        fontSize: '16px',
      },
    },
  },
};

type Props = {
  activePanel: string;
  retroName: string;
  retroTimeFrame: string;
  retroNameError: string;
  retroNameWarning: string;
  timeFrameRef: any;
  isTimeFrameSet: boolean;
  handleRetroNameChange: (e: React.SetStateAction<string>) => void;
  handleTimeFrame: (e: React.SetStateAction<string>) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
};

export function BaciDetails({
  activePanel,
  retroName,
  retroTimeFrame,
  retroNameError,
  retroNameWarning,
  timeFrameRef,
  isTimeFrameSet,
  handleRetroNameChange,
  handleTimeFrame,
  onClickNext,
}: Props) {
  return (
    <>
      {/* BACI Details Panel */}
      <Box sx={{ borderBottom: 1, borderColor: '#CCCCCC' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            py: activePanel === 'detailsPanel' ? 0 : 4,
          }}
        >
          {activePanel != 'detailsPanel' &&
          retroName != '' &&
          retroTimeFrame != '' ? (
            <>
              <Box
                className="tabSummary"
                sx={{
                  color: '#4E4E4E !important',
                }}
              >
                {retroName}
              </Box>
              <Box
                className="timeFrameSummary"
                sx={{
                  ml: 5,
                }}
              >
                {retroTimeFrame}
              </Box>
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color: '#2c69a1 !important',
              }}
            >
              BACI Details
            </Typography>
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
                            timeFrameRef.current?.focus();
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
                        inputRef={timeFrameRef}
                        variant="standard"
                        label="Period to retrospect on"
                        sx={styles.timeFramefield}
                        value={retroTimeFrame}
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
            <Box sx={{ mt: 4, mb: 4 }}>
              <ContainedButton
                name="Next"
                onClick={() => onClickNext('detailsPanel', 'templatePanel')}
                style={{
                  mt: 5,
                  minWidth: '75px !important',
                  height: '36px !important',
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
