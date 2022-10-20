import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import * as React from 'react';
import { LandingLayout } from './LandingLayout';
import commonStyles from './../style.module.scss';
import './../global.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useRetro } from '../helpers';

const styles = {
  createRetroText: {
    height: '38px',
    left: '1040px',
    marginTop: '300px',
    fontFamily: "'Poppins'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '28px',
    lineHeight: '38px',
    letterSpacing: '0.5px',
    color: commonStyles.primaryDark,
  },
  retroNameTextField: {
    minWidth: '322px',
    marginTop: '86px',
    "& .MuiFormLabel-root": {
      color: "rgba(0, 0, 0, 0.6) !important" ,
      fontSize: '14px'
    }
  },
  timeFramefield: {
    marginTop: '32px',
    "&:MuiSelect-select-MuiInputBase-input-MuiInput-input:focus":{
        backgroundColor:'white'
    }
  },
  proceedButton: {
    marginTop: '53px',
  },
  existingRetroText: {
    height: '20px',
    marginTop: '32px',
    fontFamily: "'Poppins'",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '20px',
    letterSpacing: '0.4px',
    textDecorationLine: 'underline',
  },
};

export function CreateNewRetro() {
  const { id } = useParams();
  const retro = useRetro();
  const navigate = useNavigate();
  
  const [codeError, setCodeError] = React.useState('');
  const [retroName, setRetroName] = React.useState('');
  const [codeWarning, setCodeWarning] = React.useState('');
  const [retroTimeframe, setRetroTimeframe] = React.useState('');
  const [isTimeFrameSet, setisTimeFrameSet] = React.useState(id ? true : false);
  const [localRetroName, setlocalRetroName] = React.useState(
    localStorage.getItem('retroname') || ''
  );
  const RETRONAME_CHARACTER_LIMIT = 80;
  const timeframeRef = React.useRef<HTMLSelectElement | null>(null);

  function handleRetronameChange(e: React.SetStateAction<string>) {
    if (e == '') {
      setCodeWarning('');
    } else {
      setCodeError('');
    }
    if (e.length >= 60) {
      let count = 80 - e.length;

      if (count === 0) {
        setCodeWarning('No more charachter remaining');
      } else {
        setCodeWarning('Character remaining -' + `${count}`);
      }
    } else {
      setCodeWarning('');
    }
    setRetroName(e);
  }
  function handleTimeFrame(e: React.SetStateAction<string>) {
    setRetroTimeframe(e);
    setisTimeFrameSet(false);
  }
  const create = async () => {
    localStorage.setItem('retroname', retroName);
    setlocalRetroName('"' + retroName + '"');
    if (retroName !== '' && retroTimeframe !== '') {
      setCodeError('');
      setisTimeFrameSet(false);
      await retro.create({ name: retroName }, retroTimeframe, '');
      navigate('/retrodetails/');
    } else if (retroTimeframe === '' && retroName === '') {
      setisTimeFrameSet(true);
      setCodeError('Please enter retro name');
    } else if (retroName === '') {
      setCodeError('Please enter retro name');
    } else if (retroTimeframe === '') {
      setisTimeFrameSet(true);
    }
    sessionStorage.setItem('retroname', '"' + retroName + '"');
  };
const joinExistingRetro= () => {
    navigate('/');
};
  return (
    <Grid container spacing={0} xs={12}>
      <Grid item xs={6}>
        <LandingLayout></LandingLayout>
      </Grid>
      <Grid xs={6}>
        <Grid
          xs={12}
          marginRight={commonStyles.m_80}
          marginLeft={commonStyles.m_80}
        >
          <Box component="div" whiteSpace="normal" sx={styles.createRetroText}>
            Create new BACI retro
          </Box>
          <FormControl>
            <TextField
              autoFocus
              variant="standard"
              label="Retro access code"
              inputProps={{
                maxLength: RETRONAME_CHARACTER_LIMIT,
              }}
              value={retroName}
              error={!!codeError}
              helperText={codeError}
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
            {codeWarning !== ' ' && (
              <FormHelperText sx={{ color: 'orange' }}>
                {codeWarning}
              </FormHelperText>
            )}
            <Select
              inputRef={timeframeRef}
              variant="standard"
              label="Time Frame"
              sx={styles.timeFramefield}
              value={retroTimeframe}
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
            </Select>
            {isTimeFrameSet && (
              <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                Please enter time frame
              </FormHelperText>
            )}
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'start' }}>
            <Button
              variant="outlined"
              className="secondaryButton"
              onClick={create}
              sx={styles.proceedButton}
            >
              <span className="secondaryButtonText">
                Proceed creating retro
              </span>
            </Button>
          </Box>
          <Box>
            <Button style={styles.existingRetroText}  onClick={joinExistingRetro}>
              Join existing BACI retro
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
