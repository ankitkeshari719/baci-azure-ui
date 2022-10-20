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
  },
  avatarBox: {
    width: '527px',
    height: '220px',
  },
  goOnBtn:{
    marginTop: '48px'
  }
};

export function AvatarNamePage() {
  const [retroName, setRetroName] = React.useState(
    localStorage.getItem('retroname') || ''
  );
  const AVATAR_COUNT = 57;

  const joinRetro= () =>{
    //Navigate to dashboard
  }
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
          <Box>
            <Typography
              variant="h2"
              color={commonStyles.primaryDark}
              sx={styles.heading}
            >
              Who you are in ‘{retroName}’?
            </Typography>
            <TextField
              id="standard-helperText"
              label="Choose your name for this retro"
              variant="standard"
              sx={styles.avatarfield}
            />
          </Box>
          <Box>
            <Typography sx={styles.chooseAvatarText}>
              Choose your avatar
            </Typography>
            <Box sx={styles.avatarBox}>
            {/* <Avatar avatar={`Animals-avatar_${i}avatar`}></Avatar>; */}
              
            </Box>
            <Button variant="outlined"
              className="secondaryButton"
              style={styles.goOnBtn}
              onClick={joinRetro}
              >
                <span className="secondaryButtonText">Go on..</span>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
