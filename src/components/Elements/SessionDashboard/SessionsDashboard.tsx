import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import {
  Box,
  Checkbox,
  InputAdornment,
  TextField,
  TableSortLabel,
  Button,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';

import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  H1SemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';

import {
  PlusIcon,
  EllipsisVerticalIcon,
  FunnelIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import {
  chartInputType,
  formatDateForAPI,
  getSessionsDataForTable,
} from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';

import DateSelector from '../EnterpriseDashboardPages/DateSelector';
import TeamSelector from '../TeamSelector';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import { UserActionType, UserContext } from '../../../contexts/UserContext';

interface Column {
  id:
    | 'name'
    | 'humanId'
    | 'joinUrl'
    | 'timestamp'
    | 'creatorId'
    | 'teamName'
    | 'retroStatus'
    | 'teamDepartment'
    | 'teamId'
    |'selectedFacilitator';
  label: string;
  minWidth?: number;
  align?: 'right';
  displayName?: string;
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: 'name',
    label: 'Session Name',
    minWidth: 200,
    displayName: 'Session Name',
  },
  {
    id: 'humanId',
    label: 'Session ID',
    minWidth: 200,
    displayName: "Session ID'",
  },

  {
    id: 'teamName',
    label: 'Team',
    //  type:Date(),
    minWidth: 90,
    displayName: 'Team',
  },
  { id: 'joinUrl', label: 'Link', minWidth: 300, displayName: 'Link' },
  {
    id: 'timestamp',
    label: 'Date',

    minWidth: 250,
    displayName: 'Date',
  },
  {
    id: 'retroStatus',
    label: 'Action',
    minWidth: 90,
    displayName: 'Action',
  },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function SessionDashboard() {
  const [displayJiraRows, setDisplayJiraRows] = React.useState<any>([]);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [gUser, userDispatch] = React.useContext(UserContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchedVal, setSearchedVal] = React.useState('');
  const [selectId, setSelectedId] = React.useState<string>('0');
  const [fromDate, setFromDate] = React.useState<string>(
    gUser.chartStartDate
      ? gUser.chartStartDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          new Date().getMonth().toString().slice(-2)
  );
  const [toDate, setToDate] = React.useState<string>(
    gUser.chartEndDate
      ? gUser.chartEndDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          (new Date().getMonth() + 1).toString().slice(-2)
  );

  const [loading, setLoading] = React.useState<boolean>(false);
  const [codeError, setCodeError] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    getSessionForTable();
  }, []);

  React.useEffect(() => {
    getSessionForTable();
  }, [fromDate, toDate, selectId]);

  const getSessionForTable = async () => {
    setLoading(true);
    if (gUser.azureUser != undefined) {
      const chartInput: chartInputType = {
        userId: gUser.azureUser?.emailId,
        roleName: gUser.azureUser?.roleName,
        enterpriseId: gUser.azureUser?.enterpriseId,
        teamId: gUser.teamId ? gUser.teamId : '0',
        fromDate: formatDateForAPI(fromDate),
        toDate: formatDateForAPI(toDate, true),
      };

      setLoading(true);
      await getSessionsDataForTable(chartInput).then(
        res => {
          console.log(res.data,"data")
          if (res.data.length > 0) {
            let actionsArray: any[] = [];
            res.data.forEach((action: any) => {
              var actionObj = action;

              actionObj.timestamp = new Date(action.timestamp)
                .toLocaleString()
                .split(',')[0];
              actionsArray.push(actionObj);
            });

            setDisplayJiraRows([...actionsArray]);
          } else setDisplayJiraRows([]);
          setLoading(false);
        },
        error => {
          setLoading(false);
        }
      );
    }
  };

  const handleFromDate = (event: any) => {
    setFromDate(event as string);
    dispatch({
      type: ActionType.CHART_START_DATE,
      payload: { startDate: event },
    });
    userDispatch({
      type: UserActionType.CHART_START_DATE,
      payload: { startDate: event },
    });
  };

  const handleToDate = (event: any) => {
    setToDate(event as string);
    dispatch({
      type: ActionType.CHART_END_DATE,
      payload: { endDate: event },
    });

    userDispatch({
      type: UserActionType.CHART_END_DATE,
      payload: { endDate: event },
    });
  };
  const flattenObject = (ob: any) => {
    const toReturn: any = {};

    Object.keys(ob).map(i => {
      if (typeof ob[i] === 'object' && ob[i] !== null) {
        const flatObject = flattenObject(ob[i]);
        Object.keys(flatObject).map((x: any) => {
          toReturn[`${i}.${x}`] = flatObject[x];
          return x;
        });
      } else {
        toReturn[i] = ob[i];
      }
      return i;
    });
    return toReturn;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const searchFunction = (row1: any) => {
    const columns = [
      'name',
      // 'humanId',
      // 'joinUrl',
      // 'timestamp',
      'teamName',
      // 'retroStatus',
      // 'teamDepartment',
      // 'teamId',
    ];
    var fullRow = '';
    columns.forEach((column, index) => {
      if (index == 0) fullRow = fullRow + row1[column];
      else fullRow = fullRow + ' ' + row1[column];
    });

    return (
      !searchedVal.length ||
      fullRow
        .toString()
        .toLowerCase()
        .includes(searchedVal.toString().toLowerCase())
    );
  };

  //Table

  const [orderDirection, setOrderDirection] = React.useState('asc');

  const sortArray = (arr: any, orderBy: any, idInput: string) => {
    var id = idInput;
    // if (id == 'action.assigneeId') {
    //   id = 'action.assigneeName';
    // }
    switch (orderBy) {
      case 'asc':
      default:
        return arr.sort((a: any, b: any) => a[id].localeCompare(b[id]));
      case 'desc':
        return arr.sort((a: any, b: any) => b[id].localeCompare(a[id]));
    }
  };

  const handleSortRequest = (id: string, jira: any) => {
    setDisplayJiraRows(sortArray(jira, orderDirection, id));
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };
  function CreateNewRetro() {
    dispatch({
      type: ActionType.SET_RETRO_CREATE,
      payload: { retroCreateState: true },
    });
    setCodeError('');
    if (location.pathname.includes('basic')) {
      navigate('/basic/create');
    } else if (location.pathname.includes('enterprise'))
      navigate('/enterprise/sessions/create');
;
  }

  return (
    <>
      <Paper
        sx={{
          width: '100%',
          background: 'rgb(249 251 252)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <BodySemiBoldTypography
          label="Sessions"
          style={{ marginBottom: '10px' }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <H2SemiBoldTypography
            label="My Sessions"
            style={{ color: commonStyles.PrimaryDark, marginBottom: '15px' }}
          />

          <Button
            variant="contained"
            sx={{
              borderRadius: '24px',
              fontSize: '16px',
              fontWeight: '500!important',
              paddingTop: '0px!important',
              paddingBottom: '0px!important',
              height: '34px!important',
            }}
            onClick={() => {
              if (location.pathname.includes('basic')) {
                navigate('/basic/create');
              } else if (location.pathname.includes('enterprise'))
                navigate('/enterprise/sessions/create');
            }}
          >
            <PlusIcon width={'24px'} style={{ marginRight: '15px' }} />
            NEW SESSION
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <TextField
            id="outlined-basic"
            label="Search..."
            variant="outlined"
            sx={{ marginBottom: '10px', background: 'white', width: '450px' }}
            onChange={(e: any) => setSearchedVal(e.target.value)}
            value={searchedVal}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon width="20px" />
                </InputAdornment>
              ),
            }}
          />

          {/* <FunnelIcon width="32px" style={{ cursor: 'pointer' }} /> */}
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <DateSelector
              handleFromDate={handleFromDate}
              handleToDate={handleToDate}
              fromDate={fromDate}
              toDate={toDate}
              disable={true}
            />
            <TeamSelector
              enterpriseId={
                gUser.azureUser?.enterpriseId
                  ? gUser.azureUser?.enterpriseId
                  : '0'
              }
              padding="9px"
              selectedTeam={gUser.teamId ? gUser.teamId : selectId}
              handleChange={(change: any) => {
                dispatch({
                  type: ActionType.SET_TEAM_ID,
                  payload: { teamId: change.target.value },
                });
                userDispatch({
                  type: UserActionType.SET_TEAM_ID,
                  payload: { teamId: change.target.value },
                });

                setSelectedId(change.target.value);
              }}
              showAllTeamOption={true}
            />
          </Box>
        </Box>
        {displayJiraRows.length > 0 ? (
          <>
            <TableContainer sx={{ height: 'calc(100% - 280px)' }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ borderBottom: '2px solid gray' }}
                        onClick={() =>
                          column.id != 'teamId' &&
                          handleSortRequest(column.id, displayJiraRows)
                        }
                      >
                        {column.id == 'teamId' ? (
                          <>
                            <BodySemiBoldTypography label={column.label} />
                          </>
                        ) : (
                          <TableSortLabel
                            active={column.id == 'name' ? true : false}
                            direction={
                              orderDirection === 'asc' ? 'asc' : 'desc'
                            }
                          >
                            <BodySemiBoldTypography label={column.label} />
                          </TableSortLabel>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayJiraRows
                    .filter((row1: any) =>
                      // note that I've incorporated the searchedVal length check here
                      searchFunction(row1)
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, index: number) => {
                      return (
                        <StyledTableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >
                          {columns.map(column => {
                            const value = row[column.id];

                            if (column.id == 'joinUrl') {
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  sx={{ maxWidth: '250px' }}
                                >
                                  <Box
                                    display={{
                                      alignItems: 'center',
                                      display: 'flex',
                                      flexDirection: 'row',
                                    }}
                                  >
                                    <Box component={'span'} style={{wordWrap:"break-word"}}>{value}</Box>
                                    <DocumentDuplicateIcon
                                      cursor="pointer"
                                      onClick={() => {
                                        navigator.clipboard.writeText(value);

                                        dispatch({
                                          type: ActionType.SET_SNACK_MESSAGE,
                                          payload: {
                                            snackMessage: {
                                              message: 'Retro URL Copied',
                                              snackMessageType: 'success',
                                            },
                                          },
                                        });

                                        // alert(value);
                                      }}
                                      width="16px"
                                      style={{ marginLeft: '12px' }}
                                    />
                                  </Box>
                                </TableCell>
                              );
                            } else if (column.id == 'retroStatus') {
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  sx={{ maxWidth: '250px' }}
                                >
                                  {value == 'waiting' ? (
                                    <Button
                                      variant="contained"
                                      sx={{ borderRadius: '24px' }}
                                      onClick={()=>
                                        
                                        {
                                          if (location.pathname.includes('basic')) {
                                            navigate('/basic/session/join/'+row['humanId']);
                                          } else if (location.pathname.includes('enterprise'))
                                            navigate('/enterprise/sessions/join/'+row['humanId']);
                                        }
                                        // navigate('/enterprise/sessions/join/'+row['humanId'])
                                      }
                                      disabled={row['selectedFacilitator']!==gUser.azureUser?.emailId&&row['creatorId']!==gUser.azureUser?.emailId}
                                    >
                                      START SESSION
                                    </Button>
                                  ) : value == 'ended' ? (
                                    <Button>VIEW SUMMARY</Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      sx={{ borderRadius: '24px' }}
                                      onClick={()=>{
                                        
                                        
                                        if (location.pathname.includes('basic')) {
                                          navigate('/basic/session/join/'+row['humanId']);
                                        } else if (location.pathname.includes('enterprise'))
                                          navigate('/enterprise/sessions/join/'+row['humanId']);
                                      }}
                                    >
                                      JOIN RETRO
                                    </Button>
                                  )}
                                </TableCell>
                              );
                            } else
                              return (
                                <TableCell
                                  key={column.id}
                                  align={column.align}
                                  sx={{ maxWidth: '250px' }}
                                >
                                  {value}
                                </TableCell>
                              );
                          })}
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={
                displayJiraRows.filter((row1: any) => searchFunction(row1))
                  .length
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <>
            <Box
              sx={{
                height: 'calc(100% - 280px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <img src="/svgs/emptySessions.svg" width={300} height={350} />
              <H2SemiBoldTypography
                label="No Session to display"
                style={{ color: '#2C69A1' }}
              />
              <ContainedButtonWithIcon
                id={'create_new__retro_button_desktop'}
                label={'New Session'}
                size={'medium'}
                iconPath="/svgs/plusSmall.svg"
                style={{
                  width: '260px',
                  marginTop: '40px',
                  textAlign: 'center',
                }}
                onClick={() => CreateNewRetro()}
              />
            </Box>
          </>
        )}
      </Paper>
      <>
        {loading && (
          <Box
            sx={{
              display: 'flex',
              zIndex: '3',
              position: 'absolute',
              width: '90%',
              height: '90%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </>
    </>
  );
}
