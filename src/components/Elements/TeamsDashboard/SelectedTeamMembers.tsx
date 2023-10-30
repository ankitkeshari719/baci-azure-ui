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
} from '@mui/material';
import * as React from 'react';
import * as Icons from 'heroicons-react';
import moment from 'moment';
import CsvDownloader from 'react-csv-downloader';

import {
  BodyRegularTypography,
  H5RegularTypography,
  H5SemiBoldTypography,
} from '../../CustomizedTypography';
import useTable from '../../CustomizedTable/useTable';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
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
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import { UserActionType, UserContext } from '../../../contexts/UserContext';

const headCells = [
  { id: 'check', label: '', disableSorting: true },
  { id: 'fullName', label: 'Name', disableSorting: false },
  {
    id: 'emailId',
    label: 'Email',
    disableSorting: false,
  },
  { id: 'roleName', label: 'Role', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true },
];

type Props = {
  checkedUserEmails: any;
  handleOpenAddMembersDialog: () => void;
  removeUser: (selectedUserId: any) => void;
  removeMultipleUser: (selectedUserIds: any) => void;
};

export default function SelectedTeamMembers({
  checkedUserEmails,
  handleOpenAddMembersDialog,
  removeUser,
  removeMultipleUser,
}: Props) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [gUser,userDispatch]= React.useContext(UserContext);
  const [height, setHeight] = React.useState(0);
  const [isSelectAllChecked, setIsSelectAllChecked] = React.useState(false);
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = React.useState(false);
  const [openUpdateRoleDialog, setUpdateRoleDialog] = React.useState(false);
  const [openRevokeRoleDialog, setRevokeRoleDialog] = React.useState(false);
  const [openRemoveMultipleUsersDialog, setOpenRemoveMultipleUsersDialog] =
    React.useState(false);
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

  React.useEffect(() => {
    callGetAllUsersByEnterpriseId(
      tempLocalUserData && tempLocalUserData.enterpriseId
    );
  }, [checkedUserEmails]);

  // Get All Users By Enterprise
  const callGetAllUsersByEnterpriseId = async (enterpriseId: any) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await getAllUsersByEnterpriseId(enterpriseId).then(
      res => {
        let tempRes = res
          .map((user: any) => {
            if (checkedUserEmails.includes(user.emailId)) {
              return {
                id: user.emailId,
                fullName: user.firstName + ' ' + user.lastName,
                emailId: user.emailId,
                teams: user.teamInfo,
                roleName: user.roleName,
                createdAt: moment(user.createdAt).format('Do MMM YYYY'),
                checked: false,
              };
            }
          })
          .filter((e: any) => e != null);
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

  // Select All Functionality
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

  //----------------------------------------- Remove Single user ---------------------------------------
  // Close Delete User Pop Up
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
    removeUser(tempStoreUserId);
    handleDeleteUserPopUpClose();
  };

  //----------------------------------------- Change User Role ---------------------------------------

  // Open Change User Role Pop up
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

  // Close Change User Role Pop up
  const handleChangeUserRolePopUpClose = () => {
    setTempStoreUserId('');
    setTempStoreRoleName('');
    setTempStoreUserName('');
    setUpdateRoleDialog(false);
    setRevokeRoleDialog(false);
  };

  // Change User Role
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
        dispatch({
          type: ActionType.SET_AZURE_USER,
          payload: { azureUser: res },
        });
        userDispatch({
          type: UserActionType.SET_AZURE_USER,
          payload: { azureUser: res },
        });
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

  //----------------------------------------- Remove multiple  ---------------------------------------

  // Open all Decline Enterprise Request Pop Up
  const openRemoveMultipleUsersPopUp = () => {
    setOpenRemoveMultipleUsersDialog(true);
  };

  // Close all Decline Request Pop Up
  const closeRemoveMultipleUsersPopUp = () => {
    setOpenRemoveMultipleUsersDialog(false);
  };
  // Delete Multiple Users
  const handleDeleteSelectedUsers = async () => {
    const selectedUsersIds = records
      .filter((record: any) => record.checked)
      .map((data: any) => data.id);
    removeMultipleUser(selectedUsersIds);
    closeRemoveMultipleUsersPopUp();
  };

  const columns = [
    {
      id: 'fullName',
      displayName: 'Name',
    },
    {
      id: 'emailId',
      displayName: 'Email',
    },
    {
      id: 'roleName',
      displayName: 'Role',
    },
  ];

  const getData = () => {
    return records;
  };

  return (
    <>
      <Box sx={{ marginTop: '24px', width: '100%' }}>
        {/* Table and Search Box For Manage users*/}
        <Box
          sx={{
            width: '100%',
            background: 'rgb(249 251 252)',
            display: 'flex',
            flexDirection: 'column',
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
            {/* Search Bar */}
            <TextField
              id="outlined-basic"
              label="Search..."
              variant="outlined"
              sx={{ background: 'white', width: '40%' }}
              onChange={(e: any) => {
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
            {/* Download CSV && Remove Selected button */}
            <Box display="flex" flexDirection="row" alignItems="center">
              <CsvDownloader
                filename="BACI Team Member List"
                extension=".csv"
                separator=";"
                wrapColumnChar=""
                columns={columns}
                datas={getData()}
                noHeader={false}
              >
                <OutlineButtonWithIconWithNoBorder
                  id={'download csv'}
                  label={'Download CSV'}
                  iconPath="/svgs/download.svg"
                  onClick={() => {
                    console.log('');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#159ADD !important',
                    textColor: '#159ADD !important',
                    marginRight: '24px  !important',
                  }}
                />
              </CsvDownloader>
              <OutlineButtonWithIconWithNoBorder
                id={'remove-selected-items'}
                label={'Remove Selected'}
                iconPath="/svgs/Delete.svg"
                onClick={openRemoveMultipleUsersPopUp}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#159ADD !important',
                  textColor: '#159ADD !important',
                  marginRight: '24px  !important',
                }}
              />
            </Box>
          </Box>
          {/* Table */}
          {records.length === 0 ? (
            <Box
              sx={{
                width: '100%',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <H5RegularTypography label="No Members Added" />
              <ContainedButtonWithIcon
                id={'create_new_Team'}
                label={'Add Member'}
                size={'small'}
                iconPath="/svgs/plusSmall.svg"
                style={{
                  width: '200px',
                  textAlign: 'center',
                  marginTop: '24px',
                }}
                onClick={() => handleOpenAddMembersDialog()}
              />
            </Box>
          ) : (
            <TblContainer>
              <TblHead />
              <TableBody>
                {recordAfterPagingAndSorting().map((item: any) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={item.checked}
                          onChange={(e: any) =>
                            handleChangeCheckbox(e, item.id)
                          }
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </TableCell>
                      <TableCell>{item.fullName}</TableCell>
                      <TableCell>{item.emailId}</TableCell>
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
              <TblPagination />
            </TblContainer>
          )}
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
                  label={'Remove User'}
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
            // width: '650px',
            // minWidth: '600px',
            height: height / 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px !important',
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to remove user ${tempStoreUserName} ?`}
            style={{ textAlign: 'center' }}
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
            // width: '650px',
            // minWidth: '600px',
            height: height / 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px !important',
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to update ${tempStoreUserName} role to Enterprise?`}
            style={{ textAlign: 'center' }}
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
            // width: '650px',
            // minWidth: '600px',
            height: height / 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px !important',
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to revoke ${tempStoreUserName} role to Basic?`}
            style={{ textAlign: 'center' }}
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
      {/* Decline All Enterprise Requests Pop Up */}
      <Dialog open={openRemoveMultipleUsersDialog}>
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
                  label={"Remove User's"}
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
                  onClick={closeRemoveMultipleUsersPopUp}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <Box
          sx={{
            height: height / 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to remove all selected user’s?`}
            style={{ textAlign: 'center' }}
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
              onClick={closeRemoveMultipleUsersPopUp}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                marginRight: '20px !important',
              }}
            />
            <ContainedButton
              name="Yes"
              onClick={() => handleDeleteSelectedUsers()}
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
    </>
  );
}
