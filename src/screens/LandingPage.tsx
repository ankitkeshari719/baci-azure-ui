import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import ReactDOM from 'react-dom';
import LandingImage from '../assets/img/landingimage.png';
import BACILogo from '../assets/img/bacilogo.png';
import { LandingLayout } from './LandingLayout';
import commonStyles from './../style.module.scss';
import './../global.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { Retro as RetroType } from '../types';
import { useRetro } from '../helpers';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { useAzureAuth } from '../msal/azureauth';
import theme from '../theme/theme';

// import {primaryButton,primaryButtonText, secondaryButton,secondaryButtonText } from './../style.module.scss';
const styles = {
  retroJoiningText: {
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
  newUserText: {
    height: '20px',
    marginTop: '42px',
    fontFamily: "'Poppins'",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '20px',
    letterSpacing: '0.4px',
    textDecorationLine: 'underline',
  },
  signInMargin: {
    //margin: '2% 6% 1% 1%',
    marginTop: '32px',
    height: '44px',
  },
  joiningTextMargin: {
    margin: '30% 10% 40% 10%',
  },
  accessCodeTextField: {
    minWidth: '288px',
    marginTop: '86px',
    height: '48px',
    '& .MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
    },
  },
};

export function LandingPage() {
  const { id } = useParams();
  const retro = useRetro();
  const navigate = useNavigate();

  const [humanId, setHumanId] = React.useState(id || '');
  const [codeError, setCodeError] = React.useState('');
  const [global, dispatch] = React.useContext(GlobalContext);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));

  useAzureAuth();
  const joinRetro = async (): Promise<RetroType | undefined> => {
    let foundRetro = await retro.getByHumanId(humanId);
    if (humanId === '') {
      setCodeError('Please enter access code');
    } else {
      setCodeError('');
    }
    if (!foundRetro) {
      setCodeError('Sorry, wrong code. Please try again');
      //foundRetro = await retro.getById(humanId);
    }
    dispatch({
      type: ActionType.SET_CURRENT_RETRO,
      payload: { retro: foundRetro },
    });
    if (foundRetro !== undefined) {
      navigate('/join/' + humanId);
      return foundRetro;
    } else {
      setCodeError('Sorry, wrong code. Please try again');
    }
  };

  function CreateNewRetro() {
    dispatch({
      type: ActionType.SET_RETRO_CREATE,
      payload: { retroCreateState: true },
    });
    setCodeError('');
    navigate('/createretro/');
  }

  React.useEffect(() => {
    dispatch({
      type: ActionType.CLOSE_CURRENT_RETRO,
    });
  }, []);
  return (
    <>
      {isXsUp ? (
        <Box height="100vh">
          <LandingLayout></LandingLayout>
          <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh'}}>
            <Typography
              variant="h3"
              color={commonStyles.primaryDark}
              sx={{  textAlign: 'center' }}
            >
              What BACI retro are you joining today?
            </Typography>

            <TextField
              autoFocus
              variant="standard"
              label="Retro access code"
              error={!!codeError}
              sx={{...styles.accessCodeTextField, minWidth: '90%', marginTop: '48px'}}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  joinRetro();
                }
              }}
              value={humanId}
              onChange={e => {
                setHumanId(e.currentTarget.value);
                setCodeError('');
              }}
            />
            {codeError !== '' && (
              <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                {codeError}
              </FormHelperText>
            )}
            <Box style={{width: '90%'}} pt='48px'>
              <Button
                variant="outlined"
                className="secondaryButton"
                style={{width: '100%'}}
                onClick={() => joinRetro()}
                // onTouchStart={() => joinRetro()}
              >
                <span className="secondaryButtonText">Go on..</span>
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <LandingLayout></LandingLayout>
          </Grid>
          <Grid
            item
            xs={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              marginRight={commonStyles.m_80}
              marginLeft={commonStyles.m_80}
            >
              <Typography variant="h2" color={commonStyles.primaryDark}>
                What BACI retro are you joining today?
              </Typography>

              <TextField
                autoFocus
                variant="standard"
                label="Retro access code"
                error={!!codeError}
                sx={styles.accessCodeTextField}
                onKeyDown={e => {
                  if (e.keyCode === 13) {
                    joinRetro();
                  }
                }}
                value={humanId}
                onChange={e => {
                  setHumanId(e.currentTarget.value);
                  setCodeError('');
                }}
              />
              {codeError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeError}
                </FormHelperText>
              )}

              <Button
                variant="outlined"
                className="secondaryButton"
                style={styles.signInMargin}
                onClick={() => joinRetro()}
                // onTouchStart={() => joinRetro()}
              >
                <span className="secondaryButtonText">Go on..</span>
              </Button>
              <Button
                style={styles.newUserText}
                // onTouchStart={() => {
                //   CreateNewRetro();
                // }}
                onClick={() => {
                  CreateNewRetro();
                }}
              >
                Create New Retro
              </Button>
            </Grid>
          </Grid>
        </Grid>
      )}
    </>
  );
}
