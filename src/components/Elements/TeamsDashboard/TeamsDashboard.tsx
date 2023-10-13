import {
  Box,
  TextField,
  InputAdornment,
  Checkbox,
  Dialog,
  DialogTitle,
  Grid,
} from '@mui/material';
import * as React from 'react';

import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  H2SemiBoldTypography,
  H5SemiBoldTypography,
  TinyTextTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import useTable from '../../CustomizedTable/useTable';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import * as Icons from 'heroicons-react';
import { ENTERPRISE, BASIC } from '../../../constants/applicationConst';
import { useNavigate } from 'react-router-dom';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Avatar from '../Avatar';
import {
  getTeamDataForTable,
  updateTeam,
} from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import { ContainedButton } from '../../CustomizedButton/ContainedButton';
import { OutlinedButton } from '../../CustomizedButton/OutlinedButton';

const headCells = [
  { id: 'teamName', label: 'Team', disableSorting: false },
  { id: 'createdBy', label: 'Creator', disableSorting: false },
  { id: 'users', label: 'Members', disableSorting: true },
  { id: 'department', label: 'Department', disableSorting: true },
  { id: 'retroCount', label: 'Sessions', disableSorting: false },
  { id: 'actionsCount', label: 'Actions', disableSorting: false },
  { id: 'createdAt', label: 'Created on', disableSorting: false },
  { id: 'actions', label: 'Actions', disableSorting: true },
];

export default function TeamsDashboard() {
  const navigate = useNavigate();
  const [height, setHeight] = React.useState(0);
  const [global, dispatch] = React.useContext(GlobalContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [openDeleteTeamDialog, setOpenDeleteTeamDialog] = React.useState(false);
  const [isSelectAllChecked, setIsSelectAllChecked] = React.useState(false);
  const [tempStoreTeamId, setTempStoreTeamId] = React.useState<any>('');
  const [tempStoreTeamName, setTempStoreTeamName] = React.useState<any>('');
  const [records, setRecords] = React.useState<any>([]);
  const [searchedVal, setSearchedVal] = React.useState('');
  const [filterFn, setFilterFn] = React.useState<any>({
    fn: (items: any) => {
      return items;
    },
  });

  // Select All
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

  // API will hit here to get the Teams list
  React.useEffect(() => {
    setHeight(window.innerHeight);
    callGetTeamDataForTable();
  }, []);

  // Function to get all teams data
  const callGetTeamDataForTable = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      userId: tempLocalUserData && tempLocalUserData.userId,
      roleName: tempLocalUserData && tempLocalUserData.roleName,
      enterpriseId: tempLocalUserData && tempLocalUserData.enterpriseId,
    };

    await getTeamDataForTable(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        const teamRecord = res.map((team: any) => {
          return {
            id: team.teamId,
            teamName: team.teamName,
            createdBy: team.createdBy,
            createdByObj: team && team.createdByObj && team.createdByObj[0],
            users: team.users,
            department: team.teamDepartment,
            retroCount: team.retroCount,
            actionsCount: team.actionsCount,
            createdAt: team.createdAt,
            checked: false,
          };
        });
        setRecords(teamRecord);
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        console.log('err', err);
        setRecords([]);
      }
    );
  };

  // Function to navigate on create new team page
  function createNewTeam() {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/teams/create/');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      navigate('/enterprise/teams/create/');
    }
  }

  // Function to navigate on create new team page
  function editTeam(teamId: any) {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate(`/basic/teams/edit/${teamId}`);
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      navigate(`/enterprise/teams/edit/${teamId}`);
    }
  }

  const handleSearch = (e: any) => {
    let target = e.target;
    setFilterFn({
      fn: (items: any) => {
        if (target.value === '') {
          return items;
        } else {
          let temp = items.filter((x: any) => {
            return x.teamName
              .toLowerCase()
              .includes(target.value.toLowerCase());
          });
          return temp;
        }
      },
    });
  };

  // Open Delete Team Pop Up
  const handleDeleteTeamPopUpOpen = (teamId: any, teamName: any) => {
    setTempStoreTeamId(teamId);
    setTempStoreTeamName(teamName);
    setOpenDeleteTeamDialog(true);
  };

  // Open Delete Team Pop Up
  const handleDeleteTeamPopUpClose = () => {
    setOpenDeleteTeamDialog(false);
    setTempStoreTeamId('');
    setTempStoreTeamName('');
  };

  // Delete Team
  const handleDeleteTeam = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    const requestBody = {
      isActive: false,
    };
    await updateTeam(tempStoreTeamId, requestBody).then(
      res => {
        callGetTeamDataForTable();
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        handleDeleteTeamPopUpClose();
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        handleDeleteTeamPopUpClose();
      }
    );
  };

  // Handle Checkbox
  const handleChangeCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>,
    teamId: any
  ) => {
    const newRecord = records.map((record: any) => {
      if (record.id === teamId) {
        record.checked = !record.checked;
      }
      return record;
    });
    setRecords(newRecord);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 'calc(var(--app-height))',
          background: '#F9FBFC',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <BodySemiBoldTypography label="Teams" />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: '100%',
            marginTop: '16px',
          }}
        >
          <H2SemiBoldTypography
            label="My Teams"
            style={{ color: commonStyles.PrimaryDark }}
          />
          <ContainedButtonWithIcon
            id={'create_new_Team'}
            label={'New Team'}
            size={'medium'}
            iconPath="/svgs/plusSmall.svg"
            style={{ width: '200px', textAlign: 'center' }}
            onClick={() => createNewTeam()}
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            background: 'rgb(249 251 252)',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '16px',
          }}
        >
          {/* Search Field */}
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
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordAfterPagingAndSorting().map((item: any) => {
                return (
                  <TableRow key={item?.id}>
                    <TableCell>{item?.teamName}</TableCell>
                    <TableCell>
                      {item.createdByObj === undefined ? (
                        <>
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
                          {' ' + ' '}
                        </>
                      ) : (
                        <>
                          {item.createdByObj?.selectedAvatar != '' ? (
                            <LazyLoadImage
                              className="avatar"
                              style={{
                                height: '48px',
                                width: '48px',
                                borderRadius: '50%',
                                border: '5px solid #f9fbf8',
                                cursor: 'pointer',
                              }}
                              src={
                                '/avatars/animals/' +
                                item.createdByObj?.selectedAvatar +
                                '.svg'
                              }
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
                          {' ' +
                            item.createdByObj?.firstName +
                            ' ' +
                            item.createdByObj?.lastName}
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {item?.users.length < 5 ? (
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {item?.users?.map(
                            (user: any, index: any) =>
                              index < 4 && (
                                <>
                                  {user?.selectedAvatar === undefined ? (
                                    <LazyLoadImage
                                      width="48px !important"
                                      height="48px !important"
                                      style={{
                                        borderRadius: '50%',
                                        border: 'none',
                                      }}
                                      src={'/svgs/DefaultUser.svg'}
                                    ></LazyLoadImage>
                                  ) : (
                                    <>
                                      {user?.selectedAvatar != '' ? (
                                        <LazyLoadImage
                                          className="avatar"
                                          style={{
                                            height: '48px',
                                            width: '48px',
                                            borderRadius: '50%',
                                          }}
                                          src={
                                            '/avatars/animals/' +
                                            user?.selectedAvatar +
                                            '.svg'
                                          }
                                        ></LazyLoadImage>
                                      ) : (
                                        <LazyLoadImage
                                          width="48px !important"
                                          height="48px !important"
                                          style={{
                                            borderRadius: '50%',
                                            border: 'none',
                                          }}
                                          src={'/svgs/DefaultUser.svg'}
                                        ></LazyLoadImage>
                                      )}
                                    </>
                                  )}
                                </>
                              )
                          )}
                        </Box>
                      ) : (
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="center"
                        >
                          {item.users?.map(
                            (user: any, index: any) =>
                              index < 4 && (
                                <Avatar
                                  key={index}
                                  avatar={user.selectedAvatar}
                                  css={{
                                    width: '40px',
                                    height: '40px',
                                    marginLeft: '0',
                                    marginRight: '-16px',
                                    border: '3px solid transparent',
                                  }}
                                />
                              )
                          )}
                          <TinyTextTypography
                            label={'+' + (item.users?.length - 4).toString()}
                            style={{
                              marginLeft: '20px !important',
                              color: '#808080',
                            }}
                          />
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>{item?.department}</TableCell>
                    <TableCell>{item?.retroCount}</TableCell>
                    <TableCell>{item?.actionsCount}</TableCell>
                    <TableCell>
                      {moment(item?.createdAt).format('Do MMM YYYY')}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                        }}
                      >
                        <Icons.PencilAltOutline
                          size={20}
                          style={{
                            cursor: 'pointer',
                            color: '#4E4E4E',
                          }}
                          onClick={() => editTeam(item?.id)}
                        />
                        <Icons.TrashOutline
                          size={20}
                          style={{
                            cursor: 'pointer',
                            color: '#4E4E4E',
                          }}
                          onClick={() =>
                            handleDeleteTeamPopUpOpen(item?.id, item.teamName)
                          }
                        />
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
      {/* Delete Team Pop Up */}
      <Dialog open={openDeleteTeamDialog}>
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
                  label={'Delete Team'}
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
                  onClick={handleDeleteTeamPopUpClose}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <Box
          sx={{
            // width: '600px',
            // minWidth: '600px',
            height: height / 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px !important',
          }}
        >
          <BodyRegularTypography
            label={`Are you sure you want to delete team ${tempStoreTeamName}?`}
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
              onClick={handleDeleteTeamPopUpClose}
              style={{
                minWidth: '75px !important',
                height: '36px !important',
                marginRight: '20px !important',
              }}
            />
            <ContainedButton
              name="Yes"
              onClick={() => handleDeleteTeam()}
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
