import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LandingLayout } from './../LandingLayout';
import commonStyles from './../../style.module.scss';
import './../../global.scss';
import { Retro as RetroType } from '../../types';
import { useRetro } from '../../helpers';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import Avatar from '../../elements/Avatar';
import { avatarName } from '../../constants/AvatarName';
import { useAzureAuth } from '../../msal/azureauth';
import { UserTypeArray } from '../../constants';
import { BoardContext } from '../../contexts/BoardContext';
import theme from '../../theme/theme';
import { SocketContext } from '../../contexts/SocketProvider';
import { DeploymentPopUp } from './../Utils/Alerts/DeploymentPopUp';
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
    width: '50px',
    height: '50px',
    marginBottom: '15px',
    borderRadius: '50%',
  },
};

export function JoinRetro() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: {
      users,
      creatorId,
      retroId,
      retroStarted,
      ended,
      needsToShow,
      retroStatus,
      retroName,
    },
    commitAction,
  } = React.useContext(BoardContext);
  const [selectedAvatar, setAvatar] = React.useState('');
  const [avatarList, setAvatarList] = React.useState<string[]>([]);

  const [userName, setUserName] = React.useState('');
  const AVATAR_COUNT = 57;
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

  useAzureAuth();

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
        <Box sx={{ height: 'calc(100vh)', overflowY: 'auto' }}>
          {/* <DeploymentPopUp /> */}
          <LandingLayout></LandingLayout>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              marginTop: '16px',
              overflowY: 'auto',
            }}
          >
            {/* Text 1 */}
            <Typography
              variant="h3"
              color={commonStyles.primaryDark}
              className="alignCenter"
            >
              Welcome to BACI
            </Typography>
            {/* Text 2*/}
            <Typography
              variant="h5"
              color={commonStyles.primaryDark}
              className="alignCenter"
            >
              Pick Your Avatar
            </Typography>
            {/* Choose Text Field */}
            <FormControl sx={{ width: '90%' }}>
              <TextField
                id="standard-helperText"
                label="Choose your name for this retro"
                variant="standard"
                sx={{ ...styles.avatarfield, marginTop: '32px' }}
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
            <Box mt="16px">
              <Box display="flex">
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
                <Button onClick={() => setOpenAvatarDialog(true)}>
                  <span className="primaryButtonText">Select Avatar</span>
                </Button>
              </Box>
              {avatarSelectionError !== '' && (
                <FormHelperText sx={{ color: 'red', marginLeft: '10px' }}>
                  {avatarSelectionError}
                </FormHelperText>
              )}
            </Box>
            {/* Go to button */}
            <Box mt="16px">
              <Button
                variant="outlined"
                className="secondaryButton"
                onClick={setName}
              >
                <span className="secondaryButtonText">Go on..</span>
              </Button>
            </Box>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={0} style={{ overflowY: 'auto' }}>
          {/* <DeploymentPopUp /> */}
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
                <>
                  <Typography variant="h1" color={commonStyles.primaryDark}>
                    Welcome to the BACI
                  </Typography>
                  <Typography
                    variant="h3"
                    color={commonStyles.primaryDark}
                    mt="30px"
                  >
                    Who you are in ‘{retroName}’?
                  </Typography>
                </>
              ) : (
                <Typography variant="h3" color={commonStyles.primaryDark}>
                  Who you are in ‘{retroName}’?
                </Typography>
              )}
              <FormControl sx={{ width: '322px' }}>
                <TextField
                  id="standard-helperText"
                  label="Choose your name for this retro"
                  variant="standard"
                  sx={{ ...styles.avatarfield, marginTop: '32px' }}
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
              <Typography sx={styles.chooseAvatarText}>
                Choose your avatar
              </Typography>
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
              <Button
                variant="outlined"
                className="secondaryButton"
                style={styles.goOnBtn}
                onClick={setName}
              >
                <span className="secondaryButtonText">Go on..</span>
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
      <Dialog
        open={openAvatarDialog}
        sx={{ height: height / 2, overflowY: 'auto' }}
      >
        <DialogTitle>
          <Typography>Select Avatar</Typography>
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
        <Box display="flex" justifyContent="center" mb="10px">
          <Button
            variant="outlined"
            className="secondaryButton"
            onClick={() => setOpenAvatarDialog(false)}
            sx={{ width: '90%' }}
            disabled={selectedAvatar == ''}
          >
            <span className="secondaryButtonText">Select</span>
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
