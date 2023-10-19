import * as React from 'react';
import {
  Typography,
  Box,
  FormControl,
  Grid,
  TextField,
  RadioGroup,
  FormHelperText,
} from '@mui/material';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import '../../global.scss';
import './styles.scss';
import { ContainedButton, OutlinedButton } from '../../components';
import moment from 'moment';
import {
  H5SemiBoldTypography,
  H6RegularTypography,
} from '../../components/CustomizedTypography';
import { RETRO_IMMEDIATELY, RETRO_SCHEDULE } from './const';

const styles = {
  avatarfield: {
    minWidth: '300px',
    '& .MuiFormLabel-root': {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      color: 'rgba(0, 0, 0, 0.6) !important',
    },
    '& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
    '& .css-ov41s0-MuiInputBase-root-MuiInput-root': {
      borderBottom: '0px solid rgba(0, 0, 0, 0.42) !important',
    },
    textarea: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
    '& .css-1sop3d1-MuiInputBase-root-MuiInput-root': {
      borderBottom: '0px solid rgba(0, 0, 0, 0.42) !important',
    },
    '& .css-1d1r5q-MuiFormHelperText-root': {
      color: '#d32f2f',
      marginTop: '24px !important',
    },
    '& .css-j7o63n.Mui-error': {
      marginTop: '24px !important',
    },
  },
  messageTextField: {
    '& .MuiFilledInput-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
      borderRadius: '0px !important',
      height: '300px',
    },
  },
};

type Props = {
  activePanel: string;
  scheduleRetroType: string;
  scheduleDescription: string;
  scheduleDescriptionError: string;
  scheduleRetroTime: any;
  handleRetroTypeChange: (scheduleRetroType: any) => void;
  handleRetroDateChange: (scheduleRetroType: any) => void;
  handleScheduleDescriptionChange: (scheduleDescription: string) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
};

export function ScheduleRetroTab({
  activePanel,
  scheduleDescription,
  scheduleDescriptionError,
  handleRetroDateChange,
  scheduleRetroType,
  scheduleRetroTime,
  handleScheduleDescriptionChange,
  handleRetroTypeChange,
  onClickNext,
  onClickBack,
}: Props) {
  
  React.useEffect(() => {
    console.log('scheduleRetroTime', scheduleRetroTime);
  }, [scheduleRetroTime]);

  return (
    <>
      {/* Schedule Details Panel */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: '#CCCCCC',
          py:
            activePanel != 'scheduleDetailPanel' && scheduleDescription != ''
              ? 2.5
              : 3,
        }}
      >
        {/* When the tab is not open */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {activePanel != 'scheduleDetailPanel' && scheduleDescription != '' ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <H6RegularTypography
                  label="Scheduled: "
                  style={{ color: '#4E4E4E !important' }}
                />
                &nbsp;&nbsp;
                <H5SemiBoldTypography label={scheduleRetroTime} />
              </Box>
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color:
                  activePanel === 'scheduleDetailPanel'
                    ? '#2c69a1 !important'
                    : '#4E4E4E !important',
              }}
            >
              <H6RegularTypography label="Scheduled " />
            </Typography>
          )}
        </Box>
        {/* When the tab is open */}
        {activePanel === 'scheduleDetailPanel' && (
          <Box>
            <FormControl fullWidth>
              <Grid container spacing={2}>
                {/* Select Retro Type */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={scheduleRetroType}
                      onChange={handleRetroTypeChange}
                    >
                      <FormControlLabel
                        value={RETRO_IMMEDIATELY}
                        control={<Radio />}
                        label="Start Immediately"
                      />
                      <FormControlLabel
                        value={RETRO_SCHEDULE}
                        control={<Radio />}
                        label="Schedule"
                      />
                    </RadioGroup>
                  </Box>
                </Grid>
                {/* Select Date and Time */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography className="chooseAvatarText">
                      Select Date and Time:
                    </Typography>
                    &nbsp;&nbsp;
                    {scheduleRetroType === RETRO_IMMEDIATELY ? (
                      <H5SemiBoldTypography label={scheduleRetroTime} />
                    ) : (
                      <input
                        type="datetime-local"
                        id="scheduleRetroTime"
                        name="scheduleRetroTime"
                        style={{
                          fontSize: '16px',
                          height: '48px',
                          borderRadius: '4px',
                          padding: '16px',
                          border: '1px solid #343434',
                        }}
                        onChange={handleRetroDateChange}
                      />
                    )}
                  </Box>
                </Grid>
                {/* Add Description*/}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography className="chooseAvatarText">
                      Add Description:
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <TextField
                        multiline
                        rows={2}
                        maxRows={8}
                        variant="outlined"
                        error={!!scheduleDescriptionError}
                        sx={{
                          width: '400px',
                          ...styles.messageTextField,
                          background: '#ffffff',
                          marginLeft: '24px',
                          border: '1px  solid #F0F0F0',
                        }}
                        value={scheduleDescription}
                        onChange={(e: any) => {
                          handleScheduleDescriptionChange(
                            e.currentTarget.value
                          );
                        }}
                      />
                      <Box ml={2}>
                        {scheduleDescriptionError !== '' && (
                          <FormHelperText
                            sx={{ color: '#d32f2f', marginLeft: '10px' }}
                          >
                            {scheduleDescriptionError}
                          </FormHelperText>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </FormControl>
            {/* Button Next and Back */}
            <Grid item xs={2}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                }}
              >
                <ContainedButton
                  name="Finish"
                  onClick={() => onClickNext('scheduleDetailPanel', 'finalTab')}
                  style={{
                    mt: 5,
                    minWidth: '75px !important',
                    height: '36px !important',
                  }}
                  size={'medium'}
                />
                <OutlinedButton
                  label="Back"
                  size={'medium'}
                  onClick={() => onClickBack('teamDetailPanel')}
                  style={{
                    minWidth: '75px !important',
                    height: '36px !important',
                    mt: 5,
                    ml: 6,
                  }}
                />
              </Box>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
}
