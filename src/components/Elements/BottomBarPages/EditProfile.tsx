import * as React from 'react';
import { AuthenticatedTemplate, useMsal } from '@azure/msal-react';

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
} from '@mui/material';
import {
  ContainedButton,
  OutlinedButton,
  TextButton,
} from './../../../components';
import * as Icons from 'heroicons-react';

import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  CaptionRegularTypography,
  CaptionSemiBoldTypography,
  H3SemiBoldTypography,
  H4SemiBoldTypography,
  H6RegularTypography,
} from '../../CustomizedTypography';
import { getEnterpriseById, updateUser } from '../../../helpers/msal/services';
import { GlobalContext, ActionType } from '../../../contexts/GlobalContext';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import OutlineButtonWithIconWithNoBorder from '../../CustomizedButton/OutlineButtonWithIconWithNoBorder';
import { avatarName } from '../../../constants/AvatarName';
import Avatar from '../Avatar';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { BASIC } from '../../../constants/applicationConst';

const styles = {
  accessCodeTextField: {
    '& .MuiFilledInput-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
      borderRadius: '0px !important',
    },
  },
  messageTextField: {
    '& .MuiFilledInput-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
      borderRadius: '0px !important',
      height: '300px',
    },
  },
};

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

type Props = {
  handleEdit: () => void;
};

export default function EditProfile({ handleEdit }: Props) {
  const { instance } = useMsal();
  const [openAvatarDialog, setOpenAvatarDialog] = React.useState(false);
  const [avatarList, setAvatarList] = React.useState<string[]>([]);
  const [height, setHeight] = React.useState(0);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [selectedAvatar, setSelectedAvatar] = React.useState(
    tempLocalUserData && tempLocalUserData.selectedAvatar
  );
  const [avatarError, setAvatarError] = React.useState('');

  const [global, dispatch] = React.useContext(GlobalContext);
  const [firstName, setFirstName] = React.useState(
    tempLocalUserData && tempLocalUserData.firstName
  );
  const [lastName, setLastName] = React.useState(
    tempLocalUserData && tempLocalUserData.lastName
  );
  const [emailId, setEmailId] = React.useState(
    tempLocalUserData && tempLocalUserData.emailId
  );
  const [phoneNo, setPhoneNo] = React.useState(
    tempLocalUserData && tempLocalUserData.phoneNo
  );
  const [country, setCountry] = React.useState(
    tempLocalUserData && tempLocalUserData.country
  );
  const [cityCode, setCityCode] = React.useState(
    tempLocalUserData && tempLocalUserData.cityCode
  );
  const [companyName, setCompanyName] = React.useState(
    tempLocalUserData && tempLocalUserData.enterpriseName
  );
  const [role, setRole] = React.useState('');
  const [teams, setTeams] = React.useState(
    tempLocalUserData && tempLocalUserData.teams
  );
  const [isEnterpriserRequested, setIsEnterpriserRequested] =
    React.useState(false);
  const [codeFirstNameError, setFirstNameCodeError] = React.useState('');
  const [codeLastNameError, setLastNameCodeError] = React.useState('');
  const [codePhoneNoError, setPhoneNoError] = React.useState('');
  const [codeCountryError, setCountryCodeError] = React.useState('');
  const [codeCityCodeError, setCityCodeCodeError] = React.useState('');

  const [enterpriseDetails, setEnterpriseDetails] = React.useState<any>(null);

  React.useEffect(() => {
    setFirstName(tempLocalUserData && tempLocalUserData.firstName);
    setLastName(tempLocalUserData && tempLocalUserData.lastName);
    setEmailId(tempLocalUserData && tempLocalUserData.emailId);
    setPhoneNo(tempLocalUserData && tempLocalUserData.phoneNo);
    setCountry(tempLocalUserData && tempLocalUserData.country);
    setCityCode(tempLocalUserData && tempLocalUserData.cityCode);
    setCompanyName(tempLocalUserData && tempLocalUserData.enterpriseName);
    setTeams(tempLocalUserData && tempLocalUserData.teams);
    setIsEnterpriserRequested(
      tempLocalUserData && tempLocalUserData.isEnterpriserRequested
    );
    setSelectedAvatar(tempLocalUserData && tempLocalUserData.selectedAvatar);

    let roleName = tempLocalUserData && tempLocalUserData.roleName;
    if (roleName === BASIC) {
      setRole('Basic');
    } else {
      setRole('Enterprise');
    }
  }, []);

  React.useEffect(() => {
    const enterpriseId = tempLocalUserData && tempLocalUserData.enterpriseId;
    callGetEnterpriseById(enterpriseId);
  });

  React.useEffect(() => {
    setAvatarList(avatarName.sort(() => Math.random() - 0.5));
    setHeight(window.innerHeight);
  }, []);

  const callGetEnterpriseById = async (enterpriseId: any) => {
    await getEnterpriseById(enterpriseId).then(
      res => {
        setEnterpriseDetails(res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const submitProfile = () => {
    if (firstName === '') {
      setFirstNameCodeError('Please enter first Name');
    } else {
      setFirstNameCodeError('');
    }
    if (lastName === '') {
      setLastNameCodeError('Please enter last Name');
    } else {
      setLastNameCodeError('');
    }
    if (phoneNo === '') {
      setPhoneNoError('Please enter phone no.');
    } else {
      setPhoneNoError('');
    }
    if (country === '') {
      setCountryCodeError('Please enter country code');
    } else {
      setCountryCodeError('');
    }
    if (cityCode === '') {
      setCityCodeCodeError('Please enter city code');
    } else {
      setCityCodeCodeError('');
    }

    if (
      firstName === '' ||
      lastName === '' ||
      phoneNo === '' ||
      country === '' ||
      cityCode === ''
    ) {
      return;
    }

    if (
      firstName != '' ||
      lastName != '' ||
      phoneNo != '' ||
      country != '' ||
      cityCode != ''
    ) {
      // Call API
      callUpdateUser();
    }
  };

  const callUpdateUser = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const teamsIds = teams.map((team: any) => team.teamId);
    const requestBody = {
      firstName: firstName,
      lastName: lastName,
      phoneNo: phoneNo,
      country: country,
      cityCode: cityCode,
      teams: teamsIds,
      selectedAvatar: selectedAvatar,
    };
    await updateUser(emailId, requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        localStorage.setItem('userData', JSON.stringify(res));
        handleEdit();
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        console.log('err', err);
      }
    );
  };

  const requestEnterpriseAdmin = () => {
    // Call API to request for Admin Role
    updateIsEnterpriserRequested();
  };

  // Update user data for isEnterpriserRequested
  const updateIsEnterpriserRequested = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      isEnterpriserRequested: !isEnterpriserRequested,
    };

    await updateUser(emailId, requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        localStorage.setItem('userData', JSON.stringify(res));
        setIsEnterpriserRequested(!isEnterpriserRequested);
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        console.log('err', err);
      }
    );
  };

  const handleLogoutRedirect = () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    instance
      .logoutRedirect()
      .then(() => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      });
  };

  const onSelectAvatar = (avatarName: string) => {
    setAvatarError('');
    setSelectedAvatar(avatarName);
  };

  const onClickSubmit = () => {
    if (selectedAvatar === '') {
      setAvatarError('Please select an avatar.');
      return;
    }
    setSelectedAvatar(selectedAvatar);
    setOpenAvatarDialog(false);
  };

  const imaSrc = '/avatars/animals/' + selectedAvatar + '.svg';

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            height: '100%',
            width: '30%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {selectedAvatar ? (
            <LazyLoadImage
              className="avatar"
              style={{
                height: '345px',
                width: '345px',
                borderRadius: '50%',
                border: '5px solid #f9fbf8',
              }}
              src={imaSrc}
            ></LazyLoadImage>
          ) : (
            <img
              src={'/svgs/DefaultUser.svg'}
              style={{ height: '345px', width: '345px' }}
            />
          )}
          <TextButton
            id={'Select_Avatar'}
            label={'Select Avatar'}
            size={'small'}
            onClick={() => setOpenAvatarDialog(true)}
          />
          {firstName === '' && lastName === '' ? (
            <H6RegularTypography label="-" />
          ) : (
            <H3SemiBoldTypography
              label={firstName + ' ' + lastName}
              style={{ marginTop: '24px' }}
            />
          )}
          {role === '' ? (
            <H6RegularTypography label="-" />
          ) : (
            <H6RegularTypography label={role} style={{ marginTop: '8px' }} />
          )}

          {country === '' ? (
            <H6RegularTypography label="-" />
          ) : (
            <BodyRegularTypography
              label={country}
              style={{ marginTop: '8px' }}
            />
          )}

          <AuthenticatedTemplate>
            <ContainedButton
              id={'signin_button_desktop'}
              name={'Logout'}
              onClick={() => handleLogoutRedirect()}
              style={{
                marginTop: '42px',
                textDecorationLine: 'underline',
                background: '#EA4335 !important',
              }}
              size={'medium'}
            />
          </AuthenticatedTemplate>
        </Box>
        {/* Right Side */}
        <Box
          sx={{
            height: '100%',
            width: '70%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
        >
          {/* Personal Information */}
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: '100%',
              flexDirection: 'row',
            }}
          >
            <H4SemiBoldTypography
              label="Personal Information"
              style={{ color: '#000000' }}
            />
            <Box display="flex" flexDirection="row">
              <OutlineButtonWithIconWithNoBorder
                id="go_to_readOnly_mode"
                label="Back"
                iconPath="/svgs/back_outline.svg"
                onClick={() => handleEdit()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              <OutlineButtonWithIconWithNoBorder
                id="save_user_info"
                label="save"
                iconPath="/svgs/envelop.svg"
                onClick={() => submitProfile()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: '24px',
            }}
          >
            {/* First name */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="First Name"
                  autoFocus
                  variant="standard"
                  error={!!codeFirstNameError}
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={firstName}
                  onChange={e => {
                    setFirstName(e.currentTarget.value);
                    setFirstNameCodeError('');
                  }}
                />
              </Box>
              {/* Error message */}
              {codeFirstNameError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeFirstNameError}
                </FormHelperText>
              )}
            </FormControl>
            {/* Last name */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <TextField
                  label="Last Name"
                  variant="standard"
                  error={!!codeLastNameError}
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={lastName}
                  onChange={e => {
                    setLastName(e.currentTarget.value);
                    setLastNameCodeError('');
                  }}
                />
              </Box>
              {/* Error message */}
              {codeLastNameError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeLastNameError}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: '24px',
            }}
          >
            {/* Email Id */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="Email"
                  variant="filled"
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={emailId}
                  onChange={e => {
                    setEmailId(e.currentTarget.value);
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </FormControl>
            {/* Phone No */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="Phone No"
                  variant="standard"
                  error={!!codePhoneNoError}
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={phoneNo}
                  onChange={e => {
                    setPhoneNo(e.currentTarget.value);
                    setPhoneNoError('');
                  }}
                />
              </Box>
              {/* Error message */}
              {codePhoneNoError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codePhoneNoError}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: '24px',
            }}
          >
            {/* Country */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="Country"
                  variant="standard"
                  error={!!codeCountryError}
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={country}
                  onChange={e => {
                    setCountry(e.currentTarget.value);
                    setCountryCodeError('');
                  }}
                />
              </Box>
              {/* Error message */}
              {codeCountryError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeCountryError}
                </FormHelperText>
              )}
            </FormControl>
            {/* City Code */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="City Code"
                  variant="standard"
                  error={!!codeCityCodeError}
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={cityCode}
                  onChange={e => {
                    setCityCode(e.currentTarget.value);
                    setCityCodeCodeError('');
                  }}
                />
              </Box>
              {/* Error message */}
              {codeCityCodeError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeCityCodeError}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          {/* Professional Details */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: '48px',
            }}
          >
            <H4SemiBoldTypography
              label="Professional Details"
              style={{ color: '#000000' }}
            />
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: '24px',
            }}
          >
            {/* Company Name */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="Company Name"
                  variant="filled"
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={companyName}
                  onChange={e => {
                    setCompanyName(e.currentTarget.value);
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </FormControl>
            {/* Team */}
            <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {teams.length === 0 ? (
                  "Team's Not Found"
                ) : (
                  <Box
                    sx={{
                      width: '400px',
                      backgroundColor: 'rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <CaptionRegularTypography
                      label="Teams"
                      style={{
                        marginBottom: '24px',
                        color: 'rgba(0, 0, 0, 0.6)',
                      }}
                    />
                    <Box>
                      {teams.map((team: any, index: number) => {
                        return (
                          <>
                            {team.teamName}
                            {index < teams.length - 1 ? ', ' : ''}
                          </>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>
            </FormControl>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: '24px',
            }}
          >
            {/* Role */}
            <FormControl
              style={{
                display: 'flex',
                width: '484px',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="Role"
                  variant="filled"
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={role}
                  onChange={e => {
                    setRole(e.currentTarget.value);
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </FormControl>
            {/* Request Enterprise Button*/}
            {isEnterpriserRequested ? (
              <Box display="flex" flexDirection="column">
                <Box display="flex" flexDirection="row" alignItems="center">
                  <ContainedButton
                    id={'request_enterprise_admin'}
                    name={'Cancel Request'}
                    onClick={() => updateIsEnterpriserRequested()}
                    style={{
                      padding: '10px 18px',
                      gap: '8px',
                      background: '#EA4335 !important',
                    }}
                    size={'medium'}
                  />
                  <BootstrapTooltip
                    title="Enterprise get Additional Analytics Insights from each team. If your organisation needs an enterprise account contact sales@baci.com"
                    placement="right"
                  >
                    <Icons.InformationCircleOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    />
                  </BootstrapTooltip>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  sx={{
                    marginTop: '24px',
                    padding: '12px',
                    background: '#CEEFFF',
                  }}
                >
                  <BodySemiBoldTypography label="Your Request for Enterprise Dashboard is sent" />
                  <CaptionRegularTypography
                    label="Waiting for Admin to accept your request."
                    style={{ marginTop: '16px' }}
                  />
                </Box>
              </Box>
            ) : (
              <Box display="flex" flexDirection="row" alignItems="center">
                <ContainedButton
                  id={'request_enterprise_admin'}
                  name={'Request Enterprise'}
                  onClick={() => requestEnterpriseAdmin()}
                  style={{
                    padding: '10px 18px',
                    gap: '8px',
                  }}
                  size={'medium'}
                />
                <BootstrapTooltip
                  title="Enterprise get Additional Analytics Insights from each team. If your organisation needs an enterprise account contact sales@baci.com"
                  placement="right"
                >
                  <Icons.InformationCircleOutline
                    size={24}
                    color="#4E4E4E"
                    style={{
                      cursor: 'pointer',
                      marginLeft: '5px',
                    }}
                  />
                </BootstrapTooltip>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Dialog
        open={openAvatarDialog}
        sx={{
          height: height - 100,
        }}
      >
        <DialogTitle style={{ padding: '16px' }}>
          <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item sm={6}>
              <Box display="flex" justifyContent="flex-start">
                <H6RegularTypography
                  label={'Select Avatar'}
                  style={{
                    color: '#4E4E4E',
                  }}
                />
              </Box>
            </Grid>
            <Grid item sm={6}>
              <Box display="flex" justifyContent="flex-end">
                <Icons.X
                  size={20}
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => setOpenAvatarDialog(false)}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        {/* Avatar List */}
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
              onClickAvatar={onSelectAvatar}
              selectedAvatar={selectedAvatar}
              css={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                margin: '16px',
              }}
            ></Avatar>
          ))}
        </Box>
        {/* Error Message */}
        <Box sx={{ mx: 3, mt: 2 }}>
          {avatarError !== '' && (
            <FormHelperText sx={{ color: '#d32f2f', mt: 2 }}>
              {avatarError}
            </FormHelperText>
          )}
        </Box>
        {/* Buttons */}
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
              label="Cancel"
              size={'medium'}
              onClick={() => setOpenAvatarDialog(false)}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
              }}
            />
            <ContainedButton
              name="Select"
              onClick={onClickSubmit}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
              }}
              size={'medium'}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
