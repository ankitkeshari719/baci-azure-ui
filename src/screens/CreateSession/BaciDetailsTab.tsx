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
import '../CreateSession/styles.scss';
import { RETRONAME_CHARACTER_LIMIT } from '../../screens/CreateRetro/const';
import { ContainedButton } from '../../components/CustomizedButton/ContainedButton';
import {
  H5SemiBoldTypography,
  H6RegularTypography,
} from '../../components/CustomizedTypography';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
const styles = {
  retroNameTextField: {
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
      fontFamily: 'Poppins !important',
      fontStyle: 'normal !important',
      fontWeight: 400,
      fontSize: '16px !important',
      lineHeight: '20px !important',
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
  },
  timeFramefield: {
    minWidth: '300px',
    '& label': {
      color: 'rgba(0, 0, 0, 0.87) !important',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      '&.Mui-focused': {
        color: 'rgba(0, 0, 0, 0.6) !important',
        fontFamily: 'Poppins',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '16px',
        lineHeight: '20px',
        letterSpacing: '0.6px',
      },
    },
    '& .css-148deet-MuiFormControl-root-MuiTextField-root label': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
    },
    '& .css-1952jpe-MuiFormControl-root-MuiTextField-root label': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
    },
    '& .css-1sop3d1-MuiInputBase-root-MuiInput-root': {
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
  },
};

type Props = {
  activePanel: string;
  retroName: string;
  retroTimeFrame: Date | null;
  retroNameError: string;
  retroNameWarning: string;
  timeFrameRef: any;
  isTimeFrameSet: boolean;
  handleRetroNameChange: (e: React.SetStateAction<string>) => void;
  handleTimeFrame: (e: React.SetStateAction<Date | null>) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  isLoginUser: boolean;
};

export function BaciDetailsTab({
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
  isLoginUser,
}: Props) {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);


  const formattedDate = retroTimeFrame
    ? moment(retroTimeFrame).format('D MMMM YYYY')
    : '';

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  // Function to format the date as "12 July 2013"
  const formatDate = (date: Date | null): string => {
    if (date) {
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    }
    return '';
  };

  //on click next
  const onClickNextButton = () => {
    if (isLoginUser) {
      onClickNext('baciDetailPanel', 'teamDetailPanel');
    } else {
      onClickNext('baciDetailPanel', 'teamDetailPanel');
    }
  };

  return (
    <>
      {/* Session Details Panel */}
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
          retroTimeFrame != null ? (
            <>
              <Box display="flex" alignItems="center" flexDirection="row">
                <Box
                  className="tabSummary"
                  sx={{
                    color: '#4E4E4E !important',
                  }}
                >
                  <H6RegularTypography label="Session Name" />
                </Box>
                <Box
                  sx={{
                    ml: 2,
                  }}
                >
                  <H5SemiBoldTypography label={retroName} />
                </Box>
                <Box
                  className="timeFrameSummary"
                  sx={{
                    ml: 5,
                  }}
                >
                 {formattedDate}
                </Box>
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
                        label="Session Name"
                        inputProps={{
                          maxLength: RETRONAME_CHARACTER_LIMIT,
                        }}
                        value={retroName}
                        error={!!retroNameError}
                        helperText={retroNameError}
                        sx={styles.retroNameTextField}
                        onChange={(e: any) =>
                          handleRetroNameChange(e.currentTarget.value)
                        }
                        multiline
                        onKeyDown={(e: any) => {
                          if (e.keyCode === 13) {
                            e.preventDefault();
                            timeFrameRef.current?.focus();
                          }
                        }}
                      />
                      {retroNameWarning !== ' ' && (
                        <FormHelperText sx={{ color: '#d32f2f' }}>
                          {retroNameWarning}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
                    <div
  style={{
    display: 'flex',
    borderBottom: '2px solid black',
    width: "300px"
  }}
>
  <DatePicker
    selected={selectedDate}
    onChange={(date) => {
      handleTimeFrame(date);
      handleDateChange(date);
    }}
    dateFormat="dd MMMM yyyy"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    popperPlacement="bottom-start"
    customInput={
      <TextField
      autoFocus
      variant="standard"
      label="Date"
        value={selectedDate ? selectedDate.toLocaleDateString() : ''}
       
        InputProps={{
          disableUnderline: true,
          style: {
            width: '100%',
            color: 'black',
          }
        }}
      />
    }
    wrapperClassName="date-picker-wrapper"
  />
</div>
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
                onClick={onClickNextButton}
                style={{
                  mt: 5,
                  minWidth: '75px !important',
                  height: '36px !important',
                }}
                size={'medium'}
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
function setSelectedDate(inputValue: string) {
  throw new Error('Function not implemented.');
}
