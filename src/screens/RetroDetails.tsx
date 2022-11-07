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

import email from '../assets/img/emailbox.png';
import copy from '../assets/img/Vectorcopy.png';
import send from '../assets/img/Vectorsend.png';
import download from '../assets/img/download.png';
import { Email, EmailOutlined } from '@mui/icons-material';
import { GlobalContext } from '../contexts/GlobalContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import * as Icons from 'heroicons-react';

const styles = {
  frame101: {
    marginTop: '112px',
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
    display: 'inline',
  },
  copyImg: {
    marginBottom: '17.5px',
  },
  emailImg: {
    width: '138px',
    height: '138px',
    margin: '50px 44px 0px 45px',
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    top: '39.07%',
    bottom: '27.87%',
    background: '#CEEFFF',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
    height: '267px',
  },
  group97: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    top: '39.07%',
    bottom: '27.87%',
    background: '#CEEFFF',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
    height: '267px',
  },
  group98: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    top: '39.07%',
    bottom: '27.87%',
    background: '#CEEFFF',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
    height: '267px',
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
  },
  div98: {
    marginTop: '19.12px',
    marginBottom: '17.5px',
  },
  joinurl: {
    color: commonStyles.primaryDark,
    width: '218px',
    height: '61px',
    display: 'inline-block',
  },
  qrCode: {
    margin: '62px 53px 0px 52px',
    width: '115px',
    height: '115px',
  },
  goToRetroBtn: {
    height: '44px',
    marginTop: '44px',
  },
  copyURL: {
    height: '16.5px',
  },
};
export function RetroDetails() {
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
  const downloadQRCode = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('download', 'QR.png');
      const dataURL = canvas.toDataURL('image/png');
      const url = dataURL.replace(
        /^data:image\/png/,
        'data:application/octet-stream'
      );
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    }
  };
  return (
    <Grid container spacing={0} xs={12}>
      <Grid item xs={6}>
        <LandingLayout></LandingLayout>
      </Grid>
      <Grid item xs={6}>
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
              ‘{global.currentRetro?.name}’ retro is created successfully!
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
                <Typography color={commonStyles.primaryDark}>
                  WITH CODE
                </Typography>
              </div>
              <div style={styles.displayCenter}>
                <Typography
                  variant="h2"
                  display="block"
                  color={commonStyles.primaryDark}
                  style={{
                    margin: '12px 0px 0px 0px',
                    width: '185px',
                    textAlign: 'center',
                  }}
                >
                  {global?.currentRetro?.humanId}
                </Typography>
              </div>

              <Grid container spacing={2} mt="48px">
                <Grid item xs={4}>
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
                      <img
                        src={copy}
                        style={(styles.copyURL, { marginTop: '51px' })}
                      ></img>
                    </CopyToClipboard>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={styles.group97}>
                    <QRCode
                      value={global.currentRetro?.joinUrl || ''}
                      style={styles.qrCode}
                    />
                    <div style={styles.div97}>
                      <img
                        src={download}
                        style={styles.copyURL}
                        onClick={downloadQRCode}
                      ></img>
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={styles.group98}>
                    <img src={email} alt="email" style={styles.emailImg} />
                    <div style={styles.div98}>
                      <img src={send} style={styles.copyURL}></img>
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Box
              display="flex"
              sx={{ justifyContent: 'center', alignItems: 'center' }}
              mt="48px"
            >
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
