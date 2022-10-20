import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { LandingLayout } from './LandingLayout';
import commonStyles from './../style.module.scss';
import './../global.scss';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRetro } from '../helpers';
import share from '../assets/img/Vectorshare.png';
import email from '../assets/img/emailbox.png';
import copy from '../assets/img/Vectorcopy.png';
import send from '../assets/img/Vectorsend.png';
import { GlobalContext } from '../contexts/GlobalContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';

const styles = {
  frame101: {
    marginTop: '259px',
    marginBttom: '259px',
  },
  group100: {
    marginTop: '60px',
  },
  nowAvailableAt: {
    height: '20px',
    fontFamily: "'Poppins'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    opacity: '0.5',
  },
  displayCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    color: commonStyles.PrimaryMain,
  },
  shareImg: {},
  group99: {
    marginTop: '60px',
  },
  copyImg: {
    marginBottom: '17.5px',
  },
  emailImg: {
    width: '96px',
    height: '96px',
    margin: '35px 44px 0px 45px',
  },
  group95: {
    marginTop: '27.5px',
    marginBottom: '104px',
    background: '#CEEFFF',
    height: '177px',
    display: 'inline-block',
    width: '100%',
  },
  group96: {
    marginTop: '27.5px',
    marginBottom: '104px',
    background: '#CEEFFF',
    height: '177px',
  },
  group97: {
    marginTop: '27.5px',
    marginBottom: '104px',
    background: '#CEEFFF',
  },
  group98: {
    marginTop: '27.5px',
    marginBottom: '104px',
    background: '#CEEFFF',
  },
  div95: {
    marginTop: '48.75px',
    marginBottom: '17.5px',
    marginLeft: '46%',
  },
  div96: {
    marginTop: '60.75px',
    marginBottom: '17.5px',
    marginLeft: '46%',
  },
  div97: {
    marginTop: '27.75px',
    marginBottom: '17.5px',
    marginLeft: '46%',
  },
  div98: {
    marginTop: '19.12px',
    marginBottom: '17.5px',
    marginLeft: '46%',
  },
  joinurl: {
    color: commonStyles.primaryDark,
    width: '153px',
    display: 'inline-block',
    margin: '41px 16px 0px 16px',
  },
  qrCode: {
    margin: '43px 53px 0px 52px',
    width: '80px',
    height: '80px',
  },
  goToRetroBtn: {
    height: '44px',
  },
};
export function RetroDetails() {
  const [retroName, setRetroName] = React.useState(
    localStorage.getItem('retroname') || ''
  );
  const [global, dispatch] = React.useContext(GlobalContext);
  const [iscopied, setIsCopied] = React.useState(false);
  const navigate = useNavigate();
  const shareData = {
    title: 'Retro',
    text: 'Join the retro',
    url: global.currentRetro?.joinUrl,
  };

  const shareRetroDetails = () => {
    navigator.share(shareData);
  };
  function goToRetro() {
    navigate('/join/' + global?.currentRetro?.humanId);
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
          <Box style={styles.frame101}>
            <Typography
              variant="h2"
              color={commonStyles.primaryDark}
              className="alignCenter"
            >
              ‘{retroName}’ retro is created successfully!
            </Typography>
            <Box style={styles.group100}>
              <Box style={styles.displayCenter}>
                <Button sx={styles.nowAvailableAt}>now available at</Button>
              </Box>
              <Box style={styles.displayCenter}>
                {' '}
                <a
                  href="https://baciapp.com"
                  rel="noreferrer"
                  target="_blank"
                  style={styles.link}
                >
                  https://baciapp.com
                </a>
              </Box>
            </Box>
            <Box sx={styles.group99}>
              <div style={styles.displayCenter}>
                <img src={share} alt="Logo" style={styles.shareImg} />
              </div>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Box sx={styles.group95}>
                    {/* <div style={styles.joinurl}>
                  <Typography
                      variant="h2"
                      display="block"
                      color={commonStyles.primaryDark}
                      style={{
                        margin: '64px 0px 0px 0px',
                        width: '185px',
                        textAlign: 'center',
                      }}
                    >
                      {global?.currentRetro?.humanId}
                    </Typography>
                    </div>
                    <CopyToClipboard
                      text={global?.currentRetro?.joinUrl}
                      onCopy={() => setIsCopied(true)}
                    >
                      <div style={styles.div95}>
                        <img src={copy} alt="Logo" />
                      </div>
                    </CopyToClipboard> */}
                    <Typography
                      variant="h2"
                      display="block"
                      color={commonStyles.primaryDark}
                      style={{
                        margin: '64px 0px 0px 0px',
                        width: '185px',
                        textAlign: 'center',
                      }}
                    >
                      {global?.currentRetro?.humanId}
                    </Typography>
                    <CopyToClipboard
                      text={global?.currentRetro?.humanId}
                      onCopy={() => setIsCopied(true)}
                    >
                      <div style={styles.div95}>
                        <img src={copy} alt="Logo" />
                      </div>
                    </CopyToClipboard>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={styles.group96}>
                    <div style={styles.joinurl}>
                      <a style={{ overflowWrap: 'break-word' }}>
                        {global?.currentRetro?.joinUrl}
                      </a>
                    </div>
                    <CopyToClipboard
                      text={global?.currentRetro?.joinUrl}
                      onCopy={() => setIsCopied(true)}
                    >
                      <div style={styles.div96}>
                        <img src={copy} alt="Logo" />
                      </div>
                    </CopyToClipboard>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={styles.group97}>
                    <QRCode
                      value={global.currentRetro?.joinUrl || ''}
                      style={styles.qrCode}
                    />
                    <div style={styles.div97}>
                      <img src={copy} alt="Logo" />
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={styles.group98}>
                    <img src={email} alt="email" style={styles.emailImg} />
                    <div style={styles.div98}>
                      <img src={send} alt="Logo" onClick={shareRetroDetails} />
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box display="flex" sx={{justifyContent: 'center', alignItems: 'center'}}>
              <Button
                variant="outlined"
                className="secondaryButton"
                style={styles.goToRetroBtn}
                onClick={() => goToRetro()}
              >
                <span className="secondaryButtonText">Go to retro</span>
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
