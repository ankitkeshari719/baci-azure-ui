import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import * as React from 'react';
import * as Icons from 'heroicons-react';
import moment from 'moment';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import useTable from '../../CustomizedTable/useTable';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import {
  deleteUserById,
  getAllUsersByEnterpriseId,
  updateUser,
} from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import {
  REGULAR_ENTERPRISE,
  REGULAR_ENTERPRISE_ID,
  REGULAR_USER,
  REGULAR_USER_ID,
} from '../../../constants/applicationConst';

const headCells = [
  { id: 'fullName', label: 'Name', disableSorting: false },
  {
    id: 'emailId',
    label: 'Email',
    disableSorting: false,
  },
  { id: 'teams', label: 'Team', disableSorting: true },
  { id: 'roleName', label: 'Role', disableSorting: true },
  { id: 'createdAt', label: 'Date Joined', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true },
];

export default function ManageUsers() {
  const [global, dispatch] = React.useContext(GlobalContext);

  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [role, setRole] = React.useState();
  const [records, setRecords] = React.useState([]);
  const [searchedVal, setSearchedVal] = React.useState('');
  const [filterFn, setFilterFn] = React.useState<any>({
    fn: (items: any) => {
      return items;
    },
  });
  const { TblContainer, TblHead, TblPagination, recordAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

  React.useEffect(() => {
    callGetAllUsersByEnterpriseId(tempLocalUserData.enterpriseId);
  }, []);

  // Get All Users
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
            teams: user.teams,
            roleName: user.roleName,
            createdAt: moment(user.createdAt).format('Do MMM YYYY'),
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
            return x.fullName
              .toLowerCase()
              .includes(target.value.toLowerCase());
          });
          return temp;
        }
      },
    });
  };

  // Delete User
  const handleDeleteUser = async (userId: any) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await deleteUserById(userId).then(
      res => {
        callGetAllUsersByEnterpriseId(tempLocalUserData.enterpriseId);
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

  const handleChangeUserRole = async (roleName: any, userId: any) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    let requestBody;
    if (roleName === REGULAR_USER) {
      requestBody = {
        roleId: REGULAR_ENTERPRISE_ID,
        roleName: REGULAR_ENTERPRISE,
      };
    } else {
      requestBody = {
        roleId: REGULAR_USER_ID,
        roleName: REGULAR_USER,
      };
    }

    await updateUser(userId, requestBody).then(
      res => {
        callGetAllUsersByEnterpriseId(tempLocalUserData.enterpriseId);
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
        {/*Titles */}
        <BodySemiBoldTypography label="Manage User" />
        <H2SemiBoldTypography
          label="Manage Users"
          style={{
            color: commonStyles.PrimaryDark,
            marginTop: '16px !important',
          }}
        />
        {/* Table and Search Box */}
        <Box
          sx={{
            width: '100%',
            background: 'rgb(249 251 252)',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '16px !important',
          }}
        >
          <TextField
            id="outlined-basic"
            label="Search..."
            variant="outlined"
            sx={{ background: 'white', width: '50%' }}
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
          <TblContainer>
            <TblHead />
            <TableBody>
              {recordAfterPagingAndSorting().map((item: any) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.fullName}</TableCell>
                    <TableCell>{item.emailId}</TableCell>
                    <TableCell>
                      {item.teams.length === 0 ? (
                        "Team's Not Found"
                      ) : (
                        <ol>
                          {item.teams.map((team: any) => {
                            return <li>{team.name}</li>;
                          })}
                        </ol>
                      )}
                    </TableCell>
                    <TableCell>
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                      >
                        <Select
                          id="role-selection"
                          value={item.roleName}
                          onClick={() =>
                            handleChangeUserRole(item.roleName, item.id)
                          }
                          sx={{
                            fieldset: {
                              border: 'none',
                              opacity: 1,
                              color: '#4E4E4E',
                            },
                          }}
                        >
                          <MenuItem value="Regular User">Basic</MenuItem>
                          <br />
                          <MenuItem value="Regular Enterprise">
                            Enterprise
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
                        onClick={() => handleDeleteUser(item.id)}
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
