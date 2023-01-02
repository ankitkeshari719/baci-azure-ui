import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Box,
  Button,
  FormControl,
  TextField,
  FormHelperText,
  Dialog,
  DialogTitle,
  Grid,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { AVATAR_CHARACTER_LIMIT } from './const';
import Avatar from '../../elements/Avatar';
import { avatarName } from '../../constants/AvatarName';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const styles = {
  avatarfield: {
    '& .MuiFormLabel-root': {
      color: 'rgba(0, 0, 0, 0.6) !important',
      fontSize: '14px',
    },
  }
};

type Props = {
  expandedPanel: string;
  allPanels: string[];
  onClickChange: (currentPanel: string) => void;
  create: () => void;
  userName: string;
  userNameError: string;
  userNameWarning: string;
  handleUsername: (username: string) => void;
  selectedAvatar: string;
  avatarSelectionError: string;
  onClickAvatar: (avatarName: string) => void;
  onClickBack: (previousPanel: string) => void;
};

export function UserDetails({
  expandedPanel,
  allPanels,
  onClickChange,
  userName,
  userNameError,
  userNameWarning,
  create,
  handleUsername,
  selectedAvatar,
  avatarSelectionError,
  onClickAvatar,
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
    <Accordion expanded={expandedPanel === 'userDetailPanel'}>
      <AccordionSummary>
        <Typography className="accordionSummary">User Details</Typography>
        {allPanels.includes('userDetailPanel') && (
          <Typography
            className="changeText"
            onClick={() => onClickChange('userDetailPanel')}
          >
            Change
          </Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
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
                    ml: 4,
                    display: 'flex',
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
                    ></Avatar>
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
                    <span className="primaryButtonText">Select Avatar</span>
                  </Button>
                  {avatarSelectionError !== '' && (
                    <FormHelperText sx={{ color: 'red', marginLeft: '10px' }}>
                      {avatarSelectionError}
                    </FormHelperText>
                  )}
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
                  <FormHelperText sx={{ color: 'orange' }}>
                    {userNameWarning}
                  </FormHelperText>
                )}
              </Box>
            </Grid>
          </Grid>
        </FormControl>
        <Grid container spacing={0}>
          <Grid item sm={1}>
            <Button
              variant="outlined"
              onClick={create}
              className="nextButton"
            >
              <span className="secondaryButtonText">Finish</span>
            </Button>
          </Grid>
          <Grid item sm={1}>
            <Button
              variant="outlined"
              className="backButton"
              onClick={() => onClickBack('pulseCheckPanel')}
            >
              Back
            </Button>
          </Grid>
        </Grid>
        <Dialog open={openAvatarDialog} sx={{ height: height - 100 }}>
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
                className="avatarSvgXs"
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
      </AccordionDetails>
    </Accordion>
  );
}
