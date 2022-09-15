import * as React from 'react';

import {
  Button,
  Divider,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { EmailShareButton, WhatsappShareButton } from 'react-share';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";

import EmailIcon from '@mui/icons-material/Email';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import WhatsappOutlinedIcon from '@mui/icons-material/WhatsappOutlined';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import QRCode from 'qrcode.react';
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRetro } from '../helpers';
import { Retro as RetroType } from '../types';
//import { useAuth } from '../firebase/auth';
import { useAzureAuth } from '../msal/azureauth';
import { loginRequest, b2cPolicies } from "../authConfig";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Link as RouterLink } from "react-router-dom";


export function Onboarding() {
  const { id } = useParams();

  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const retro = useRetro();

  const [started, setStarted] = useState(global.retroCreateState || false);
  const [joining, setJoining] = useState(id ? true : false);
  const [captureName, setCaptureName] = useState(id ? true : false);

  const [humanId, setHumanId] = useState(id || '');
  const [retroName, setRetroName] = useState('');
  const [retroTimeframe, setRetroTimeframe] = useState('');
  const [userName, setUserName] = useState(
    global.preferredNickname || global.user?.name
  );
  const [codeError, setCodeError] = useState('');

  const timeframeRef = React.useRef<HTMLSelectElement | null>(null);
  const { instance } = useMsal();
  const create = async () => {
    await retro.create(
      {
        name: retroName === '' ? 'Retro' : retroName,
      },
      retroTimeframe,
      ''
    );
    setCaptureName(false);
  };
  const handleLogin = () => {
    instance.loginRedirect(loginRequest)
        .catch((error) => console.log(error))
  }
  const joinRetro = async (): Promise<RetroType | undefined> => {
    let foundRetro = await retro.getByHumanId(humanId);
    if (!foundRetro) {
      foundRetro = await retro.getById(humanId);
    }
    dispatch({
      type: ActionType.SET_CURRENT_RETRO,
      payload: { retro: foundRetro },
    });
    if (foundRetro) {
      setJoining(true);
      setCaptureName(true);
      return foundRetro;
    } else {
      setCodeError('Sorry, wrong code. Please try again.');
    }
  };

  const setName = () => {
    dispatch({
      type: ActionType.SET_PREFERRED_NICKNAME,
      payload: { preferredNickname: userName },
    });
    setCaptureName(false);
    if (!global.currentRetro || joining) {
      joinRetro().then(retro => {
        if (retro) {
          navigate('/board/' + retro.id);
        }
      });
    } else {
      navigate('/board/' + global.currentRetro?.id);
    }
  };

  const reset = () => {
    dispatch({ type: ActionType.CLOSE_CURRENT_RETRO });
    dispatch({
      type: ActionType.SET_RETRO_CREATE,
      payload: { retroCreateState: false },
    });
    setStarted(false);
    setJoining(false);
    setCaptureName(true);
    setHumanId('');
    setUserName('');
    setRetroName('');
    setRetroTimeframe('');
    setCodeError('');
    navigate('/');
  };

  const shareData = {
    title: 'Retro',
    text: 'Join the retro',
    url: global.currentRetro?.joinUrl,
  };

  const share = () => {
    navigator.share(shareData);
  };

  const canShare = navigator.canShare && navigator.canShare(shareData);

  useAzureAuth();

  return (
    <>
      <CssBaseline />
          <AuthenticatedTemplate>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
                Logged In 
            </Typography>
          </AuthenticatedTemplate>
      <Slide
        direction="up"
        in={!global.currentRetro && !started && !joining && !id}
      >
        <Box
          sx={{
            display:
              !global.currentRetro && !started && !joining && !id
                ? 'flex'
                : 'none',
            height: 'var(--app-height)',
            width: '100vw',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize:'24px'
          }}
        >
          <div style={{marginBottom: '45px'}}>
            <Typography variant="h4" sx={{ textAlign: 'center' }}>
                 What BACI retro are you joining today?
            </Typography>
          </div>
          <Divider sx={{ margin: '20px' }}></Divider>
          <FormControl>
          <Typography  sx={{ textAlign: 'center' , fontSize: '18px'}}>
          Please enter your access code
          </Typography>
            <TextField
              autoFocus
              variant="standard"
              placeholder="12345"
              error={!!codeError}
              helperText={codeError}
              sx={{
                input: {
                  borderRadius: '7px',
                  fontSize: '18px',
                  textAlign: 'center',
                },
                color: '#4D555A',
                minWidth: '300px',
              }}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  joinRetro();
                }
              }}
              value={humanId}
              onChange={e => setHumanId(e.currentTarget.value)}
            />
          </FormControl>
          <Divider sx={{ margin: '20px' }}></Divider>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#397DE1',
                color: '#fff',
                height: '45px',
                minWidth: '300px',
              }}
              onClick={() => joinRetro()}
            >
              Go on...
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              minHeight: '10vh',
              marginTop: '45px'
            }}
          >
            <Button
              sx={{
                height: '45px',
                minWidth: '300px',
                color: 'black',
                textAlign: 'center',
                background: '#CDCDD4',
                cursor: 'pointer',
              }}
              onClick={() => {
                //handleLogin();
                dispatch({
                  type: ActionType.SET_RETRO_CREATE,
                  payload: { retroCreateState: true },
                });
                setStarted(true);
              }}
            >
              or Create new retro
            </Button>
            {/* <Button variant='outlined' sx={{ background: '#159ADD', color: '#fff' }} onClick={() => setJoining(true)}>To join a Retro click here</Button> */}
          </Box>
        </Box>
      </Slide>
      <Slide direction="up" in={!started && joining && captureName}>
        <Box
          sx={{
            display: !started && joining && captureName ? 'flex' : 'none',
            height: 'var(--app-height)',
            width: '100vw',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{ position: 'absolute', top: 0, left: 0, padding: '20px' }}
          >
            Welcome!
          </Typography>
          <Typography variant="h5">What's your Avatar Name?</Typography>
          <Divider sx={{ margin: '20px' }}></Divider>
          <FormControl>
            <TextField
              autoFocus
              variant="outlined"
              placeholder="Your Name or Nickname"
              sx={{
                input: { background: '#CDCDD4', borderRadius: '7px' },
                color: '#4D555A',
                minWidth: '300px',
              }}
              value={userName}
              onChange={e => setUserName(e.currentTarget.value)}
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  setName();
                }
              }}
            />
          </FormControl>
          <Divider sx={{ margin: '20px' }}></Divider>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#159ADD',
                color: '#fff',
                minWidth: '300px',
              }}
              onClick={setName}
            >
              Let's start
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              minHeight: '10vh',
            }}
          >
            <Link
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={reset}
            >
              To return to the main page click here
            </Link>
          </Box>
        </Box>
      </Slide>
      <Slide direction="up" in={started && !joining && !global.currentRetro}>
        <Box
          sx={{
            display:
              started && !joining && !global.currentRetro ? 'flex' : 'none',
            height: 'var(--app-height)',
            width: '100vw',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">Create new Retro</Typography>
          <Divider sx={{ margin: '20px' }}></Divider>
          <FormControl>
            <TextField
              autoFocus
              variant="standard"
              placeholder="New RETRO NAME"
              sx={{ minWidth: '300px' }}
              value={retroName}
              onChange={e => setRetroName(e.currentTarget.value)}
              multiline
              onKeyDown={e => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  timeframeRef.current?.focus();
                }
              }}
            />
            <Select
              inputRef={timeframeRef}
              variant="outlined"
              label="Retro Time Frame"
              displayEmpty
              renderValue={value => (value !== '' ? value : 'Time frame')}
              sx={{
                color: '#727D84',
                minWidth: '320px',
                marginTop: '30px',
                span: { visibility: 'visible', background: 'white' },
              }}
              value={retroTimeframe}
              onChange={e => setRetroTimeframe(e?.target?.value)}
            >
              <MenuItem value={'1 day'}>1 day</MenuItem>
              <MenuItem value={'1 week'}>1 week</MenuItem>
              <MenuItem value={'2 weeks'}>2 weeks</MenuItem>
              <MenuItem value={'3 weeks'}>3 weeks</MenuItem>
              <MenuItem value={'4 weeks'}>4 weeks</MenuItem>
              <MenuItem value={'N/A'}>N/A</MenuItem>
            </Select>
          </FormControl>
          <Divider sx={{ margin: '20px' }}></Divider>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#159ADD',
                color: '#fff',
                minWidth: '300px',
              }}
              onClick={create}
            >
              Create
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              minHeight: '10vh',
            }}
          >
            <Link
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={reset}
            >
              To return to the main page click here
            </Link>
          </Box>
        </Box>
      </Slide>

      <Slide direction="up" in={!!global.currentRetro}>
        <Box
          sx={{
            display: !!global.currentRetro && !captureName ? 'flex' : 'none',
            height: 'var(--app-height)',
            width: '100vw',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {global.currentRetro?.creatorId === global.user.id ? (
            <>
              <Typography
                sx={{ my: 0, mx: 2, fontSize: '1.5rem' }}
                color="text.primary"
                align="center"
              >
                Awesome!
              </Typography>
              <Typography
                sx={{ my: 1, mx: 2, fontWeight: '700' }}
                color="text.primary"
                align="center"
              >
                {global.currentRetro?.creatorId !== global.user.id
                  ? `You're all set!`
                  : `${global.currentRetro.name} has been created`}
              </Typography>
              <Typography
                sx={{ my: 1, mx: 2 }}
                color="text.primary"
                align="center"
              >
                Anyone with code{' '}
                <span style={{ fontWeight: '700', background: '#CDCDD4' }}>
                  {global.currentRetro?.humanId}
                </span>
                , QR or link can join Retro.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  minWidth: '400px',
                  justifyContent: 'space-evenly',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CopyToClipboard text={global.currentRetro?.joinUrl}>
                    <Button
                      sx={{
                        ':hover': { background: '#159ADD' },
                        background: '#159ADD',
                        color: '#fff',
                      }}
                      variant="outlined"
                      onClick={() => {
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
                      }}
                    >
                      Download QR
                    </Button>
                  </CopyToClipboard>
                </div>
                <div
                  style={{
                    flexGrow: 2,
                    justifyContent: 'center',
                    display: 'flex',
                  }}
                >
                  <QRCode value={global.currentRetro?.joinUrl || ''} />
                </div>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  minWidth: '400px',
                  justifyContent: 'space-evenly',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CopyToClipboard text={global.currentRetro?.joinUrl}>
                    <Button
                      sx={{
                        ':hover': { background: '#159ADD' },
                        background: '#159ADD',
                        color: '#fff',
                      }}
                      variant="outlined"
                    >
                      Copy link
                    </Button>
                  </CopyToClipboard>
                </div>

                <div style={{ flexGrow: 2 }}>
                  <TextField
                    variant="outlined"
                    sx={{
                      input: { background: '#CDCDD4', borderRadius: '7px' },
                      minWidth: '300px',
                      margin: '10px',
                      color: '#4D555A',
                    }}
                    value={global.currentRetro?.joinUrl}
                  />
                </div>
              </Box>

              <Grid
                container
                alignItems="center"
                direction="row"
                justifyContent="center"
              >
                <Typography
                  sx={{ paddingBottom: '10px', paddingRight: '10px' }}
                >
                  Send via
                </Typography>
                <EmailShareButton
                  url={global.currentRetro.joinUrl}
                  style={{ padding: '5px' }}
                >
                  <EmailIcon sx={{ color: '#4D555A' }} />
                </EmailShareButton>
                <WhatsappShareButton
                  url={global.currentRetro.joinUrl}
                  style={{ padding: '5px' }}
                >
                  <WhatsappOutlinedIcon sx={{ color: '#4D555A' }} />
                </WhatsappShareButton>
                {canShare ? (
                  <Link
                    style={{ padding: '5px', cursor: 'pointer' }}
                    onClick={share}
                  >
                    <PhoneAndroidIcon sx={{ color: '#4D555A' }} />
                  </Link>
                ) : null}
              </Grid>
            </>
          ) : (
            <Typography
              sx={{ my: 0, mx: 2, fontSize: '1.5rem' }}
              color="text.primary"
              align="center"
            >
              Welcome back
              {global.preferredNickname ? ' ' + global.preferredNickname : ''}!
            </Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px',
            }}
          >
            <Button
              autoFocus
              variant="outlined"
              sx={{
                ':hover': { background: '#159ADD' },
                background: '#159ADD',
                color: '#fff',
                minWidth: '300px',
              }}
              onClick={() => {
                const humanId = global.currentRetro?.humanId;
                //dispatch({ type: ActionType.CLOSE_CURRENT_RETRO });

                dispatch({
                  type: ActionType.SET_RETRO_CREATE,
                  payload: { retroCreateState: false },
                });
                setStarted(false);
                setJoining(true);
                setCaptureName(true);
                setHumanId(humanId as string);
                setUserName('');
                setRetroName('');
                setRetroTimeframe('');
                setCodeError('');

                navigate(`/join/${humanId}`);
              }}
            >
              Go to retro
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              flexDirection: 'column',
              minHeight: '10vh',
            }}
          >
            <Link
              sx={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={reset}
            >
              To return to the main page click here
            </Link>
          </Box>
        </Box>
      </Slide>
    </>
  );
}
