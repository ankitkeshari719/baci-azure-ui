import {
  Paper,
  Box,
  FormControl,
  TextField,
  FormHelperText,
  Dialog,
  DialogTitle,
  Grid,
  Checkbox,
} from '@mui/material';
import * as React from 'react';
import moment from 'moment';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import {
  ButtonLabelTypography,
  H2SemiBoldTypography,
  H5RegularTypography,
  BodySemiBoldTypography,
  H4SemiBoldTypography,
  CaptionSemiBoldTypography,
  CaptionRegularTypography,
  BodyRegularTypography,
} from '../../CustomizedTypography';
import { ContainedButton, OutlinedButton } from './../../../components';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import commonStyles from '../../../style.module.scss';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import {
  ADDED_IN_TEAM,
  BASIC,
  ENTERPRISE,
} from '../../../constants/applicationConst';
import {
  addEnterpriseRequestNotification,
  createTeam,
  getAllUsersByEnterpriseId,
  updateUsersTeamArray,
} from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import OutlineButtonWithIconWithNoBorder from '../../CustomizedButton/OutlineButtonWithIconWithNoBorder';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import useTable from '../../CustomizedTable/useTable';
import SelectedTeamMembers from './SelectedTeamMembers';

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

const headCells = [
  { id: 'check', label: '', disableSorting: true },
  { id: 'fullName', label: 'Name', disableSorting: true },
  { id: 'emailId', label: 'Email', disableSorting: true },
];

export default function CreateTeam() {
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [enterpriseId, setEnterpriseId] = React.useState('');

  const [teamName, setTeamName] = React.useState('');
  const [teamDepartment, setTeamDepartment] = React.useState('');
  const [teamDescription, setTeamDescription] = React.useState('');
  const [createdOn, setCreatedOn] = React.useState(
    moment(new Date()).format('Do MMM YYYY')
  );
  const [createdBy, setCreatedBy] = React.useState('');
  const [createdByAvatar, setCreatedByAvatar] = React.useState('');
  const [createdByEmailId, setCreatedByEmailId] = React.useState('');

  const [codeTeamNameError, setTeamNameCodeError] = React.useState('');
  const [codeTeamDescriptionError, setTeamDescriptionError] =
    React.useState('');
  const [codeCreatedByError, setCreatedByCodeError] = React.useState('');
  const [codeTeamDepartmentError, setTeamDepartmentCodeError] =
    React.useState('');

  // Add Members
  const [openAddMembersDialog, setOpenAddMembersDialog] = React.useState(false);
  const [height, setHeight] = React.useState(0);
  const [records, setRecords] = React.useState<any>([]);
  const [searchedVal, setSearchedVal] = React.useState('');
  const [filterFn, setFilterFn] = React.useState<any>({
    fn: (items: any) => {
      return items;
    },
  });

  // Show Members
  const [checkedUserEmails, setCheckedUserEmails] = React.useState([]);

  const { TblContainer, TblHead, TblPagination, recordAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  React.useEffect(() => {
    setEnterpriseId(tempLocalUserData.enterpriseId);
    setHeight(window.innerHeight);
    setCreatedBy(
      tempLocalUserData &&
        tempLocalUserData.firstName + ' ' + tempLocalUserData.lastName
    );
    setCreatedByAvatar(tempLocalUserData && tempLocalUserData.selectedAvatar);
    setCreatedByEmailId(tempLocalUserData && tempLocalUserData.emailId);

    callGetAllUsersByEnterpriseId(
      tempLocalUserData && tempLocalUserData.enterpriseId
    );
  }, []);

  // Get All Users By Enterprise
  const callGetAllUsersByEnterpriseId = async (enterpriseId: any) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await getAllUsersByEnterpriseId(enterpriseId).then(
      res => {
        let tempRes = res.map((user: any) => {
          return {
            id: user.emailId,
            fullName: user.firstName + ' ' + user.lastName,
            emailId: user.emailId,
            teams: user.teamInfo,
            roleName: user.roleName,
            createdAt: moment(user.createdAt).format('Do MMM YYYY'),
            checked: false,
          };
        });
        setRecords(tempRes);
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

  // Handle Search
  const handleSearch = (e: any) => {
    let target = e.target;
    setFilterFn({
      fn: (items: any) => {
        if (target.value === '') {
          return items;
        } else {
          let temp = items.filter((x: any) => {
            return x.fullName
              .toLowerCase()
              .includes(target.value.toLowerCase());
          });
          return temp;
        }
      },
    });
  };

  // Handle Checkbox
  const handleChangeCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>,
    userId: any
  ) => {
    const newRecord = records.map((record: any) => {
      if (record.emailId === userId) {
        record.checked = !record.checked;
      }
      return record;
    });
    setRecords(newRecord);
  };

  // Function to navigate on all team
  function goToAllTeam() {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      // navigate('/basic/teams/allTeams/');
      navigate(-1);
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      // navigate('/enterprise/teams/allTeams/');
      navigate(-1);
    }
  }

  // -------------------------------- Add Members Dialog ---------------------------------
  const handleOpenAddMembersDialog = () => {
    setOpenAddMembersDialog(true);
  };

  const handleCloseAddMembersDialog = () => {
    setOpenAddMembersDialog(false);
  };

  const addMembersFromDialog = () => {
    const checkRecords = records
      .filter((e: any) => e.checked)
      .map((r: any) => r.emailId);
    setCheckedUserEmails(checkRecords);
    handleCloseAddMembersDialog();
  };

  const unCheckRecord = (emailId: any) => {
    const newRecord = records.map((record: any) => {
      if (record.emailId === emailId) {
        record.checked = false;
      }
      return record;
    });
    setRecords(newRecord);
  };

  // -------------------------------- Remove user and users ---------------------------------
  const removeUser = (selectedUserId: any) => {
    const newRecord = records.map((record: any) => {
      if (record.emailId === selectedUserId) {
        record.checked = false;
      }
      return record;
    });
    setRecords(newRecord);
    const checkRecords = newRecord
      .filter((e: any) => e.checked)
      .map((r: any) => r.emailId);
    setCheckedUserEmails(checkRecords);
  };

  const removeMultipleUser = (selectedUserIds: any) => {
    const newRecord = records.map((record: any) => {
      if (selectedUserIds.includes(record.emailId)) {
        record.checked = false;
      }
      return record;
    });
    setRecords(newRecord);
    const checkRecords = newRecord
      .filter((e: any) => e.checked)
      .map((r: any) => r.emailId);
    setCheckedUserEmails(checkRecords);
  };

  // -------------------------------- Submit Form and Update table---------------------------------
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
    if (createdByEmailId === '') {
      setCreatedByCodeError('Please enter creator');
    } else {
      setCreatedByCodeError('');
    }

    if (
      teamName === '' ||
      teamDepartment === '' ||
      teamDescription === '' ||
      createdByEmailId === ''
    ) {
      return;
    }

    if (
      teamName != '' ||
      teamDepartment != '' ||
      teamDescription != '' ||
      createdByEmailId != ''
    ) {
      const rrr = records.filter((r: any) => r.checked);
      const userEmailIdsFromRecord = rrr.map((r: any) => {
        return r.emailId;
      });

      // Call API to Create team
      callCreateTeam(userEmailIdsFromRecord);
    }
  };

  const callCreateTeam = async (userEmailIdsFromRecord: any) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    let userEmailIds: any = [];
    if (userEmailIdsFromRecord.includes(createdByEmailId)) {
      userEmailIds = [...userEmailIdsFromRecord];
    } else {
      userEmailIds = [createdByEmailId, ...userEmailIdsFromRecord];
    }
    const requestBody = {
      teamName: teamName,
      teamDepartment: teamDepartment,
      teamDescription: teamDescription,
      enterpriseId: enterpriseId,
      userEmailIds: userEmailIds,
      createdBy: createdByEmailId,
      isActive: true,
    };
    await createTeam(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        updateUsersTeam(res, userEmailIds, createdBy);
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

  // Update users teams array after creating the team
  const updateUsersTeam = async (
    teamId: any,
    userEmailIdsFromRecord: any,
    createdBy: any
  ) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      teamId: teamId,
      userEmailIdsFromRecord: userEmailIdsFromRecord,
    };

    await updateUsersTeamArray(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        goToViewMode(teamId);
        callAddEnterpriseRequestNotification(
          ADDED_IN_TEAM,
          createdBy,
          userEmailIdsFromRecord
        );
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        goToViewMode(teamId);
      }
    );
  };

  function goToViewMode(teamId: any) {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate(`/basic/teams/edit/${teamId}`);
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      navigate(`/enterprise/teams/edit/${teamId}`);
    }
  }

  // Notification addition
  const callAddEnterpriseRequestNotification = async (
    type: string,
    fromId: any,
    toId: any
  ) => {
    // call
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      type: type,
      organisationId: tempLocalUserData && tempLocalUserData.enterpriseId,
      fromId: fromId,
      toId: toId,
      isRead: false,
    };

    await addEnterpriseRequestNotification(requestBody).then(
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
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            marginTop: '24px',
          }}
        >
          {/* Left Side Form */}
          <Box
            sx={{
              height: '100%',
              width: '40%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'column',
              paddingRight: '24px',
            }}
          >
            {/* Team Name && Save Button */}
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
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
                      onChange={(e: any) => {
                        setTeamName(e.currentTarget.value);
                        setTeamNameCodeError('');
                      }}
                    />
                  </Box>
                </Box>
                {/* Error message */}
                {codeTeamNameError !== '' && (
                  <FormHelperText style={{ color: '#d32f2f', width: '100%' }}>
                    {codeTeamNameError}
                  </FormHelperText>
                )}
              </FormControl>
              {/* Save Button*/}
              <OutlineButtonWithIconWithNoBorder
                id="save_team_info"
                label="save"
                iconPath="/svgs/saveTeam.svg"
                onClick={() => submitTeam()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textTransform: 'uppercase',
                }}
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CaptionRegularTypography
                      label="Team Description"
                      style={{ color: '#808080' }}
                    />
                    <TextField
                      multiline
                      rows={2}
                      maxRows={8}
                      placeholder="Enter Description"
                      variant="standard"
                      error={!!codeTeamDescriptionError}
                      sx={{
                        width: '400px',
                        ...styles.messageTextField,
                        background: '#ffffff',
                      }}
                      value={teamDescription}
                      onChange={(e: any) => {
                        setTeamDescription(e.currentTarget.value);
                        setTeamDescriptionError('');
                      }}
                    />
                  </Box>
                </Box>
                {/* Error message */}
                {codeTeamDescriptionError !== '' && (
                  <FormHelperText style={{ color: '#d32f2f', width: '100%' }}>
                    {codeTeamDescriptionError}
                  </FormHelperText>
                )}
              </FormControl>
            </Box>
            {/* Created On && Created By  */}
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
              {/* Created On */}
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ButtonLabelTypography
                      label="Created On"
                      style={{ color: '#000000', marginBottom: '8px' }}
                    />
                    <BodyRegularTypography
                      label={createdOn}
                      style={{ color: '#343434', marginTop: '16px' }}
                    />
                  </Box>
                </Box>
              </FormControl>
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ButtonLabelTypography
                      label="Created BY"
                      style={{ color: '#000000', marginBottom: '8px' }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {createdByAvatar != '' ? (
                        <LazyLoadImage
                          className="avatar"
                          style={{
                            height: '48px',
                            width: '48px',
                            borderRadius: '50%',
                            border: '5px solid #f9fbf8',
                            cursor: 'pointer',
                          }}
                          src={'/avatars/animals/' + createdByAvatar + '.svg'}
                        ></LazyLoadImage>
                      ) : (
                        <LazyLoadImage
                          width="48px !important"
                          height="48px !important"
                          style={{
                            borderRadius: '50%',
                            cursor: 'pointer',
                            border: 'none',
                          }}
                          src={'/svgs/DefaultUser.svg'}
                        ></LazyLoadImage>
                      )}
                      <BodyRegularTypography
                        label={createdBy}
                        style={{ color: '#343434' }}
                      />
                    </Box>
                  </Box>
                </Box>
                {/* Error message */}
                {codeCreatedByError !== '' && (
                  <FormHelperText style={{ color: '#d32f2f', width: '100%' }}>
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
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ButtonLabelTypography
                      label="Department"
                      style={{ color: '#000000', marginBottom: '8px' }}
                    />
                    <TextField
                      variant="standard"
                      error={!!codeTeamDepartmentError}
                      sx={{
                        width: '200px',
                        ...styles.accessCodeTextField,
                      }}
                      value={teamDepartment}
                      onChange={(e: any) => {
                        setTeamDepartment(e.currentTarget.value);
                        setTeamDepartmentCodeError('');
                      }}
                    />
                  </Box>
                </Box>
                {/* Error message */}
                {codeTeamDepartmentError !== '' && (
                  <FormHelperText style={{ color: '#d32f2f', width: '100%' }}>
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
          {/* Right Side Form */}
          <Paper
            sx={{
              height: '100%',
              width: '60%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              flexDirection: 'column',
              padding: '24px',
            }}
          >
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
              <H5RegularTypography label="Team Members" />
              <ContainedButtonWithIcon
                id={'create_new_Team'}
                label={'Add Member'}
                size={'small'}
                iconPath="/svgs/plusSmall.svg"
                style={{ width: '200px', textAlign: 'center' }}
                onClick={() => handleOpenAddMembersDialog()}
              />
            </Box>
            <SelectedTeamMembers
              checkedUserEmails={checkedUserEmails}
              handleOpenAddMembersDialog={handleOpenAddMembersDialog}
              removeUser={removeUser}
              removeMultipleUser={removeMultipleUser}
            />
          </Paper>
        </Box>
      </Paper>
      <Dialog
        open={openAddMembersDialog}
        sx={{
          height: height - 100,
          '& .MuiDialog-container': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          },
          '& .MuiDialog-paper ': {
            minWidth: '800px !important',
            padding: '16px !important',
          },
        }}
      >
        <DialogTitle style={{ padding: '0px' }}>
          <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item sm={6}>
              <Box display="flex" justifyContent="flex-start">
                <H4SemiBoldTypography
                  label={'Add Members'}
                  style={{
                    color: '#343434',
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
                  onClick={() => handleCloseAddMembersDialog()}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>

        {/* Selected User List */}
        <Box
          sx={{
            width: '600px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: '16px',
          }}
        >
          {records
            .filter((r: any) => r.checked)
            .map((record: any) => {
              return (
                <Box
                  key={record.emailId}
                  sx={{
                    width: '150px',
                    height: '32px',
                    minWidth: '150px',
                    minHeight: '32px',
                    border: '1px solid var(--Info, #4285F4)',
                    borderRadius: '4px',
                    background: '#d7e6ff',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: '4px',
                    padding: '4px',
                  }}
                >
                  <CaptionSemiBoldTypography
                    label={record.fullName}
                    style={{
                      color: '#4285F4 !important',
                      fontSize: '12px !important',
                    }}
                  />
                  <Icons.X
                    size={20}
                    style={{
                      cursor: 'pointer',
                      color: '#4285F4',
                    }}
                    onClick={() => unCheckRecord(record.emailId)}
                  />
                </Box>
              );
            })}
        </Box>
        {/* Search Bar */}
        <TextField
          id="outlined-basic"
          variant="standard"
          placeholder="Find a members"
          sx={{
            background: 'white',
            width: '100%',
            marginTop: '24px',
            ...styles.accessCodeTextField,
          }}
          onChange={(e: any) => {
            setSearchedVal(e.target.value);
            handleSearch(e);
          }}
          value={searchedVal}
        />
        {/* Users List */}
        <TblContainer>
          {/* <TblHead /> */}
          <TableBody>
            {recordAfterPagingAndSorting().map((item: any) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.fullName}</TableCell>
                  <TableCell>{item.emailId}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={item.checked}
                      onChange={(e: any) => handleChangeCheckbox(e, item.id)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TblContainer>
        {/* Buttons */}
        <Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flex: '1 0 auto',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              my: 2,
            }}
          >
            <OutlinedButton
              label="Close"
              size={'medium'}
              onClick={() => handleCloseAddMembersDialog()}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
              }}
            />
            <ContainedButton
              name="Add Member"
              onClick={addMembersFromDialog}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                marginLeft: '16px !important',
              }}
              size={'medium'}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
