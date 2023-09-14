import {
  Paper,
  Box,
  FormControl,
  TextField,
  FormHelperText,
} from '@mui/material';
import * as React from 'react';

import {
  BodySemiBoldTypography,
  ButtonLabelTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import {
  BASIC,
  ENTERPRISE_ADMIN,
  REGULAR_ENTERPRISE,
} from '../../../constants/applicationConst';
import { OutlinedButton } from '../../CustomizedButton/OutlinedButton';
import { createTeam } from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';

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

export default function CreateTeam() {
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  const [teamName, setTeamName] = React.useState('');
  const [teamDescription, setTeamDescription] = React.useState('');
  const [createdBy, setCreatedBy] = React.useState('');
  const [teamDepartment, setTeamDepartment] = React.useState('');
  const [userEmailIds, setUserEmailIds] = React.useState([
    'vishal.gawande@evoltech.com',
  ]);
  const [enterpriseId, setEnterpriseId] = React.useState('');
  const [codeTeamNameError, setTeamNameCodeError] = React.useState('');
  const [codeTeamDescriptionError, setTeamDescriptionError] =
    React.useState('');
  const [codeCreatedByError, setCreatedByCodeError] = React.useState('');
  const [codeTeamDepartmentError, setTeamDepartmentCodeError] =
    React.useState('');
  const [codeUserEmailIdsError, setUserEmailIdsCodeError] = React.useState('');

  React.useEffect(() => {
    setEnterpriseId(tempLocalUserData.enterpriseId);
  }, []);

  // Function to navigate on all team
  function goToAllTeam() {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/teams/allTeams/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      navigate('/enterprise/teams/allTeams/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === REGULAR_ENTERPRISE
    ) {
      navigate('/facilitator/teams/allTeams/');
    }
  }

  const submitTeam = () => {
    if (teamName === '') {
      setTeamNameCodeError('Please enter team Name');
    } else {
      setTeamNameCodeError('');
    }
    if (teamDepartment === '') {
      setTeamDepartmentCodeError('Please enter team department');
    } else {
      setTeamDepartmentCodeError('');
    }
    if (teamDescription === '') {
      setTeamDescriptionError('Please enter team description');
    } else {
      setTeamDescriptionError('');
    }
    if (createdBy === '') {
      setCreatedByCodeError('Please enter creator');
    } else {
      setCreatedByCodeError('');
    }
    if (userEmailIds.length === 0) {
      setUserEmailIdsCodeError('Please select at least one member');
    } else {
      setUserEmailIdsCodeError('');
    }

    if (
      teamName === '' ||
      teamDepartment === '' ||
      teamDescription === '' ||
      createdBy === '' ||
      userEmailIds.length === 0
    ) {
      return;
    }

    if (
      teamName != '' ||
      teamDepartment != '' ||
      teamDescription != '' ||
      createdBy != '' ||
      userEmailIds.length === 0
    ) {
      // Call API to Create team
      callCreateTeam();
    }
  };

  const callCreateTeam = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      teamName: teamName,
      teamDescription: teamDescription,
      teamDepartment: teamDepartment,
      enterpriseId: enterpriseId,
      createdBy: createdBy,
      userEmailIds: userEmailIds,
      isActive: true,
    };

    await createTeam(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
    );
  };

  return (
    <>
      <Paper
        sx={{
          width: '100%',
          background: 'rgb(249 251 252)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <Box
          sx={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}
        >
          <BodySemiBoldTypography
            label="My Teams "
            style={{
              color: '#00E',
              cursor: 'pointer',
              textDecorationLine: 'underline',
            }}
            onClick={goToAllTeam}
          />
          <BodySemiBoldTypography label="\ About Team" style={{}} />
        </Box>
        {/* Title with back button */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Icons.ArrowCircleLeftOutline
            size={20}
            style={{
              width: '24px',
              height: '24px',
              display: 'block',
              right: '0px',
              color: '#159ADD',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={goToAllTeam}
          />
          <H2SemiBoldTypography
            label="Create Team"
            style={{ color: commonStyles.PrimaryDark, marginLeft: '16px' }}
          />
        </Box>
        {/* Left Side Form */}
        <Box
          sx={{
            height: '100%',
            width: '50%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'column',
          }}
        >
          {/* Team Name */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: '24px',
            }}
          >
            {/* Team Name */}
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
                  label="Team Name"
                  autoFocus
                  variant="standard"
                  error={!!codeTeamNameError}
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={teamName}
                  onChange={e => {
                    setTeamName(e.currentTarget.value);
                    setTeamNameCodeError('');
                  }}
                />
              </Box>
              {/* Error message */}
              {codeTeamNameError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeTeamNameError}
                </FormHelperText>
              )}
            </FormControl>
            <OutlinedButton
              id={'save_team_info'}
              label="Save"
              onClick={() => submitTeam()}
              style={{
                minWidth: '172px !important',
                width: '172px !important',
                height: '40px !important',
                marginLeft: '20px',
              }}
              size={'small'}
            />
          </Box>
          {/* Team Description */}
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
            {/* Team Description */}
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
                  label="Team Description"
                  maxRows={8}
                  variant="standard"
                  error={!!codeTeamDescriptionError}
                  sx={{
                    width: '400px',
                    ...styles.messageTextField,
                  }}
                  value={teamDescription}
                  onChange={e => {
                    setTeamDescription(e.currentTarget.value);
                    setTeamDescriptionError('');
                  }}
                />
              </Box>
              {/* Error message */}
              {codeTeamDescriptionError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeTeamDescriptionError}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          {/* Created By  */}
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
            {/* Created BY */}
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
                  label="Created BY"
                  autoFocus
                  variant="standard"
                  error={!!codeCreatedByError}
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={createdBy}
                  onChange={e => {
                    setCreatedBy(e.currentTarget.value);
                    setCreatedByCodeError('');
                  }}
                />
              </Box>
              {/* Error message */}
              {codeCreatedByError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeCreatedByError}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          {/* Department */}
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
            {/* Department */}
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
                  label="Department"
                  variant="standard"
                  error={!!codeTeamDepartmentError}
                  sx={{
                    width: '400px',
                    ...styles.accessCodeTextField,
                  }}
                  value={teamDepartment}
                  onChange={e => {
                    setTeamDepartment(e.currentTarget.value);
                    setTeamDepartmentCodeError('');
                  }}
                />
              </Box>
              {/* Error message */}
              {codeTeamDepartmentError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeTeamDepartmentError}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
          {/* Session and Actions */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: '48px',
            }}
          >
            <ButtonLabelTypography label="No Of Sessions: -" />
            <ButtonLabelTypography label="No Of Actions: -" />
          </Box>
          {/* Analytics */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexDirection: 'row',
              marginTop: '48px',
            }}
          >
            <ButtonLabelTypography label="Analytics: -" />
          </Box>
        </Box>
      </Paper>
    </>
  );
}
