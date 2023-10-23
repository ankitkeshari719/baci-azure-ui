import {
  Typography,
  Box,
  FormControl,
  Grid,
  FormHelperText,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ContainedButton, OutlinedButton } from '../../components';
import {
  BodyRegularTypography,
  H5SemiBoldTypography,
  H6RegularTypography,
} from '../../components/CustomizedTypography';
import TeamSelector from '../../components/Elements/TeamSelector';
import UserSelector from '../../components/Elements/UserSelector';

const styles = {
  avatarfield: {
    minWidth: '300px',
    '& .MuiFormLabel-root': {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      color: 'rgba(0, 0, 0, 0.6) !important',
    },
    '& .MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
    '& .css-ov41s0-MuiInputBase-root-MuiInput-root': {
      borderBottom: '0px solid rgba(0, 0, 0, 0.42) !important',
    },
    textarea: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '20px',
      letterSpacing: '0.6px',
      color: 'rgba(0, 0, 0, 0.87) !important',
    },
    '& .css-1sop3d1-MuiInputBase-root-MuiInput-root': {
      borderBottom: '0px solid rgba(0, 0, 0, 0.42) !important',
    },
    '& .css-1d1r5q-MuiFormHelperText-root': {
      color: '#d32f2f',
      marginTop: '24px !important',
    },
    '& .css-j7o63n.Mui-error': {
      marginTop: '24px !important',
    },
  },
};

type Props = {
  activePanel: string;
  selectedTeam: string;
  selectedFacilitator: string;
  selectedTeamData: any;
  selectedFacilitatorData: any;
  teamSelectionError: string;
  facilitatorSelectionError: string;
  handleTeamChange: (selectedTeam: any) => void;
  handleFacilitatorChange: (selectedFacilitator: any) => void;
  onClickNext: (currentPanel: string, nextPanel: string) => void;
  onClickBack: (previousPanel: string) => void;
};

export function TeamsDetailsTab({
  activePanel,
  selectedTeam,
  selectedFacilitator,
  selectedTeamData,
  selectedFacilitatorData,
  teamSelectionError,
  facilitatorSelectionError,
  handleTeamChange,
  handleFacilitatorChange,
  onClickNext,
  onClickBack,
}: Props) {
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  return (
    <>
      {/* Teams Details Panel */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: '#CCCCCC',
          py:
            activePanel != 'teamDetailPanel' &&
            selectedTeamData != '' &&
            selectedFacilitatorData != ''
              ? 2.5
              : 3,
        }}
      >
        {/* When the tab is not open */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {activePanel != 'teamDetailPanel' &&
          selectedTeamData != null &&
          selectedFacilitatorData != null ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}
              >
                <H6RegularTypography
                  label="Team: "
                  style={{ color: '#4E4E4E !important' }}
                />
                &nbsp;&nbsp;
                <H5SemiBoldTypography label={selectedTeamData.teamName} />
              </Box>
              <Box
                className="tabSummary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#4E4E4E !important',
                  ml: 5,
                }}
              >
                <BodyRegularTypography
                  label={
                    'Facilitator: ' +
                    selectedFacilitatorData.firstName +
                    ' ' +
                    selectedFacilitatorData.lastName
                  }
                />
                {selectedFacilitatorData.selectedAvatar ? (
                  <LazyLoadImage
                    className="avatar"
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: '5px solid #f9fbf8',
                    }}
                    src={
                      '/avatars/animals/' +
                      selectedFacilitatorData.selectedAvatar +
                      '.svg'
                    }
                  ></LazyLoadImage>
                ) : (
                  <LazyLoadImage
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      border: '5px solid #f9fbf8',
                    }}
                    src="../svgs/Empty-Animals.svg"
                  ></LazyLoadImage>
                )}
              </Box>
            </>
          ) : (
            <Typography
              className="tabSummary"
              sx={{
                color:
                  activePanel === 'teamDetailPanel'
                    ? '#2c69a1 !important'
                    : '#4E4E4E !important',
              }}
            >
              <H6RegularTypography
                label="Team"
                style={{ color: '#4E4E4E !important' }}
              />
            </Typography>
          )}
        </Box>
        {/* When the tab is open */}
        {activePanel === 'teamDetailPanel' && (
          <Box>
            <FormControl fullWidth>
              <Grid container spacing={2}>
                {/* Team Selector */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography className="chooseAvatarText">
                      Select Team:
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <TeamSelector
                        enterpriseId={
                          tempLocalUserData && tempLocalUserData.enterpriseId
                        }
                        selectedTeam={selectedTeam}
                        handleChange={handleTeamChange}
                        showAllTeamOption={false}
                      />
                      <Box ml={2}>
                        {teamSelectionError !== '' && (
                          <FormHelperText
                            sx={{ color: '#d32f2f', marginLeft: '10px' }}
                          >
                            {teamSelectionError}
                          </FormHelperText>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                {/* Facilitator Selector */}
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Typography className="chooseAvatarText">
                      Select Facilitator:
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <UserSelector
                        enterpriseId={
                          tempLocalUserData && tempLocalUserData.enterpriseId
                        }
                        selectedUser={selectedFacilitator}
                        handleChange={handleFacilitatorChange}
                        padding="4px"
                        width={240}
                      />
                      <Box ml={2}>
                        {facilitatorSelectionError !== '' && (
                          <FormHelperText
                            sx={{ color: '#d32f2f', marginLeft: '10px' }}
                          >
                            {facilitatorSelectionError}
                          </FormHelperText>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </FormControl>
            {/* Button Next and Back */}
            <Grid item xs={2}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                }}
              >
                <ContainedButton
                  name="Next"
                  onClick={() =>
                    onClickNext('teamDetailPanel', 'scheduleDetailPanel')
                  }
                  style={{
                    mt: 5,
                    minWidth: '75px !important',
                    height: '36px !important',
                  }}
                  size={'medium'}
                />
                <OutlinedButton
                  label="Back"
                  size={'medium'}
                  onClick={() => onClickBack('pulseCheckPanel')}
                  style={{
                    minWidth: '75px !important',
                    height: '36px !important',
                    mt: 5,
                    ml: 6,
                  }}
                />
              </Box>
            </Grid>
          </Box>
        )}
      </Box>
    </>
  );
}