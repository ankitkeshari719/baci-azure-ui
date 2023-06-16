import {
  Box,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LandingLayout } from './LandingLayout';
import './../../global.scss';
import { Retro as RetroType } from '../../helpers/types';
import { useRetro } from '../../helpers';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import Avatar from '../../components/Elements/Avatar';
import { avatarName } from '../../constants/AvatarName';
import { useAzureAuth } from '../../helpers/msal/azureauth';
import { UserTypeArray } from '../../constants';
import { BoardContext } from '../../contexts/BoardContext';
import theme from '../../helpers/theme/theme';
import { SocketContext } from '../../contexts/SocketProvider';
import { DeploymentPopUp } from './../Utils/Alerts/DeploymentPopUp';
import useReRoute from '../../helpers/hooks/useReRoute';
import { PrivacyAndRetentionDialog } from '../Utils/Dialogs/PrivacyAndRetentionDialog';
import {
  CaptionRegularTypography,
  H1RegularTypography,
  H3RegularTypography,
  H5SemiBoldTypography,
} from '../../components/CustomizedTypography';
import { ContainedButton, TextButton } from '../../components';

const AVATAR_CHARACTER_LIMIT = 30;

const styles = {
  avatarfield: {
    '& .MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontSize: '14px',
    },
  },
  chooseAvatarText: {
    marginTop: '32px',
    marginBottom: '12px',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  avatarBox: {
    width: '527px',
    height: '220px',
    overflowY: 'auto',
    marginTop: '24px',
  },
  goOnBtn: {
    marginTop: '48px',
  },
  avatarSvg: {
    width: '60px',
    height: '60px',
    marginBottom: '30px',
    marginRight: '30px',
    borderRadius: '50%',
  },
  avatarSvgXs: {
    width: '60px',
    height: '60px',
    marginBottom: '15px',
    borderRadius: '50%',
  },
};

export function JoinRetro() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: { users, retroId, retroStarted, ended, retroName },
    commitAction,
  } = React.useContext(BoardContext);
  const [selectedAvatar, setAvatar] = React.useState('');
  const [avatarList, setAvatarList] = React.useState<string[]>([]);

  const [userName, setUserName] = React.useState('');
  const [codeError, setCodeError] = React.useState('');
  const [codeWarning, setCodeWarning] = React.useState('');
  const [avatarSelectionError, setAvatarSelectionError] = React.useState('');
  const { id } = useParams();
  const [humanId, setHumanId] = React.useState(id || '');
  const retro = useRetro();
  const navigate = useNavigate();
  const [started, setStarted] = React.useState(
    global.retroCreateState || false
  );
  const socket = React.useContext(SocketContext);
  const [joining, setJoining] = React.useState(id ? true : false);
  const [captureName, setCaptureName] = React.useState(id ? true : false);
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const [openAvatarDialog, setOpenAvatarDialog] = React.useState(false);
  const [height, setHeight] = React.useState(0);

  // Re-Routing rules added
  useReRoute();

  useAzureAuth();

  React.useEffect(() => {
    loadRetroDetails();
    setAvatarList(avatarName.sort(() => Math.random() - 0.5));
    setHeight(window.innerHeight);
  }, []);

  React.useEffect(() => {
    socket.connect().on('connect', () => {
      console.log('----------- socket connected ------------');
    });
    if (
      !global.user.id ||
      global.user.id == undefined ||
      global.user.id == null
    ) {
      useAzureAuth;
    } else {
    }
    if (!global.currentRetro?.name) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      joinRetro(true).then(
        res => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });

          navigatorFunction();
        },
        err => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        }
      );
    } else {
      navigatorFunction();
    }
  }, [users, global?.user?.id]);

  const loadRetroDetails = async () => {
    let foundRetro = await retro.getByHumanId(humanId);
    dispatch({
      type: ActionType.SET_CURRENT_RETRO,
      payload: { retro: foundRetro },
    });
  };

  const onClickAvatar = (avatarName: any) => {
    setAvatar(avatarName);
    setAvatarSelectionError('');
  };

  const setName = () => {
    sessionStorage.removeItem('pulseCheckState');
    if (userName !== '' && selectedAvatar !== '') {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: { loadingFlag: true },
      });
      const userTypeValue: number =
        global?.user?.id == global.currentRetro?.creatorId
          ? UserTypeArray[1].id
          : UserTypeArray[0].id;
      dispatch({
        type: ActionType.SET_PREFERRED_NICKNAME,
        payload: {
          preferredNickname: userName,
          avatar: selectedAvatar,
          userType: userTypeValue,
        },
      });
      if (!global.currentRetro || joining) {
        joinRetro(false).then(retro => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
          if (retro) {
            if (global.currentRetro?.creatorId === global.user?.id) {
              navigate('/board/' + retro.id + '/startRetro');
            } else {
              navigate('/board/' + retro.id + '/waiting');

              setCaptureName(false);
            }
          }
        });
      } else {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        navigate('/board/' + global.currentRetro?.id);
        setCaptureName(false);
      }
    } else {
      if (userName === '') setCodeError('Please enter avatar name');
      else {
        setAvatarSelectionError('Please select avatar');
      }
    }
  };

  const handleUsername = (e: string) => {
    setCodeWarning('');
    setCodeError('');

    if (e.length >= 25) {
      let count = 30 - e.length;
      if (count === 0) {
        setCodeWarning('No more charachter remaining');
      } else {
        setCodeWarning('Character remaining -' + `${count}`);
      }
    }
    if (selectedAvatar != '') {
      setAvatarSelectionError('');
    }

    setUserName(e);
  };

  const navigatorFunction = (): any => {
    if (
      retroId != undefined &&
      retroId != '' &&
      retroId == global?.currentRetro?.id &&
      global.user.id != ''
    ) {
      const currentUser: any = users.find(
        user => user.userId === global.user.id
      );
      if (currentUser) {
        const userTypeValue: number =
          global?.user?.id == global.currentRetro?.creatorId
            ? UserTypeArray[1].id
            : UserTypeArray[0].id;
        dispatch({
          type: ActionType.SET_USER,
          payload: {
            user: {
              id: currentUser.userId,
              name: currentUser.userNickname,
              avatar: currentUser.avatar,
              userType: userTypeValue,
            },
          },
        });

        if (ended || retroStarted) {
          if (ended && currentUser.userId == global.currentRetro?.creatorId) {
            navigate('/report/' + global.currentRetro?.id);
          } else {
            if (currentUser?.pulseCheckQuestions?.length > 0)
              navigate('/board/' + global.currentRetro?.id);
            else navigate('/board/' + global.currentRetro?.id + '/pulseCheck');
          }
        } else {
          if (currentUser.userId == global.currentRetro?.creatorId && !isXsUp) {
            navigate('/board/' + global.currentRetro?.id + '/startRetro');
          } else {
            navigate('/board/' + global.currentRetro?.id + '/waiting');
          }
        }
      }
    }
  };

  const joinRetro = async (
    retrunBool: boolean
  ): Promise<RetroType | undefined> => {
    let foundRetro = await retro.getByHumanId(humanId);

    if (humanId === '') {
      setCodeError('Please enter access code');
    } else {
      setCodeError('');
    }
    if (!foundRetro) {
      foundRetro = await retro.getById(humanId);
    }
    dispatch({
      type: ActionType.SET_CURRENT_RETRO,
      payload: { retro: foundRetro },
    });
    if (retrunBool) {
      return;
    }
    if (foundRetro) {
      setJoining(true);
      setCaptureName(true);
      return foundRetro;
    } else {
      setCodeError('Sorry, wrong code. Please try again');
    }
  };

  return (
    <>
      {isXsUp ? (
        <Box sx={{ height: 'calc(var(--app-height))', overflowY: 'auto' }}>
          <DeploymentPopUp />
          <LandingLayout></LandingLayout>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              marginTop: '24px',
            }}
          >
            {/* Welcome to BACI Text 1 */}
            <H3RegularTypography
              label={'Welcome to BACI'}
              style={{
                color: '#2C69A1',
                textAlign: 'center',
              }}
            />
            {/* Pick Your Avatar Text 2*/}
            <H5SemiBoldTypography
              label={' Pick Your Avatar'}
              style={{
                color: '#2C69A1',
                textAlign: 'center',
                marginTop: '8px',
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              margin: '16px',
            }}
          >
            {/* Choose Text Field */}
            <FormControl style={{ width: '100%', marginTop: '16px' }}>
              <TextField
                id="standard-helperText"
                label="Choose your name for this retro"
                variant="standard"
                sx={{ ...styles.avatarfield }}
                value={userName}
                onChange={e => handleUsername(e.currentTarget.value)}
                inputProps={{
                  maxLength: AVATAR_CHARACTER_LIMIT,
                }}
                error={!!codeError}
                helperText={codeError}
              />
              {codeWarning !== ' ' && (
                <FormHelperText sx={{ color: 'orange' }}>
                  {codeWarning}
                </FormHelperText>
              )}
            </FormControl>
            {/* Select Avatar */}
            <Box
              style={{
                width: '100%',
                marginTop: '48px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {selectedAvatar && (
                <Avatar
                  avatar={selectedAvatar}
                  css={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                  }}
                ></Avatar>
              )}
              <TextButton
                id={'select_avatar'}
                label={'Select Avatar'}
                onClick={() => setOpenAvatarDialog(true)}
                size={'medium'}
              />
              {avatarSelectionError !== '' && (
                <FormHelperText sx={{ color: 'red', marginLeft: '10px' }}>
                  {avatarSelectionError}
                </FormHelperText>
              )}
            </Box>
            {/* Go On Button */}
            <ContainedButton
              id={'go_on_button'}
              name={'Go on..'}
              onClick={setName}
              style={{
                width: '100%',
                marginTop: '54px',
                padding: '10px 20px',
                gap: '8px',
              }}
              size={'medium'}
            />
          </Box>
        </Box>
      ) : (
        <Grid container spacing={0} style={{ overflowY: 'auto' }}>
          <DeploymentPopUp />
          <Grid item xs={6}>
            <LandingLayout></LandingLayout>
          </Grid>
          <Grid
            item
            xs={6}
            display="flex"
            justifyContent="start"
            alignItems="center"
          >
            <Box sx={{ marginLeft: '80px' }}>
              {!global.currentRetro?.creatorId ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <H1RegularTypography
                    label={'Welcome to the BACI'}
                    style={{
                      color: '#2C69A1',
                    }}
                  />
                  <H3RegularTypography
                    label={'Who you are in ‘' + retroName + '’?'}
                    style={{ color: '#2C69A1' }}
                  />
                </Box>
              ) : (
                <Box>
                  <H3RegularTypography
                    label={'Who you are in ‘' + retroName + '’?'}
                    style={{ color: '#2C69A1' }}
                  />
                </Box>
              )}
              {/* Choose your name for this retro Form Field */}
              <FormControl sx={{ width: '322px', marginTop: '36px' }}>
                <TextField
                  id="standard-helperText"
                  label="Choose your name for this retro"
                  variant="standard"
                  sx={{ ...styles.avatarfield }}
                  value={userName}
                  onChange={e => handleUsername(e.currentTarget.value)}
                  inputProps={{
                    maxLength: AVATAR_CHARACTER_LIMIT,
                  }}
                  error={!!codeError}
                  helperText={codeError}
                />
                {codeWarning !== ' ' && (
                  <FormHelperText sx={{ color: 'orange' }}>
                    {codeWarning}
                  </FormHelperText>
                )}
              </FormControl>
              {/* Select Avatar Text */}
              <Box style={{ marginTop: '32px' }}>
                <CaptionRegularTypography
                  label={'Select Avatar'}
                  style={{
                    color: 'rgba(0, 0, 0, 0.6)',
                    lineHeight: '18px',
                  }}
                />
              </Box>
              {/* Avatar List */}
              <Box sx={styles.avatarBox}>
                {avatarList.map((avatar: any, index) => (
                  <Avatar
                    key={index}
                    avatar={avatar}
                    css={styles.avatarSvg}
                    onClickAvatar={onClickAvatar}
                    selectedAvatar={selectedAvatar}
                  ></Avatar>
                ))}
              </Box>
              {/* Avatar selection Error */}
              {avatarSelectionError !== '' && (
                <Box
                  sx={{
                    color: '#d32f2f',
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: '0.75rem',
                    lineHeight: 1.66,
                    letterSpacing: '0.03333em',
                    textAlign: 'left',
                    marginTop: '3px',
                    marginRight: '0',
                    marginBottom: '0',
                    marginLeft: '0',
                  }}
                >
                  {avatarSelectionError}
                </Box>
              )}
              <ContainedButton
                id={'go_on_button'}
                name={'Go on..'}
                onClick={setName}
                style={{
                  marginTop: '48px',
                  padding: '10px 20px',
                  gap: '8px',
                }}
                size={'medium'}
              />
            </Box>
          </Grid>
        </Grid>
      )}
      {/* Select Avatar Dialog  for Mobile View*/}
      <Dialog
        open={openAvatarDialog}
        sx={{ height: height / 2, overflowY: 'auto' }}
      >
        <DialogTitle>
          <CaptionRegularTypography
            label={'Select Avatar'}
            style={{ color: 'rgba(0, 0, 0, 0.6)', lineHeight: '18px' }}
          />
        </DialogTitle>
        <Box
          sx={{
            width: '90%',
            padding: '16px',
            height: height / 2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            overflowY: 'scroll',
          }}
        >
          {avatarList.map((avatar: any, index) => (
            <Avatar
              key={index}
              avatar={avatar}
              css={styles.avatarSvgXs}
              onClickAvatar={onClickAvatar}
              selectedAvatar={selectedAvatar}
            ></Avatar>
          ))}
        </Box>
        <Box display="flex" justifyContent="center" mb="12px" mt="12px">
          <ContainedButton
            id={'select_avatar'}
            name={'Select'}
            onClick={() => setOpenAvatarDialog(false)}
            style={{
              width: '90%',
              padding: '10px 20px',
              gap: '8px',
            }}
            disabled={selectedAvatar == ''}
            size={'medium'}
          />
        </Box>
      </Dialog>
      <PrivacyAndRetentionDialog />
    </>
  );
}
