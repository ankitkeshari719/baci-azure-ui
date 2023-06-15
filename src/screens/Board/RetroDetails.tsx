import * as React from 'react';
import { Box, Button, Grid, Tooltip, Typography } from '@mui/material';
import { LandingLayout } from '../Home/LandingLayout';
import commonStyles from './../../style.module.scss';
import { useNavigate } from 'react-router-dom';

import email from '../../assets/img/emailbox.png';
import copy from '../../assets/img/Vectorcopy.png';
import send from '../../assets/img/Vectorsend.png';
import download from '../../assets/img/download.png';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import { H3RegularTypography } from '../../components/CustomizedTypography';
import { TextButton } from '../../components';

const styles = {
  displayCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  link: {
    color: commonStyles.PrimaryMain,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '125%',
    letterSpacing: '0.006em',
    marginTop: '16px'
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
    minWidth: '218px',
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
    cursor: 'pointer',
  },
};

export function RetroDetails(props: any) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [iscopied, setIsCopied] = React.useState(false);
  const {
    state: { retroName },
  } = React.useContext(BoardContext);

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

  const handleTooltipClose = () => {
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <Grid container spacing={0}>
      <Grid item lg={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '32px',
          }}
        >
          {/* Name Text */}
          <H3RegularTypography
            label={retroName}
            style={{ color: '#4E4E4E', textAlign: 'center' }}
          />
          <TextButton
            id={'participant_join'}
            label={'Participants can join at'}
            onClick={() => null}
            style={{ marginTop: '32px' }}
          />
          <a
            href="https://baci.app/"
            rel="noreferrer"
            target="_blank"
            style={styles.link}
          >
            https://baci.app
          </a>
          <TextButton
            id={'with_code'}
            label={'WITH CODE'}
            onClick={() => null}
            style={{ marginTop: '32px' }}
          />
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
          <Box sx={styles.group99}>
            <Grid container spacing={2} mt="48px">
              <Grid item xs={4}>
                <Box sx={styles.group96}>
                  <Box
                    mt="80px"
                    style={{
                      maxWidth: '154px',
                      overflowX: 'hidden',
                    }}
                  >
                    <a
                      style={{
                        overflowWrap: 'break-word',
                        color: commonStyles.primaryDark,
                      }}
                    >
                      {global?.currentRetro?.joinUrl}
                    </a>
                  </Box>

                  <Box mt="75px">
                    <CopyToClipboard
                      text={global?.currentRetro?.joinUrl}
                      onCopy={() => setIsCopied(true)}
                    >
                      <Tooltip
                        onClose={handleTooltipClose}
                        open={iscopied}
                        style={{ width: '20px', fontSize: '10px' }}
                        enterNextDelay={1500}
                        placement="top"
                        title="Link Copied!"
                      >
                        <img
                          src={copy}
                          style={
                            (styles.copyURL,
                            { marginTop: '0', cursor: 'pointer' })
                          }
                        ></img>
                      </Tooltip>
                    </CopyToClipboard>
                  </Box>
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
                    <img
                      src={send}
                      style={styles.copyURL}
                      onClick={shareRetroDetails}
                    ></img>
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
              onClick={() => props.close()}
            >
              <span className="secondaryButtonText">Close</span>
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
