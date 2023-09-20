import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  Typography,
  Dialog,
  DialogTitle,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import * as React from 'react';
import * as Icons from 'heroicons-react';
import moment from 'moment';

import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  CaptionSemiBoldTypography,
  H2SemiBoldTypography,
  H5RegularTypography,
  H5SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import useTable from '../../CustomizedTable/useTable';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  deleteManyUsers,
  deleteUserById,
  getAllUsersByEnterpriseId,
  updateUser,
} from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import {
  ENTERPRISE,
  ENTERPRISE_USER_ID,
  BASIC,
  BASIC_USER_ID,
} from '../../../constants/applicationConst';
import { ContainedButton } from '../../CustomizedButton/ContainedButton';
import { OutlinedButton } from '../../CustomizedButton/OutlinedButton';
import OutlineButtonWithIconWithNoBorder from '../../CustomizedButton/OutlineButtonWithIconWithNoBorder';
import TeamSelector from '../TeamSelector';

const headCells = [
  { id: 'check', label: '', disableSorting: true },
  { id: 'fullName', label: 'Name', disableSorting: false },
  {
    id: 'emailId',
    label: 'Email',
    disableSorting: false,
  },
  { id: 'teams', label: 'Teams', disableSorting: true },
  { id: 'roleName', label: 'Role', disableSorting: true },
  { id: 'createdAt', label: 'Date Joined', disableSorting: false },
  { id: 'actions', label: 'Actions', disableSorting: true },
];

export default function AllUsers() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [height, setHeight] = React.useState(0);
  const [isManageUserPage, setIsManageUserPage] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState('all');
  const [isSelectAllChecked, setIsSelectAllChecked] = React.useState(false);
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = React.useState(false);
  const [openUpdateRoleDialog, setUpdateRoleDialog] = React.useState(false);
  const [openRevokeRoleDialog, setRevokeRoleDialog] = React.useState(false);
  const [tempStoreUserId, setTempStoreUserId] = React.useState<any>('');
  const [tempStoreUserName, setTempStoreUserName] = React.useState<any>('');
  const [tempStoreRoleName, setTempStoreRoleName] = React.useState<any>('');
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [records, setRecords] = React.useState<any>([]);
  const [searchedVal, setSearchedVal] = React.useState('');
  const [filterFn, setFilterFn] = React.useState<any>({
    fn: (items: any) => {
      return items;
    },
  });

  React.useEffect(() => {
    setHeight(window.innerHeight);
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
        console.log('res =>>>>>>>>>>>>>>>>>>>>', res);
        let tempRes = res.map((user: any) => {
          return {
            id: user.user.emailId,
            fullName: user.user.firstName + ' ' + user.user.lastName,
            emailId: user.user.emailId,
            teams: user.user.teamInfo,
            roleName: user.user.roleName,
            createdAt: moment(user.user.createdAt).format('Do MMM YYYY'),
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

  const handleSelectAllCheckbox = () => {
    setIsSelectAllChecked(!isSelectAllChecked);
    const newRecord = records.map((record: any) => {
      record.checked = !isSelectAllChecked;
      return record;
    });
    setRecords(newRecord);
  };

  const { TblContainer, TblHead, TblPagination, recordAfterPagingAndSorting } =
    useTable(
      records,
      headCells,
      filterFn,
      isSelectAllChecked,
      handleSelectAllCheckbox
    );

  // Teams Selector
  const handleTeamChange = (event: SelectChangeEvent) => {
    setSelectedTeam(event.target.value as string);
    callGetAllUsersByEnterpriseIdAndTeamId(
      tempLocalUserData && tempLocalUserData.enterpriseId,
      event.target.value as string
    );
  };

  const callGetAllUsersByEnterpriseIdAndTeamId = async (
    enterpriseId: any,
    teamId: any
  ) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await getAllUsersByEnterpriseId(enterpriseId).then(
      res => {
        let tempRes = res.map((user: any) => {
          return {
            id: user.user.emailId,
            fullName: user.user.firstName + ' ' + user.user.lastName,
            emailId: user.user.emailId,
            teams: user.user.teamInfo,
            roleName: user.user.roleName,
            createdAt: moment(user.user.createdAt).format('Do MMM YYYY'),
            checked: false,
          };
        });

        let newRecord: any = [];
        for (let i = 0; i < tempRes.length; i++) {
          for (let j = 0; j < tempRes[i].teams.length; j++) {
            if (tempRes[i].teams[j].teamId === teamId) {
              newRecord.push(tempRes[i]);
              break;
            }
          }
        }
        if (teamId === 'all') {
          setRecords(tempRes);
        } else {
          setRecords(newRecord);
        }
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

  // Open Delete User Pop Up
  const handleDeleteUserPopUpOpen = (userId: any, userName: any) => {
    setTempStoreUserId(userId);
    setTempStoreUserName(userName);
    setOpenDeleteUserDialog(true);
  };

  // Open Delete User Pop Up
  const handleDeleteUserPopUpClose = () => {
    setOpenDeleteUserDialog(false);
    setTempStoreUserName('');
    setTempStoreUserId('');
  };

  // Delete User
  const handleDeleteUser = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      isActive: false,
    };

    await updateUser(tempStoreUserId, requestBody).then(
      res => {
        callGetAllUsersByEnterpriseId(tempLocalUserData.enterpriseId);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        handleDeleteUserPopUpClose();
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        handleDeleteUserPopUpClose();
        callGetAllUsersByEnterpriseId(tempLocalUserData.enterpriseId);
      }
    );
  };

  const handleChangeUserRolePopUpOpen = (
    roleName: any,
    userId: any,
    userName: any
  ) => {
    setTempStoreUserId(userId);
    setTempStoreRoleName(roleName);
    setTempStoreUserName(userName);
    if (roleName === BASIC) {
      setUpdateRoleDialog(true);
    } else {
      setRevokeRoleDialog(true);
    }
  };

  const handleChangeUserRolePopUpClose = () => {
    setTempStoreUserId('');
    setTempStoreRoleName('');
    setTempStoreUserName('');
    setUpdateRoleDialog(false);
    setRevokeRoleDialog(false);
  };

  const handleChangeUserRole = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    let requestBody;
    if (tempStoreRoleName === BASIC) {
      requestBody = {
        roleId: ENTERPRISE_USER_ID,
        roleName: ENTERPRISE,
      };
    } else {
      requestBody = {
        roleId: BASIC_USER_ID,
        roleName: BASIC,
      };
    }

    await updateUser(tempStoreUserId, requestBody).then(
      res => {
        callGetAllUsersByEnterpriseId(tempLocalUserData.enterpriseId);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        setUpdateRoleDialog(false);
        setRevokeRoleDialog(false);
        localStorage.setItem('userData', JSON.stringify(res));
      },
      err => {
        console.log('err', err);
        callGetAllUsersByEnterpriseId(tempLocalUserData.enterpriseId);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        setUpdateRoleDialog(false);
        setRevokeRoleDialog(false);
      }
    );
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

  const handleDeleteSelectedUsers = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    const selectedUsersId = records
      .filter((record: any) => record.checked)
      .map((data: any) => data.id);

    const requestBody = {
      emailIds: selectedUsersId,
    };

    await deleteManyUsers(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllUsersByEnterpriseId(tempLocalUserData.enterpriseId);
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllUsersByEnterpriseId(tempLocalUserData.enterpriseId);
      }
    );
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        {/* Table and Search Box For Manage users*/}
        <Box
          sx={{
            width: '100%',
            background: 'rgb(249 251 252)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <H5RegularTypography label="Requests for Enterprise Dashboard" />
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
            {/* Search Bar */}
            <TextField
              id="outlined-basic"
              label="Search..."
              variant="outlined"
              sx={{ background: 'white', width: '40%' }}
              onChange={e => {
                setSearchedVal(e.target.value);
                handleSearch(e);
              }}
              value={searchedVal}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon width="20px" />
                  </InputAdornment>
                ),
              }}
            />
            <Box display="flex" flexDirection="row" alignItems="center">
              <OutlineButtonWithIconWithNoBorder
                id={'delete_selected_users'}
                label={'Delete Users'}
                iconPath="/svgs/Delete.svg"
                onClick={handleDeleteSelectedUsers}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#159ADD !important',
                  textColor: '#159ADD !important',
                  marginRight: '24px  !important',
                }}
              />
              <TeamSelector
                enterpriseId={
                  tempLocalUserData && tempLocalUserData.enterpriseId
                }
                selectedTeam={selectedTeam}
                handleChange={handleTeamChange}
              />
            </Box>
          </Box>
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordAfterPagingAndSorting().map((item: any) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={item.checked}
                        onChange={e => handleChangeCheckbox(e, item.id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </TableCell>
                    <TableCell>{item.fullName}</TableCell>
                    <TableCell>{item.emailId}</TableCell>
                    <TableCell>
                      {item.teams.length === 0 ? (
                        "Team's Not Found"
                      ) : (
                        <>
                          <Box
                            sx={{
                              width: '100%',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(1, 1fr)',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            {item.teams.map((team: any) => {
                              return (
                                <Box
                                  key={team.teamId}
                                  sx={{
                                    width: '150px',
                                    height: '32px',
                                    minWidth: '150px',
                                    minHeight: '32px',
                                    borderRadius: '4px',
                                    background: '#63bcfd',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '4px',
                                  }}
                                >
                                  <CaptionSemiBoldTypography
                                    label={team.teamName}
                                    style={{
                                      color: '#ffffff !important',
                                    }}
                                  />
                                </Box>
                              );
                            })}
                          </Box>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                      >
                        <Select
                          fullWidth
                          id="role-selection"
                          value={item.roleName}
                          onClick={() =>
                            handleChangeUserRolePopUpOpen(
                              item.roleName,
                              item.id,
                              item.fullName
                            )
                          }
                          sx={{
                            fieldset: {
                              border: 'none',
                              opacity: 1,
                              color: '#4E4E4E',
                            },
                            '& .MuiSelect-select': {
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              padding: '16px',
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                bgcolor: '#ffffff',
                                '& .MuiMenuItem-root': {
                                  padding: 2,
                                },
                              },
                            },
                          }}
                        >
                          <MenuItem value={BASIC}>
                            <Typography
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '20px',
                                letterSpacing: '0.6px',
                                color: '#343434',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              Basic
                            </Typography>
                          </MenuItem>
                          <br />
                          <MenuItem value={ENTERPRISE}>
                            <Typography
                              style={{
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '20px',
                                letterSpacing: '0.6px',
                                color: '#343434',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              Enterprise
                            </Typography>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>
                      <Icons.TrashOutline
                        size={20}
                        style={{
                          cursor: 'pointer',
                          color: '#4E4E4E',
                        }}
                        onClick={() =>
                          handleDeleteUserPopUpOpen(item.id, item.fullName)
                        }
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Box>
      </Box>
      {/* Delete User Pop Up */}
      <Dialog open={openDeleteUserDialog}>
        <DialogTitle
          style={{ padding: '20px', borderBottom: '1px solid #EA4335' }}
        >
          <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item sm={6}>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Icons.ExclamationCircleOutline
                  size={32}
                  style={{
                    color: '#EA4335',
                    fontSize: '32px',
                  }}
                />
                <H5SemiBoldTypography
                  label={'Delete User'}
                  style={{
                    color: '#343434',
                    marginLeft: '12px !important',
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
                  onClick={handleDeleteUserPopUpClose}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <Box
          sx={{
            width: '650px',
            minWidth: '600px',
            height: height / 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to delete user ${tempStoreUserName} ?`}
          />
        </Box>
        {/* Buttons */}
        <Box sx={{ mx: 3 }}>
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
              label="Cancel"
              size={'medium'}
              onClick={handleDeleteUserPopUpClose}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                marginRight: '20px !important',
              }}
            />
            <ContainedButton
              name="Yes"
              onClick={() => handleDeleteUser()}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                background: '#EA4335 !important',
              }}
              size={'medium'}
            />
          </Box>
        </Box>
      </Dialog>
      {/* Update User Role Pop Up */}
      <Dialog open={openUpdateRoleDialog}>
        <DialogTitle
          style={{ padding: '20px', borderBottom: '1px solid #4285F4' }}
        >
          <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item sm={6}>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Icons.ExclamationCircleOutline
                  size={32}
                  style={{
                    color: '#4285F4',
                    fontSize: '32px',
                  }}
                />
                <H5SemiBoldTypography
                  label={'Update Role'}
                  style={{
                    color: '#343434',
                    marginLeft: '12px !important',
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
                  onClick={handleChangeUserRolePopUpClose}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <Box
          sx={{
            width: '600px',
            minWidth: '600px',
            height: height / 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to update ${tempStoreUserName} role to Enterprise?`}
          />
        </Box>
        {/* Buttons */}
        <Box sx={{ mx: 3 }}>
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
              label="Cancel"
              size={'medium'}
              onClick={handleChangeUserRolePopUpClose}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                marginRight: '20px !important',
              }}
            />
            <ContainedButton
              name="Yes"
              onClick={handleChangeUserRole}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                background: '#159ADD !important',
              }}
              size={'medium'}
            />
          </Box>
        </Box>
      </Dialog>
      {/* Revoke User Role Pop Up */}
      <Dialog open={openRevokeRoleDialog}>
        <DialogTitle
          style={{ padding: '20px', borderBottom: '1px solid #4285F4' }}
        >
          <Grid container sx={{ display: 'flex', alignItems: 'center' }}>
            <Grid item sm={6}>
              <Box
                display="flex"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Icons.ShieldExclamationOutline
                  size={32}
                  style={{
                    color: '#FBBC05',
                    fontSize: '32px',
                  }}
                />
                <H5SemiBoldTypography
                  label={'Revoke Role'}
                  style={{
                    color: '#343434',
                    marginLeft: '12px !important',
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
                  onClick={handleChangeUserRolePopUpClose}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <Box
          sx={{
            width: '600px',
            minWidth: '600px',
            height: height / 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to revoke ${tempStoreUserName} role to Basic?`}
          />
        </Box>
        {/* Buttons */}
        <Box sx={{ mx: 3 }}>
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
              label="Cancel"
              size={'medium'}
              onClick={handleChangeUserRolePopUpClose}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                marginRight: '20px !important',
              }}
            />
            <ContainedButton
              name="Yes"
              onClick={handleChangeUserRole}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                background: '#159ADD !important',
              }}
              size={'medium'}
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
