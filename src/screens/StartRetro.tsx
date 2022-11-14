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
import { Email, EmailOutlined } from '@mui/icons-material';
import { GlobalContext } from '../contexts/GlobalContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import * as Icons from 'heroicons-react';
import StartRetroButton from '../elements/StartRetroButton';
import Toolbar from '../elements/Toolbar';

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
    width: '96px',
    height: '96px',
    margin: '35px 44px 0px 45px',
  },
  group95: {
    marginTop: '27.5px',
    marginBottom: '104px',
    background: '#FFFFFF',
    height: '177px',
    display: 'inline-block',
    width: '100%',
  },
  group96: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    width: '375px',
    height: '375px',
    marginLeft: '245px',
    top: '39.07%',
    bottom: '27.87%',
    background: '#FFFFFF',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
  },
  group97: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    top: '39.07%',
    bottom: '27.87%',
    background: '#FFFFFF',
    width: '375px',
    height: '375px',
    marginRight: '100px',
    marginLeft: '100px',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
  },
  group98: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    top: '39.07%',
    bottom: '27.87%',
    width: '375px',
    height: '375px',
    background: '#FFFFFF',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '10px',
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
    marginTop: '44px',
  },
  copyURL: {
    height: '36px',
    marginTop: '81.29px',
  },
};
export function StartRetro() {
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
      <Grid xs={12} sx={{ paddingLeft: '56px', paddingRight: '56px' }}>
        <Toolbar></Toolbar>
      </Grid>
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
                href="https://baci.app.com"
                rel="noreferrer"
                target="_blank"
                style={styles.link}
              >
                https://baci.app.com
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
            <Box sx={{ display: 'flex', marginTop: '70px' }}>
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
                  <Button
                    variant="outlined"
                    className="primaryButton"
                    startIcon={<Icons.Link size={20} />}
                    style={styles.copyURL}
                  >
                    <span className="primaryButtonText">Copy URL</span>
                  </Button>
                </CopyToClipboard>
              </Box>

              <Box sx={styles.group97}>
                <QRCode
                  value={global.currentRetro?.joinUrl || ''}
                  style={styles.qrCode}
                />
                <div style={styles.div97}>
                  <Button
                    variant="outlined"
                    className="primaryButton"
                    startIcon={<Icons.Qrcode size={20} />}
                    style={styles.copyURL}
                    onClick={downloadQRCode}
                  >
                    <span className="primaryButtonText">download qr code</span>
                  </Button>
                </div>
              </Box>

              <Box sx={styles.group98}>
                <img src={email} alt="email" style={styles.emailImg} />
                <div style={styles.div98}>
                  <Button
                    variant="outlined"
                    className="primaryButton"
                    startIcon={<EmailOutlined />}
                    style={styles.copyURL}
                    onClick={shareRetroDetails}
                  >
                    <span className="primaryButtonText">Invite via email</span>
                  </Button>
                </div>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            sx={{ justifyContent: 'center', alignItems: 'center' }}
          >
            <StartRetroButton />
            {/* <Button
              variant="outlined"
              className="secondaryButton"
              style={styles.goToRetroBtn}
              onClick={() => goToRetro()}
            >
              <span className="secondaryButtonText">Start retro</span>
            </Button> */}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
