import {
  Box,
  TextField,
  InputAdornment,
  Checkbox,
  Dialog,
  DialogTitle,
  Grid,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import * as React from 'react';
import * as Icons from 'heroicons-react';
import moment from 'moment';

import {
  BodyRegularTypography,
  ButtonLabelTypography,
  H5RegularTypography,
  H5SemiBoldTypography,
} from '../../CustomizedTypography';
import useTable from '../../CustomizedTable/useTable';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  approvedDeclinedEnterpriseRequestByIds,
  deleteManyUsers,
  getAllByEnterpriseId,
  updateEnterpriseRequest,
  updateRoleOnEnterpriseRequest,
  updateUser,
} from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import {
  BASIC,
  BASIC_USER_ID,
  ENTERPRISE,
  ENTERPRISE_USER_ID,
} from '../../../constants/applicationConst';
import { ContainedButton } from '../../CustomizedButton/ContainedButton';
import { OutlinedButton } from '../../CustomizedButton/OutlinedButton';
import OutlineButtonWithIconWithNoBorder from '../../CustomizedButton/OutlineButtonWithIconWithNoBorder';
import TeamSelector from '../TeamSelector';
import { gridQuickFilterValuesSelector } from '@mui/x-data-grid';

const headCells = [
  { id: 'check', label: '', disableSorting: true },
  { id: 'fromName', label: 'Name', disableSorting: false },
  {
    id: 'fromEmail',
    label: 'Email',
    disableSorting: false,
  },
  { id: 'fromTeams', label: 'Teams', disableSorting: true },
  { id: 'createdAt', label: 'Requested on', disableSorting: false },
  { id: 'actions', label: 'Actions', disableSorting: true },
];

export default function EnterpriseRequests() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [height, setHeight] = React.useState(0);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  const [selectedTeam, setSelectedTeam] = React.useState('all');
  const [isSelectAllChecked, setIsSelectAllChecked] = React.useState(false);
  const [tempStoreUserName, setTempStoreUserName] = React.useState<any>('');
  const [tempStoreUserEmail, setTempStoreUserEmail] = React.useState<any>('');
  const [tempEnterpriseRequestId, setTempEnterpriseRequestId] =
    React.useState<any>('');
  const [openDeclineRequestDialog, setOpenDeclineRequestDialog] =
    React.useState(false);
  const [openDeclineRequestsDialog, setOpenDeclineRequestsDialog] =
    React.useState(false);

  const [records, setRecords] = React.useState<any>([]);
  const [searchedVal, setSearchedVal] = React.useState('');
  const [filterFn, setFilterFn] = React.useState<any>({
    fn: (items: any) => {
      return items;
    },
  });

  React.useEffect(() => {
    setHeight(window.innerHeight);
    callGetAllEnterpriseRequestByEnterpriseId(
      tempLocalUserData && tempLocalUserData.enterpriseId
    );
  }, []);

  // Select All Check Box
  const handleSelectAllCheckbox = () => {
    setIsSelectAllChecked(!isSelectAllChecked);
    const newRecord = records.map((record: any) => {
      record.checked = !isSelectAllChecked;
      return record;
    });
    setRecords(newRecord);
  };

  // Teams Dropdown Selector
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedTeam(event.target.value as string);
  };

  const { TblContainer, TblHead, TblPagination, recordAfterPagingAndSorting } =
    useTable(
      records,
      headCells,
      filterFn,
      isSelectAllChecked,
      handleSelectAllCheckbox
    );

  // get All Enterprise request
  const callGetAllEnterpriseRequestByEnterpriseId = async (
    enterpriseId: any
  ) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await getAllByEnterpriseId(enterpriseId).then(
      res => {
        let tempRes = res.map((enterpriseRequest: any) => {
          return {
            id: enterpriseRequest.enterpriseRequest.enterpriseRequestId,
            organisationId: enterpriseRequest.enterpriseRequest.organisationId,
            fromName: enterpriseRequest.enterpriseRequest.fromName,
            fromEmail: enterpriseRequest.enterpriseRequest.fromEmail,
            fromTeams: enterpriseRequest.enterpriseRequest.teamInfo,
            createdAt: moment(
              enterpriseRequest.enterpriseRequest.createdAt
            ).format('Do MMM YYYY'),
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

  // handle search
  const handleSearch = (e: any) => {
    let target = e.target;
    setFilterFn({
      fn: (items: any) => {
        if (target.value === '') {
          return items;
        } else {
          let temp = items.filter((x: any) => {
            return x.fromName
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
    id: any
  ) => {
    const newRecord = records.map((record: any) => {
      if (record.id === id) {
        record.checked = !record.checked;
      }
      return record;
    });
    setRecords(newRecord);
  };

  // ---------------------------------------------- Request ----------------------------------------------

  // Approve User
  const handleApprovedUser = async (
    enterpriseRequestId: any,
    fromName: any,
    fromEmail: any
  ) => {
    setTempStoreUserName(fromName);
    setTempEnterpriseRequestId(enterpriseRequestId);
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      isApproved: true,
    };

    await updateEnterpriseRequest(enterpriseRequestId, requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        handleChangeUserRole(fromEmail, ENTERPRISE_USER_ID, ENTERPRISE);
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData && tempLocalUserData.enterpriseId
        );
      }
    );
  };

  //Change the user role once user request approved and decline
  const handleChangeUserRole = async (
    fromEmail: any,
    roleId: any,
    roleName: any
  ) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      roleId: roleId,
      roleName: roleName,
      isEnterpriserRequested: false,
    };

    await updateUser(fromEmail, requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData && tempLocalUserData.enterpriseId
        );
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData && tempLocalUserData.enterpriseId
        );
      }
    );
  };

  // Open Decline Enterprise Request Pop Up
  const openDeclinedRequestPopUp = (
    enterpriseRequestId: any,
    fromName: any,
    fromEmail: any
  ) => {
    setTempStoreUserName(fromName);
    setTempStoreUserEmail(fromEmail);
    setTempEnterpriseRequestId(enterpriseRequestId);
    setOpenDeclineRequestDialog(true);
  };

  // Close Decline Request Pop Up
  const closeDeclinedRequestPopUp = () => {
    setTempStoreUserName('');
    setTempEnterpriseRequestId('');
    setOpenDeclineRequestDialog(false);
  };

  // Decline Enterprise Request
  const handleDeclinedRequest = async () => {
    // call
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      isApproved: true,
    };

    await updateEnterpriseRequest(tempEnterpriseRequestId, requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        handleChangeUserRole(tempStoreUserEmail, BASIC_USER_ID, BASIC);
        closeDeclinedRequestPopUp();
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData && tempLocalUserData.enterpriseId
        );
        closeDeclinedRequestPopUp();
      }
    );
  };

  // ---------------------------------------------- All Requests ----------------------------------------------

  // Approved all selected enterprise requests
  const handleApproveAllSelected = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const selectedEnterpriseRequestIds = records
      .filter((record: any) => record.checked)
      .map((data: any) => data.id);

    const selectedEnterpriseRequestEmailIds = records
      .filter((record: any) => record.checked)
      .map((data: any) => data.fromEmail);

    const requestBody = {
      enterpriseRequestIds: selectedEnterpriseRequestIds,
    };

    
    await approvedDeclinedEnterpriseRequestByIds(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        // Update the users table for all the users
        handleChangeAllUsersRole(
          selectedEnterpriseRequestEmailIds,
          ENTERPRISE_USER_ID,
          ENTERPRISE
        );
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData.enterpriseId
        );
      }
    );
  };

  // Open all Decline Enterprise Request Pop Up
  const openDeclinedAllRequestsPopUp = () => {
    setOpenDeclineRequestsDialog(true);
  };

  // Close all Decline Request Pop Up
  const closeDeclinedAllRequestsPopUp = () => {
    setOpenDeclineRequestsDialog(false);
  };

  // Decline selected enterprise requests
  const handleDeclineSelectedUsers = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const selectedEnterpriseRequestIds = records
      .filter((record: any) => record.checked)
      .map((data: any) => data.id);

    const selectedEnterpriseRequestEmailIds = records
      .filter((record: any) => record.checked)
      .map((data: any) => data.fromEmail);

    const requestBody = {
      enterpriseRequestIds: selectedEnterpriseRequestIds,
    };

    await approvedDeclinedEnterpriseRequestByIds(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        // Update the users table for all the users
        handleChangeAllUsersRole(
          selectedEnterpriseRequestEmailIds,
          BASIC_USER_ID,
          BASIC
        );
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData.enterpriseId
        );
        closeDeclinedAllRequestsPopUp();
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData.enterpriseId
        );
        closeDeclinedAllRequestsPopUp();

      }
    );
  };

  //Change all users role once user request approved and decline
  const handleChangeAllUsersRole = async (
    fromEmails: any,
    roleId: any,
    roleName: any
  ) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      emailIds: fromEmails,
      roleId: roleId,
      roleName: roleName,
      isEnterpriserRequested: false,
    };

    await updateRoleOnEnterpriseRequest(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData && tempLocalUserData.enterpriseId
        );
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData && tempLocalUserData.enterpriseId
        );
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
              sx={{ background: 'white', width: '30%' }}
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
                label={'Approve selected'}
                iconPath="/svgs/Check.svg"
                onClick={handleApproveAllSelected}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#159ADD !important',
                  textColor: '#159ADD !important',
                  marginRight: '24px  !important',
                }}
              />
              <OutlineButtonWithIconWithNoBorder
                id={'delete_selected_users'}
                label={'Decline selected'}
                iconPath="/svgs/xmark.svg"
                onClick={openDeclinedAllRequestsPopUp}
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
                handleChange={handleChange}
              />
            </Box>
          </Box>
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordAfterPagingAndSorting().map((item: any) => {
                return (
                  <TableRow key={item?.id}>
                    <TableCell>
                      <Checkbox
                        checked={item?.checked}
                        onChange={e => handleChangeCheckbox(e, item.id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </TableCell>
                    <TableCell>{item?.fromName}</TableCell>
                    <TableCell>{item?.fromEmail}</TableCell>
                    <TableCell>
                      {item?.fromTeams.length === 0 ? (
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
                            {item.fromTeams.map((team: any, index: number) => {
                              return (
                                <>
                                  {team.teamName}
                                  {index < item.fromTeams.length - 1
                                    ? ', '
                                    : ''}
                                </>
                              );
                            })}
                          </Box>
                        </>
                      )}
                    </TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                      >
                        <Button
                          variant="contained"
                          sx={{
                            display: 'flex !important',
                            width: '142px !important',
                            height: '32px !important',
                            padding: '12px !important',
                            justifyContent: 'center !important',
                            alignItems: 'center !important',
                            gap: '8px !important',
                            flexShrink: 0,
                            borderRadius: ' 24px !important',
                            background: '#159ADD !important',
                          }}
                          onClick={() =>
                            handleApprovedUser(
                              item?.id,
                              item?.fromName,
                              item?.fromEmail
                            )
                          }
                        >
                          <Icons.CheckOutline
                            size={20}
                            style={{
                              color: '#FFFFFF',
                            }}
                          />
                          <ButtonLabelTypography
                            label="Approve"
                            style={{ color: '#FFFFFF' }}
                          />
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            display: 'flex !important',
                            width: '142px !important',
                            height: '32px !important',
                            padding: '12px !important',
                            justifyContent: 'center !important',
                            alignItems: 'center !important',
                            gap: '8px !important',
                            flexShrink: 0,
                            borderRadius: ' 24px !important',
                            border: ' 1px solid #EA4335 !important',
                            marginLeft: '8px !important',
                          }}
                          onClick={() =>
                            openDeclinedRequestPopUp(
                              item?.id,
                              item?.fromName,
                              item?.fromEmail
                            )
                          }
                        >
                          <Icons.XOutline
                            size={20}
                            style={{
                              color: '#EA4335',
                            }}
                          />
                          <ButtonLabelTypography
                            label="Decline"
                            style={{ color: '#EA4335' }}
                          />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </TblContainer>
          <TblPagination />
        </Box>
      </Box>
      {/* Decline Enterprise Request Pop Up */}
      <Dialog open={openDeclineRequestDialog}>
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
                  label={'Decline Request'}
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
                  onClick={closeDeclinedRequestPopUp}
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
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to delete user ${tempStoreUserName} request for Enterprise Dashboard?`}
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
              onClick={closeDeclinedRequestPopUp}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                marginRight: '20px !important',
              }}
            />
            <ContainedButton
              name="Yes"
              onClick={() => handleDeclinedRequest()}
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

      {/* Decline All Enterprise Requests Pop Up */}
      <Dialog open={openDeclineRequestsDialog}>
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
                  label={'Decline Requests'}
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
                  onClick={closeDeclinedAllRequestsPopUp}
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
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to delete all selected user’s request for Enterprise Dashboard?`}
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
              onClick={closeDeclinedAllRequestsPopUp}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                marginRight: '20px !important',
              }}
            />
            <ContainedButton
              name="Yes"
              onClick={() => handleDeclineSelectedUsers()}
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
