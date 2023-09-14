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
import './../../global.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { azureToUser, useAzureAuth } from '../../helpers/msal/azureauth';
import { Dayjs } from 'dayjs';
import { LandingLayout } from './LandingLayout';
import { Retro as RetroType } from '../../helpers/types';
import { useRetro } from '../../helpers';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import {
  addDeploymentData,
  getAllEnterprises,
  getAllRoles,
} from '../../helpers/msal/services';
import { AddDeploymentDataDialog } from '../Utils/Dialogs/AddDeploymentDataDialog';
import { DeploymentPopUp } from '../Utils/Alerts/DeploymentPopUp';
import { PrivacyAndRetentionDialog } from '../Utils/Dialogs/PrivacyAndRetentionDialog';
import BACILogo from '../../assets/img/bacilogobeta.svg';
import {
  BodyRegularTypography,
  H2RegularTypography,
  H4RegularTypography,
  TinyTextTypography,
} from '../../components/CustomizedTypography';
import {
  ContainedButton,
  OutlinedButton,
  OutlinedButtonWithIcon,
  TextButton,
} from '../../components';
import { UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { loginRequest } from '../../authConfig';
import { UserHeader } from '../Utils/User/UserHeader';
import { IN_PROGRESS_NONE } from '../../constants/applicationConst';

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
  logoImage: {
    height: '49.5px',
    marginTop: '25px',
  },
};

export function LandingPage({ isDemo }: { isDemo?: boolean }) {
  const { id } = useParams();
  const retro = useRetro();
  const navigate = useNavigate();
  const { accounts, instance, inProgress } = useMsal();

  let activeAccount;

  const [humanId, setHumanId] = React.useState(id || '');
  const [codeError, setCodeError] = React.useState('');
  const [height, setHeight] = React.useState(0);
  const [global, dispatch] = React.useContext(GlobalContext);
  const isXsUp = useMediaQuery('(max-width:768px)');
  const isSmUp = useMediaQuery('(min-width:1024px)');
  const [isAddDeploymentDataDialogOpen, setIsAddDeploymentDataDialogOpen] =
    React.useState(false);

  React.useEffect(() => {
    sessionStorage.removeItem('BoardContext');
    sessionStorage.removeItem('GlobalContext');
    sessionStorage.removeItem('retroname');
    sessionStorage.removeItem('showManual');
    localStorage.removeItem('selectedTemplate');
    localStorage.removeItem('tempSelectedTemplateData');
    localStorage.removeItem('userAzureData');
    localStorage.removeItem('userData');
  }, []);

  React.useEffect(() => {
    setHeight(window.innerHeight);
    dispatch({
      type: ActionType.CLOSE_CURRENT_RETRO,
    });
  }, []);

  if (instance) {
    activeAccount = instance.getActiveAccount();
  }

  useAzureAuth();

  // Handle Login Button
  const handleLoginRedirect = () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    instance
      .loginRedirect(loginRequest)
      .then(res => {
        console.log('res::::::', res);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      });
  };

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

  // Navigate To Private Policy
  const navigateToPrivatePolicy = () => {
    navigate('/privatePolicy/');
  };

  // Navigate To Term And Condition
  const navigateToTermAndCondition = () => {
    navigate('/termAndCondition/');
  };

  return (
    <>
      {isXsUp ? (
        // Mobile user
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
              width: '100%',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
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
        // Desktop User
        <>
          {accounts &&
            accounts.length === 0 &&
            inProgress === IN_PROGRESS_NONE && (
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
                  >
                    {isDemo ? (
                      // For Demo
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
                        <Box>
                          <img
                            src={BACILogo}
                            alt="Logo"
                            style={styles.logoImage}
                          />
                        </Box>
                        <H2RegularTypography
                          label={'What BACI retro are you joining today?'}
                          style={{
                            color: '#2C69A1',
                            marginTop: '48px',
                          }}
                        />
                        <Box component="span" mt="32px" />
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
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="start"
                          sx={{ maxWidth: '350px' }}
                        >
                          <ContainedButton
                            id={'join_retro_button_desktop'}
                            name={'join retro'}
                            onClick={() => joinRetro()}
                            style={{
                              width: '100%',
                              marginTop: '60px',
                              padding: '10px 18px',
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
                              width: '100%',
                              marginTop: '8px',
                              padding: '10px 18px',
                              gap: '8px',
                            }}
                          />
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <BodyRegularTypography
                              label="OR"
                              style={{
                                color: '#808080',
                                marginTop: '32px',
                                marginBottom: '32px',
                              }}
                            />
                          </Box>
                          <UnauthenticatedTemplate>
                            <OutlinedButtonWithIcon
                              id={'signin_button_desktop'}
                              label={'Continue using Email'}
                              size={'medium'}
                              iconPath="/svgs/envelop.svg"
                              style={{ width: '100%' }}
                              onClick={() => handleLoginRedirect()}
                            />
                          </UnauthenticatedTemplate>
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
                    ) : (
                      // For Normal
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
                              marginTop: '80px',
                              padding: '10px 20px',
                              gap: '8px',
                            }}
                            size={'medium'}
                          />
                          {isSmUp && (
                            <>
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
                              <UnauthenticatedTemplate>
                                <ContainedButton
                                  id={'signin_button_desktop'}
                                  name={'Sign In'}
                                  onClick={() => handleLoginRedirect()}
                                  style={{
                                    marginTop: '42px',
                                    textDecorationLine: 'underline',
                                  }}
                                  size={'medium'}
                                />
                              </UnauthenticatedTemplate>
                            </>
                          )}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Box>
            )}
          {accounts && accounts.length != 0 && (
            <UserHeader accounts={accounts} />
          )}
        </>
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
