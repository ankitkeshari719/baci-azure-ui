import * as React from 'react';
import {
  Typography,
  Box,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  Grid,
  Dialog,
  DialogTitle,
  IconButton,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { AVATAR_CHARACTER_LIMIT } from './const';
import Avatar from '../../elements/Avatar';
import { avatarName } from '../../constants/AvatarName';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ContainedButton, OutlinedButton } from '../../components';
import CloseIcon from '@mui/icons-material/Close';

const styles = {
  avatarfield: {
    '& .MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontSize: '14px',
    },
  },
};

type Props = {
  activePanel: string;
  userName: string;
  userNameError: string;
  userNameWarning: string;
  handleUsername: (username: string) => void;
  selectedAvatar: string;
  avatarSelectionError: string;
  onClickAvatar: (avatarName: string) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
};

export function UserDetails({
  activePanel,
  userName,
  userNameError,
  userNameWarning,
  handleUsername,
  selectedAvatar,
  avatarSelectionError,
  onClickAvatar,
  onClickNext,
  onClickBack,
}: Props) {
  const [openAvatarDialog, setOpenAvatarDialog] = React.useState(false);
  const [avatarList, setAvatarList] = React.useState<string[]>([]);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    setAvatarList(avatarName.sort(() => Math.random() - 0.5));
    setHeight(window.innerHeight);
  }, []);

  return (
    <>
      {/* User Details Panel */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: '#CCCCCC',
          py:
            activePanel != 'userDetailPanel' &&
            userName != '' &&
            selectedAvatar != ''
              ? 2.5
              : 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {activePanel != 'userDetailPanel' &&
          userName != '' &&
          selectedAvatar != '' ? (
            <>
              <Box>
                <Avatar
                  avatar={selectedAvatar}
                  css={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                  }}
                />
              </Box>
              <Box
                className="tabSummary"
                sx={{
                  color: '#4E4E4E',
                  ml: 5
                }}
              >
                {userName}
              </Box>
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color:
                  activePanel === 'userDetailPanel' ? '#2c69a1' : '#4E4E4E',
              }}
            >
              User Details
            </Typography>
          )}
        </Box>
        {activePanel === 'userDetailPanel' && (
          <Box>
            <Box sx={{ mt: 4 }}>
              <FormControl fullWidth>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography className="chooseAvatarText">
                          Choose your avatar
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          ml: 3,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          {selectedAvatar ? (
                            <Avatar
                              avatar={selectedAvatar}
                              css={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                              }}
                            />
                          ) : (
                            <LazyLoadImage
                              className="avatar"
                              style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                              }}
                              src="../svgs/Empty-Animals.svg"
                            ></LazyLoadImage>
                          )}
                          <Button onClick={() => setOpenAvatarDialog(true)}>
                            <span className="primaryButtonText">
                              Select Avatar
                            </span>
                          </Button>
                        </Box>
                        <Box>
                          {avatarSelectionError !== '' && (
                            <FormHelperText
                              sx={{ color: '#d32f2f', marginLeft: '10px' }}
                            >
                              {avatarSelectionError}
                            </FormHelperText>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box>
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
                        error={!!userNameError}
                        helperText={userNameError}
                      />
                      {userNameWarning !== ' ' && (
                        <FormHelperText sx={{ color: '#d32f2f' }}>
                          {userNameWarning}
                        </FormHelperText>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </FormControl>
            </Box>
            <Box
              sx={{
                width: '10%',
                display: 'flex',
                flex: '1 0 auto',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}
            >
              <ContainedButton
                name="Finish"
                onClick={() => onClickNext('userDetailPanel', '')}
                style={{
                  mt: 5,
                  minWidth: '75px !important',
                  height: '36px !important',
                }}
              />
              <OutlinedButton
                name="Back"
                onClick={() => onClickBack('pulseCheckPanel')}
                style={{
                  minWidth: '75px !important',
                  height: '36px !important',
                  mt: 5,
                }}
              />
            </Box>
          </Box>
        )}
        <Dialog
          open={openAvatarDialog}
          sx={{
            height: height - 100,
          }}
        >
          <DialogTitle>
            <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
              <Grid item sm={6}>
                <Box display="flex" justifyContent="flex-start">
                  <Typography component="span" className="selectAvatarText">
                    Select Avatar
                  </Typography>
                </Box>
              </Grid>
              <Grid item sm={6}>
                <Box display="flex" justifyContent="flex-end">
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => setOpenAvatarDialog(false)}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </DialogTitle>
          <Box
            className="avatarDialog"
            sx={{
              height: height / 2,
            }}
          >
            {avatarList.map((avatar: any, index) => (
              <Avatar
                key={index}
                avatar={avatar}
                className="avatarSvgXs"
                onClickAvatar={onClickAvatar}
                selectedAvatar={selectedAvatar}
              ></Avatar>
            ))}
          </Box>
          <Box sx={{ mx: 3 }}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flex: '1 0 auto',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                my: 2,
              }}
            >
              <OutlinedButton
                name="Cancel"
                onClick={() => setOpenAvatarDialog(false)}
                style={{
                  minWidth: '75px !important',
                  height: '36px !important',
                }}
              />
              <ContainedButton
                name="Select"
                onClick={() => setOpenAvatarDialog(false)}
                // disabled={selectedAvatar === ''}
                style={{
                  minWidth: '75px !important',
                  height: '36px !important',
                }}
              />
            </Box>
          </Box>
        </Dialog>
      </Box>
    </>
  );
}
