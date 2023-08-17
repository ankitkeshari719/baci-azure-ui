import * as React from 'react';
import {
  Box,
  Dialog,
  FormControl,
  FormHelperText,
  Grid,
  styled,
  TextField,
  useMediaQuery,
} from '@mui/material';
import theme from '../../helpers/theme/theme';
import './../../global.scss';
import commonStyles from './../../style.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { azureToUser, useAzureAuth } from '../../helpers/msal/azureauth';
import { Dayjs } from 'dayjs';
import { LandingLayout } from './LandingLayout';
import { Retro as RetroType } from '../../helpers/types';
import { useRetro } from '../../helpers';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { addDeploymentData } from '../../helpers/msal/services';
import { AddDeploymentDataDialog } from '../Utils/Dialogs/AddDeploymentDataDialog';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import { PrivacyAndRetentionDialog } from '../Utils/Dialogs/PrivacyAndRetentionDialog';
import {
  H2RegularTypography,
  H4RegularTypography,
} from '../../components/CustomizedTypography';
import { ContainedButton, TextButton } from '../../components';
import LeftBar from '../../components/Elements/leftBar/LeftBar';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const styles = {
  accessCodeTextField: {
    '& .MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
    },
  },
};

export function LandingPage({ isDemo }: { isDemo?: boolean }) {
  const { id } = useParams();
  const retro = useRetro();
  const navigate = useNavigate();

  const [humanId, setHumanId] = React.useState(id || '');
  const [codeError, setCodeError] = React.useState('');
  const [height, setHeight] = React.useState(0);
  const [global, dispatch] = React.useContext(GlobalContext);
  // const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const isXsUp = useMediaQuery('(max-width:768px)');
  const isSmUp = useMediaQuery('(min-width:1024px)');
  // const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));
  const [isAddDeploymentDataDialogOpen, setIsAddDeploymentDataDialogOpen] =
    React.useState(false);
  // const [isDemo,setIsDemo]=React.useState<boolean>(false);

  useAzureAuth();

  React.useEffect(() => {
    sessionStorage.removeItem('BoardContext');
    sessionStorage.removeItem('GlobalContext');
    sessionStorage.removeItem('retroname');
    sessionStorage.removeItem('showManual');
    localStorage.removeItem('selectedTemplate');
    localStorage.removeItem('tempSelectedTemplateData');
  }, []);

  React.useEffect(() => {
    setHeight(window.innerHeight);
    dispatch({
      type: ActionType.CLOSE_CURRENT_RETRO,
    });
  }, []);

  // Function to add deployment data
  const handleAddDeploymentData = async (
    deploymentDate: Dayjs | null,
    notificationDate: Dayjs | null
  ) => {
    if (deploymentDate && notificationDate) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      await addDeploymentData(deploymentDate, notificationDate).then(
        res => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
          dispatch({
            type: ActionType.SET_SNACK_MESSAGE,
            payload: {
              snackMessage: {
                snackMessageType: 'success',
                message: res.message,
              },
            },
          });
        },
        err => {
          console.log('err', err);
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
          dispatch({
            type: ActionType.SET_SNACK_MESSAGE,
            payload: {
              snackMessage: {
                snackMessageType: 'error',
                message: 'Error while submitting the deployment data!',
              },
            },
          });
        }
      );
    }
  };

  const handleAddDeploymentDataOpen = () => {
    setIsAddDeploymentDataDialogOpen(true);
  };

  const handleAddDeploymentDataClose = () => {
    setIsAddDeploymentDataDialogOpen(false);
  };

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
    navigate('/create/');
  }
  const setDummyUser = () => {
    dispatch({
      type: ActionType.SET_USER,
      payload: { user: azureToUser('03649325-7314-44c3-9608-48878cab6e56') },
    });

    dispatch({
      type: ActionType.SET_PREFERRED_NICKNAME,
      payload: {
        preferredNickname: 'Sean Woon',
        avatar: 'Animals-avatar_12avatar',
        userType: 2,
      },
    });
  };

  return (
    <>
      {isXsUp ? (
        <Box
          sx={{
            height: 'calc(var(--app-height))',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <DeploymentPopUp />
          <LandingLayout></LandingLayout>
          <Box
            sx={{
              height: 'calc(100% - 120px)',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              // justifyContent: 'center',
              width: '100%',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                // justifyContent: 'flex-start',
                flexDirection: 'column',
                // margin: '16px',
                width: 'calc(100% - 40px)',

                padding: '20px',
              }}
            >
              {/* What BACI retro are you joining today? Text */}
              <H4RegularTypography
                label={'What BACI retro are you joining today?'}
                style={{
                  color: '#2C69A1',
                  textAlign: 'left',
                  width: '100%',
                  display: 'flex',
                  marginTop: '10px',
                }}
              />
              {/* Retro text field */}
              <FormControl style={{ width: '100%', marginTop: '32px' }}>
                <TextField
                  autoFocus
                  variant="standard"
                  label="Retro access code"
                  error={!!codeError}
                  sx={{
                    ...styles.accessCodeTextField,
                  }}
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
                {/* Error message */}
                {codeError !== '' && (
                  <FormHelperText
                    style={{ color: '#d32f2f', marginLeft: '5px' }}
                  >
                    {codeError}
                  </FormHelperText>
                )}
              </FormControl>
              {/* Go On Button */}
              <ContainedButton
                id={'join_retro_button'}
                name={'Go on..'}
                onClick={() => joinRetro()}
                style={{
                  width: '100%',
                  marginTop: '48px',
                  padding: '10px 20px',
                  gap: '8px',
                }}
                size={'medium'}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            height: 'calc(var(--app-height))',
            width: '100%',
          }}
        >
          {/* <Box sx={{ display: 'flex', width: '72px', height: '100%' }}>
            <LeftBar />
          </Box> */}
          <Grid
            container
            spacing={0}
            height="calc(var(--app-height))"
            sx={{ overflowY: 'auto' }}
          >
            <DeploymentPopUp />
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
              // marginLeft="10px"
              // marginRight="10px"
            >
              {isDemo ? (
                <>
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
                      <FormHelperText
                        style={{ color: '#d32f2f', marginLeft: '5px' }}
                      >
                        {codeError}
                      </FormHelperText>
                    )}
                    <Box>
                      <Box display="flex" flexDirection="row">
                        <ContainedButton
                          id={'join_retro_button_desktop'}
                          name={'Go on..'}
                          onClick={() => joinRetro()}
                          style={{
                            // // width: '100%',
                            marginTop: '80px',
                            padding: '10px 20px',
                            gap: '8px',
                          }}
                          size={'medium'}
                        />
                        <ContainedButton
                          id={'login_as_enterprise'}
                          name={'Go to Dashboard'}
                          onClick={() => {
                            setDummyUser();
                            navigate('enterprise/dashboard/');
                          }}
                          style={{
                            width: '40%',
                            marginTop: '80px',
                            marginLeft: '24px',
                            padding: '10px 20px',
                            gap: '8px',
                          }}
                          size={'medium'}
                        />
                      </Box>
                      {isSmUp && (
                        <TextButton
                          id={'create_new__retro_button_desktop'}
                          label={'Create New Retro'}
                          onClick={() => CreateNewRetro()}
                          style={{
                            marginTop: '20px',
                            textDecorationLine: 'underline',
                          }}
                          size={'medium'}
                        />
                      )}
                    </Box>
                  </Grid>
                </>
              ) : (
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
                    <FormHelperText
                      style={{ color: '#d32f2f', marginLeft: '5px' }}
                    >
                      {codeError}
                    </FormHelperText>
                  )}
                  <Box>
                    <ContainedButton
                      id={'join_retro_button_desktop'}
                      name={'Go on..'}
                      onClick={() => joinRetro()}
                      style={{
                        // width: '100%',
                        marginTop: '80px',
                        padding: '10px 20px',
                        gap: '8px',
                      }}
                      size={'medium'}
                    />
                    {isSmUp && (
                      <TextButton
                        id={'create_new__retro_button_desktop'}
                        label={'Create New Retro'}
                        onClick={() => CreateNewRetro()}
                        style={{
                          marginTop: '42px',
                          textDecorationLine: 'underline',
                        }}
                        size={'medium'}
                      />
                    )}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      <BootstrapDialog
        open={isAddDeploymentDataDialogOpen}
        onClose={handleAddDeploymentDataClose}
        aria-labelledby="customized-dialog-title"
      >
        <AddDeploymentDataDialog
          handleAddDeploymentDataClose={handleAddDeploymentDataClose}
          handleAddDeploymentData={handleAddDeploymentData}
        />
      </BootstrapDialog>
      <PrivacyAndRetentionDialog />
    </>
  );
}
