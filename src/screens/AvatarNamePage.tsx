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
import { BoardContext } from '../contexts/BoardContext';
const AVATAR_CHARACTER_LIMIT = 30;
const styles = {
  heading: {
    marginTop: '278px',
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
  const [selectedAvatar, setAvatar] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const AVATAR_COUNT = 57;
  const [codeError, setCodeError] = React.useState('');
  const [codeWarning, setCodeWarning] = React.useState('');
  const [avatarSelectionError, setAvatarSelectionError] = React.useState('');
  const { state: { retroId, users, ended, loading } } = React.useContext(BoardContext);
  const navigate = useNavigate();
  const joinRetro = () => {
    //Navigate to dashboard
  };
  const onClickAvatar = (avatarName: any) => {
    setAvatar(avatarName);
    setAvatarSelectionError('');
    console.log(avatarName);
  };

  const setName = () => {

    sessionStorage.removeItem('pulseCheckState');
    if (userName !== '' && selectedAvatar !== '') {
      dispatch({
        type: ActionType.SET_PREFERRED_NICKNAME,
        payload: { preferredNickname: userName, avatar: selectedAvatar },
      });
      console.log('disptach');
      // if (!global.currentRetro || joining) {
      //   joinRetro().then(retro => {
      //     if (retro) {
      //       navigate('/board/' + retro.id + '/pulsecheck');
      //       setCaptureName(false);
      //     }
      //   });
      // } else {
      //   navigate('/board/' + global.currentRetro?.id);
      //   setCaptureName(false);
      // }
      navigate(`/board/${retroId}/startretro`);
    } else {
      if (userName === '') setCodeError('Please enter avatar name');
      else setAvatarSelectionError('Please select avatar name');
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
  return (
    <Grid container spacing={0}>
      <Grid item xs={6}>
        <LandingLayout></LandingLayout>
      </Grid>
      <Grid item xs={6}>
        <Grid
          item
          xs={12}
          marginRight={commonStyles.m_80}
          marginLeft={commonStyles.m_80}
        >
          <Box>
            <Typography
              variant="h2"
              color={commonStyles.primaryDark}
              sx={styles.heading}
            >
              Who you are in ‘{retroName}’?
            </Typography>
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
              {avatarName.map((avatar: any, index) => (
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
              <Box sx={{ color: 'orange' }}>{avatarSelectionError}</Box>
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
