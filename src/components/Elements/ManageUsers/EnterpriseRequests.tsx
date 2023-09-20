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
  getAllByEnterpriseId,
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
  { id: 'fromName', label: 'Name', disableSorting: false },
  {
    id: 'fromEmail',
    label: 'Email',
    disableSorting: false,
  },
  { id: 'fromTeams', label: 'Team', disableSorting: true },
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
  const [tempStoreRoleName, setTempStoreRoleName] = React.useState<any>('');
  const [tempStoreUserId, setTempStoreUserId] = React.useState<any>('');
  const [openDeleteUserDialog, setOpenDeleteUserDialog] = React.useState(false);

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
        let tempRes = res.map((user: any) => {
          return {
            id: user.enterpriseRequestId,
            organisationId: user.organisationId,
            fromName: user.fromName,
            fromEmail: user.fromEmail,
            fromTeams: user.fromTeams,
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

  // Open Delete User Pop Up
  const handleDeleteUserPopUpOpen = (userId: any, userName: any) => {
    setTempStoreUserId(userId);
    setTempStoreUserName(userName);
    setOpenDeleteUserDialog(true);
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
        callGetAllEnterpriseRequestByEnterpriseId(
          tempLocalUserData.enterpriseId
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
                handleChange={handleChange}
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
                    <TableCell>{item.fromName}</TableCell>
                    <TableCell>{item.fromEmail}</TableCell>
                    <TableCell>
                      {item.fromTeams.length === 0 ? (
                        "Team's Not Found"
                      ) : (
                        <>
                          <Box
                            sx={{
                              width: '100%',
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                            }}
                          >
                            {item.fromTeams.map((team: any) => {
                              return (
                                <Box
                                  key={team}
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
                                    label={team}
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
    </>
  );
}
