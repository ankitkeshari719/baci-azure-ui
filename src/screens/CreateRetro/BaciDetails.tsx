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
  expandedPanel: string;
  allPanels: string[];
  retroName: string;
  retroTimeframe: string;
  retroNameError: string;
  retroNameWarning: string;
  timeframeRef: any;
  isTimeFrameSet: boolean;
  handleRetronameChange: (e: React.SetStateAction<string>) => void;
  handleTimeFrame: (e: React.SetStateAction<string>) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
};

export function BaciDetails({
  expandedPanel,
  allPanels,
  retroName,
  retroTimeframe,
  retroNameError,
  retroNameWarning,
  timeframeRef,
  isTimeFrameSet,
  handleRetronameChange,
  handleTimeFrame,
  onClickNext,
}: Props) {
  return (
    <>
      {/* BACI Details Panel */}
      <Accordion
        expanded={expandedPanel === 'detailsPanel'}
        sx={{
          borderRadius: '0px',
        }}
      >
        <AccordionSummary>
          {allPanels.includes('detailsPanel') &&
          retroName != '' &&
          retroTimeframe != '' ? (
            <>
              <Typography className="accordionSummary">{retroName}</Typography>
              <Typography className="timeframeSummary">
                {retroTimeframe}
              </Typography>
            </>
          ) : (
            <Typography className="accordionSummary">BACI Details</Typography>
          )}
        </AccordionSummary>
        <AccordionDetails>
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
                    onChange={e => handleRetronameChange(e.currentTarget.value)}
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
          <Grid container spacing={0}>
            <Grid item sm={1}>
              <Button
                variant="contained"
                className="nextButton"
                onClick={() => onClickNext('detailsPanel', 'templatePanel')}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
