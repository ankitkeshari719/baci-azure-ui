import * as React from 'react';
import { Box, FormHelperText, Grid, TextField } from '@mui/material';
import './../../../global.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { TextButton } from '../../CustomizedButton/TextButton';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import { useRetro } from '../../../helpers';
import { LandingLayout } from '../../../screens/Home/LandingLayout';
import { ContainedButton } from '../../CustomizedButton/ContainedButton';
import {
  H2RegularTypography,
  TinyTextTypography,
} from '../../CustomizedTypography';
import { Retro as RetroType } from '../../../helpers/types';
import { OutlinedButton } from '../../CustomizedButton/OutlinedButton';
import { BASIC, ENTERPRISE } from '../../../constants/applicationConst';
import { UserContext } from '../../../contexts/UserContext';

const styles = {
  accessCodeTextField: {
    '& .MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
    },
  },
  logoImage: {
    height: '49.5px',
    marginTop: '25px',
  },
};

export function JoinRetroEnterprise() {
  const { id } = useParams();
  const retro = useRetro();
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const [gUser,userDispatch]= React.useContext(UserContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  const [humanId, setHumanId] = React.useState(id || '');
  const [codeError, setCodeError] = React.useState('');

  // Function to join existing retro
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
      if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
        navigate('/basic/sessions/join/' + humanId);
      } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
        navigate('/enterprise/sessions/join/' + humanId);
      }
      else
      navigate('/join/' + humanId);
      return foundRetro;
    } else {
      setCodeError('Sorry, wrong code. Please try again');
    }
  };

  // Function to navigate on create new retro page
  function CreateNewRetro() {
    dispatch({
      type: ActionType.SET_RETRO_CREATE,
      payload: { retroCreateState: true },
    });
    setCodeError('');
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/createRetro/');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      navigate('/enterprise/sessions/createRetro/');
    }
  }

  const navigateToPrivatePolicy = () => {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/privatePolicy/');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      navigate('/enterprise/privatePolicy/');
    }
  
  };

  const navigateToTermAndCondition = () => {

    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/termAndCondition/');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      navigate('/enterprise/termAndCondition/');
    }

  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: 'calc(var(--app-height))',
          width: '100%',
        }}
      >
        <Grid
          container
          spacing={0}
          height="calc(var(--app-height))"
          sx={{ overflowY: 'auto' }}
        >
          <Grid item xs={6} height="calc(var(--app-height))">
            <LandingLayout></LandingLayout>
          </Grid>
          <Grid
            item
            xs={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px !important"
            flexDirection="column"
            height="100%"
          >
            <Grid
              item
              xs={12}
              marginRight="50px"
              marginLeft="50px"
              display="flex"
              flexDirection="column"
              height="100%"
              justifyContent="center"
            >
              <H2RegularTypography
                label={'What BACI retro are you joining today?'}
                style={{
                  color: '#2C69A1',
                }}
              />
              <Box component="span" mt="50px" />
              <TextField
                autoFocus
                variant="standard"
                label="Retro access code"
                error={!!codeError}
                sx={styles.accessCodeTextField}
                onKeyDown={(e: any) => {
                  if (e.keyCode === 13) {
                    joinRetro();
                  }
                }}
                value={humanId}
                onChange={(e: any) => {
                  setHumanId(e.currentTarget.value);
                  setCodeError('');
                }}
              />
              {codeError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeError}
                </FormHelperText>
              )}
              <Box>
                <ContainedButton
                  id={'join_retro_button_desktop'}
                  name={'Join Retro'}
                  onClick={() => joinRetro()}
                  style={{
                    width: '350px',
                    marginTop: '80px',
                    padding: '10px 20px',
                    gap: '8px',
                  }}
                  size={'medium'}
                />
                <OutlinedButton
                  id={'create_new__retro_button_desktop'}
                  label={'Create New Retro'}
                  onClick={() => CreateNewRetro()}
                  size={'medium'}
                  style={{
                    width: '350px',
                    marginTop: '8px',
                    padding: '10px 18px',
                    gap: '8px',
                  }}
                />
              </Box>
              <Box sx={{ marginTop: '60px' }}>
                <TinyTextTypography label="By proceeding, I accept BACI’s " />
                <TinyTextTypography
                  label="T&C "
                  style={{
                    textDecorationLine: 'underline',
                    color: '#159ADD',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigateToTermAndCondition()}
                />
                <TinyTextTypography label="& " />
                <TinyTextTypography
                  label="Privacy Policy "
                  style={{
                    textDecorationLine: 'underline',
                    color: '#159ADD',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigateToPrivatePolicy()}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
