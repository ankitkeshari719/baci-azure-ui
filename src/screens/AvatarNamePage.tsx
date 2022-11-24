import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  Paper,
  TextField,
  Typography,
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
import Avatar from '../elements/Avatar';
import { avatarName } from '../constants/AvatarName';
import { useAzureAuth } from '../msal/azureauth';
import { UserTypeArray } from '../constants';
import { BoardContext } from '../contexts/BoardContext';
const AVATAR_CHARACTER_LIMIT = 30;
const styles = {
  heading: {
    marginTop: '254px',
  },
  avatarfield: {
    marginTop: '60px',
    width: '322px',
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
};

export function AvatarNamePage() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [retroName, setRetroName] = React.useState(
    localStorage.getItem('retroname') || ''
  );
  const {
    state: {
      users,
      creatorId,
      retroId,
      retroStarted,
      ended,
      needsToShow,
      retroStatus,
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
  const [joining, setJoining] = React.useState(id ? true : false);
  const [captureName, setCaptureName] = React.useState(id ? true : false);

  React.useEffect(() => {
    setAvatarList(avatarName.sort(() => Math.random() - 0.5));
  }, []);

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
  const onClickAvatar = (avatarName: any) => {
    setAvatar(avatarName);
    setAvatarSelectionError('');
    console.log(avatarName);
  };

  const setName = () => {
    localStorage.removeItem('pulseCheckState');
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
          console.log('retro', retro);
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
      else setAvatarSelectionError('Please select avatar');
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
  React.useEffect(() => {
    if (
      !global.user.id ||
      global.user.id == undefined ||
      global.user.id == null
    ) {
      // useAzureAuth();
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
        },
        err => {
          dispatch({
            type: ActionType.SET_LOADING,
            payload: { loadingFlag: false },
          });
        }
      );
    }
  }, []);

  React.useEffect(() => {
    if (
      retroId != undefined &&
      retroId != '' &&
      retroId == global?.currentRetro?.id
    ) {
      console.log(global?.user.id);
      const currentUser: any = users.find(
        user => user.userId === global.user.id
      );
      console.log(users, 'users', currentUser);

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
          if (ended && currentUser.userId == creatorId) {
            navigate('/report/' + global.currentRetro?.id);
          } else {
            if (currentUser?.pulseCheckQuestions?.length > 0)
              navigate('/board/' + global.currentRetro?.id);
            else navigate('/board/' + global.currentRetro?.id + '/pulseCheck');
          }
        }
      }
    }
  }, [users, global.user.id != '']);
  return (
    <Grid container spacing={0} style={{ overflowY: 'auto' }}>
      <Grid item xs={6}>
        <LandingLayout></LandingLayout>
      </Grid>
      <Grid item xs={6}>
        <Grid
          item
          container
          marginRight={commonStyles.m_80}
          marginLeft={commonStyles.m_80}
          flexDirection="column"
          justifyContent="center"
          sx={{ height: '100vh' }}
        >
          <Box>
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
                  Who you are in ‘{global.currentRetro?.name}’?
                </Typography>
              </>
            ) : (
              <Typography variant="h3" color={commonStyles.primaryDark}>
                Who you are in ‘{global.currentRetro?.name}’?
              </Typography>
            )}

            <FormControl>
              <TextField
                id="standard-helperText"
                label="Choose your name for this retro"
                variant="standard"
                sx={styles.avatarfield}
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
          </Box>
          <Box>
            <Typography sx={styles.chooseAvatarText}>
              Choose your avatar
            </Typography>
            <Box sx={styles.avatarBox}>
              {/* <Avatar avatar={`Animals-avatar_${i}avatar`}></Avatar>; */}
              {/* <Box> */}
              {avatarList
                // .sort(() => Math.random() - 0.5)
                .map((avatar: any, index) => (
                  <Avatar
                    key={index}
                    avatar={avatar}
                    css={styles.avatarSvg}
                    onClickAvatar={onClickAvatar}
                    selectedAvatar={selectedAvatar}
                  ></Avatar>
                ))}
              {/* </Box> */}
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
    </Grid>
  );
}
