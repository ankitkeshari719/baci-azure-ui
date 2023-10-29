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
  ActionList,
  jiraActionStatus,
  users,
} from '../../../constants/DemoConst';
import {
  Box,
  Checkbox,
  InputAdornment,
  TextField,
  TableSortLabel,
  Button,
  CircularProgress,
} from '@mui/material';

import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  H1SemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import StatusDropDown from './StatusDropDown';
import AssigneeDropdown from './AssigneeDropdown';
import {
  EllipsisVerticalIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import CsvDownloader from 'react-csv-downloader';
import { useNavigate } from 'react-router-dom';
import {
  chartInputType,
  createAction,
  formatDateForAPI,
  getActionsDataForTable,
  getAllUsers,
  getAllUsersByEnterpriseId,
  updateAction,
} from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import { UserActionType, UserContext } from '../../../contexts/UserContext';

interface Column {
  id:
    | 'teamName'
    | 'jiraKey'
    | 'jiraId'
    | 'initialSession'
    | 'action.value'
    | 'action.assigneeId'
    | 'action.assigneeName'
    | 'startDate'
    | 'status'
    | 'teamId';
  label: string;
  minWidth?: number;
  align?: 'right';
  displayName?: string;
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'teamName', label: 'Team', minWidth: 200, displayName: 'Team' },
  { id: 'jiraId', label: 'JIRA ID', minWidth: 200, displayName: "JIRA ID'" },
  { id: 'action.value', label: 'Action', minWidth: 300, displayName: 'Action' },
  {
    id: 'initialSession',
    label: 'Initial Session',

    minWidth: 250,
    displayName: 'Initial Session',
  },
  {
    id: 'action.assigneeId',
    label: 'Assignee',
    minWidth: 90,
    displayName: 'Assignee',
  },
  {
    id: 'startDate',
    label: 'Start Date',
    //  type:Date(),
    minWidth: 90,
    displayName: 'Start Date',
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 90,
    displayName: 'Status',
  },
  {
    id: 'teamId',
    label: 'Action',
    minWidth: 20,
    displayName: 'Action',
  },
];
const columns2: any[] = [
  { id: 'r1', displayName: '' },
  { id: 'r2', displayName: '' },

  { id: 'teamName', label: 'Team', minWidth: 200, displayName: '' },
  { id: 'jiraId', label: 'JIRA ID', minWidth: 200, displayName: '' },
  { id: 'action.value', label: 'Action', minWidth: 300, displayName: '' },
  {
    id: 'initialSession',
    label: 'Initial Session',

    minWidth: 250,
    displayName: '',
  },
  {
    id: 'action.assigneeName',
    label: 'Assignee',
    minWidth: 90,
    displayName: '',
  },
  {
    id: 'startDate',
    label: 'Start Date',
    //  type:Date(),
    minWidth: 90,
    displayName: '',
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 90,
    displayName: '',
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
const ActionCount = [
  // { label: 'All', count: ActionList.length, color:'black',selected:true },
  {
    label: jiraActionStatus[0].label,
    count: 0,
    color: jiraActionStatus[0].color,
    selected: true,
  },
  {
    label: jiraActionStatus[1].label,
    count: 0,
    color: jiraActionStatus[1].color,
    selected: true,
  },
  {
    label: jiraActionStatus[2].label,
    count: 0,
    color: jiraActionStatus[2].color,
    selected: true,
  },
  {
    label: jiraActionStatus[3].label,
    count: 0,
    color: jiraActionStatus[3].color,
    selected: true,
  },
];
export default function ActionDashboard() {
  const [jiraRows, setJiraRows] = React.useState<any>([]);
  const [displayJiraRows, setDisplayJiraRows] = React.useState<any>([]);
  const [csvData, setCsvData] = React.useState<any>([]);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [gUser, userDispatch] = React.useContext(UserContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchedVal, setSearchedVal] = React.useState('');

  const [actionCount, setActionCount] = React.useState<any[]>(ActionCount);
  const [loading, setLoading] = React.useState<boolean>(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    getActionsForTable();
  }, []);

  const getActionsForTable = async () => {
    setLoading(true);
    if (gUser.azureUser != undefined) {
      const chartInput: chartInputType = {
        userId: gUser.azureUser?.emailId,
        roleName: gUser.azureUser?.roleName,
        enterpriseId: gUser.azureUser?.enterpriseId,
        teamId: gUser.teamId ? gUser.teamId : '0',
        fromDate: '0',
        toDate: '0',
      };
      await getAllUsersByEnterpriseId(gUser.azureUser?.enterpriseId).then(
        (res: any[]) => {
          dispatch({
            type: ActionType.SET_USER_LIST_BY_ENT,
            payload: { users: res },
          });
          userDispatch({
            type: UserActionType.SET_USER_LIST_BY_ENT,
            payload: { users: res },
          });
          setLoading(false);
        },
        error => {
          setLoading(false);
        }
      );
      setLoading(true);
      await getActionsDataForTable(chartInput).then(
        res => {
          if (res.data.length > 0) {
            let actionsArray: any[] = [];
            res.data.forEach((action: any) => {
              var day = new Date(action.createdAt).getDate();
              var month = new Date(action.createdAt).getMonth();
              var year = new Date(action.createdAt).getFullYear();
              var actionObj = action;
              actionObj['action.value'] = action.actionName;
              actionObj['action.assigneeName'] =
                action.assigneeFName + ' ' + action.assigneeLName;
              actionObj.startDate =
               ( day > 9 ? day : '0' + day) + '-' + (month+1) + '-' + year;

              actionObj['action.assigneeId'] = (action.assignedTo!=null||action.assignedTo!=undefined)?action.assignedTo:"";

              actionsArray.push(actionObj);
            });
            setJiraRows([...actionsArray]);
            updateJiraCount([...actionsArray]);
            setDisplayJiraRows([...actionsArray]);
          }
          setLoading(false);
        },
        error => {
          setLoading(false);
        }
      );
    }
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

  const updateJiraCount = (list: any) => {
    let countOfActions = ActionCount;
    countOfActions.map(obj => {
      obj.count = 0;
    });
    list.forEach((action: any) => {
      countOfActions.map(labelObj => {
        if (action['status'] == labelObj.label) {
          labelObj.count = labelObj.count + 1;
        }
      });
    });
    countOfActions[3].label = countOfActions[3].label;
    setActionCount([...countOfActions]);
    // updateTable(list);
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

  React.useEffect(() => {
    const dummyJiraRows: any[] = [];
    let tempJiraRows: any = [];

    jiraRows.map((jira: any) => {
      actionCount.map((action: any) => {
        if (action.selected && jira.status == action.label) {
          dummyJiraRows.push(jira);
        }
      });
    });
    // setJiraRows([...dummyJiraRows]);
    setDisplayJiraRows([...dummyJiraRows]);
  }, [actionCount]);

  const searchFunction = (row1: any) => {
    const columns = [
      'teamName',
      'jiraId',
      'initialSession',
      'action.value',
      'action.assigneeId',
      'startDate',
      'status',
      'teamId',
    ];
    var fullRow = '';
    columns.forEach((column, index) => {
      if (index == 0) fullRow = fullRow + row1[column];
      else if (column == 'action.assigneeId') {
        const user = users.find(user => user.id == row1[column]);
        fullRow = fullRow + ' ' + user?.name;
      } else fullRow = fullRow + ' ' + row1[column];
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
    if (id == 'action.assigneeId') {
      id = 'action.assigneeName';
    }
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

  React.useEffect(() => {
    let initialData: any[] = [];
    initialData.push({ r1: 'Date : ', r2: new Date().toLocaleString() + '' });

    actionCount.forEach(action => {
      if (action.selected) {
        initialData.push({ r1: action.label, r2: action.count });
      }
    });

    initialData.push({
      teamName: 'Team',
      jiraId: 'JIRA ID',
      'action.value': 'Action',
      initialSession: 'Initial Session',
      'action.assigneeName': 'Assignee',
      startDate: 'Start Date',
      status: 'Status',
      teamId: 'Action',
    });

    displayJiraRows.forEach((element: any) => {
      initialData.push(element);
    });

    setCsvData([...initialData]);
  }, [displayJiraRows]);

  const callUpdateAction = async (
    action: any,
    assignedTo: string,
    status: string,
    tempJiraRows: any
  ) => {
    setLoading(true);

    const requestBody = {
      actionId: action.actionId,
      actionName: action.actionName,
      jiraId: action.jiraId,
      retroId: action.retroId,
      // "retroIdEnc":"64f6179cf9b80b2e2f9f31f9",
      createdBy: action.createdBy,
      assignedTo: assignedTo,
      jiraUrl: action.jiraUrl,
      teamId: action.teamId,
      enterpriseId: action.enterpriseId,
      status: status,
      avatar: action.avatar,
      createdAt: action.createdAt,
      assigneeFName: action.assigneeFName,
      assigneeLName: action.assigneeLName,
      isActive: true,
      teamName: action.teamName,
      retroIdEnc: action.retroIdEnc,
    };

    await createAction(requestBody).then(
      res => {
        setJiraRows([...tempJiraRows]);
        setDisplayJiraRows([...tempJiraRows]);
        updateJiraCount(tempJiraRows);
        setLoading(false);
      },
      err => {
        setJiraRows([...jiraRows]);
        setDisplayJiraRows([...displayJiraRows]);
        setLoading(false);
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
        }}
      >
        <BodySemiBoldTypography
          label="Actions"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="All Actions"
          style={{ color: commonStyles.PrimaryDark }}
        />
        <Box display="flex" flexDirection="row">
          {actionCount.map((action, index) => {
            return (
              <Box
                display="flex"
                flexDirection="column"
                key={index + 'jiraActionStatus'}
                gap="8px"
                padding="16px"
                paddingRight={'26px'}
                borderRadius="4px"
                marginRight="10px"
                marginTop="20px"
                marginBottom="20px"
                sx={{
                  background: 'white',
                  border: true
                    ? '1px solid ' + commonStyles.PrimaryLight
                    : '1px solid yellow',
                  cursor: 'pointer',
                  position: 'relative',
                }}
                onClick={() => {
                  let newArrayState = actionCount;
                  newArrayState.map((ac, index1) => {
                    if (index == index1) {
                      ac.selected = !action.selected;
                    }
                  });
                  setActionCount([...newArrayState]);
                }}
              >
                <H1SemiBoldTypography
                  style={{ color: action.color }}
                  label={action.count}
                />
                <Checkbox
                  checked={action.selected}
                  size="small"
                  sx={{ position: 'absolute', zIndex: 2, right: '0px', top: 0 }}
                />
                <BodyRegularTypography
                  style={{ color: action.color }}
                  label={action.label}
                />
              </Box>
            );
          })}
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

          <CsvDownloader
            filename="BACI Action List"
            extension=".csv"
            separator=";"
            wrapColumnChar=""
            columns={columns2}
            datas={csvData}
            text="Export To CSV"
            noHeader={true}
            style={{
              background: '#3498db',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '10px',
            }}
          />
          {/* <FunnelIcon width="32px" style={{ cursor: 'pointer' }} /> */}
        </Box>
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
                        active={true}
                        direction={orderDirection === 'asc' ? 'asc' : 'desc'}
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
                        if (column.id == 'jiraId') {
                          return (
                            <TableCell
                              key={column.id + '12'}
                              align={column.align}
                              sx={{
                                color: 'rgba(0, 0, 238, 1)',
                                minWidth: '100px',
                                cursor: 'pointer',
                              }}
                            >
                              <a href={row['url']} target="_blank">
                                {row['jiraKey'] ? row['jiraKey'] : value}
                              </a>
                            </TableCell>
                          );
                        } else if (column.id == 'action.assigneeId') {
                          return (
                            <TableCell
                              key={column.id + '12'}
                              align={column.align}
                              sx={{
                                minWidth: '150px',
                              }}
                            >
                              <>
                                {' '}
                                {(
                                  <AssigneeDropdown
                                    id={row['action.assigneeId']}
                                    inputIndex={index}
                                    outAssigneeSelected={async valueOut => {
                                      setSearchedVal('');
                                      var tempJiraRows = jiraRows;
                                      var action = '';
                                      var emailId = '';
                                      var status = '';
                                      tempJiraRows.map(
                                        (obj: any, i: number) => {
                                          if (index == i) {
                                            obj[column.id] = valueOut?.emailId;
                                            obj['assigneeName'] =
                                              valueOut?.name;
                                            obj['assigneeAvatar'] =
                                              valueOut?.avatar;
                                            action = obj;
                                            emailId = valueOut?.emailId;
                                            status = obj?.status;
                                          }
                                        }
                                      );
                                      callUpdateAction(
                                        action,
                                        emailId,
                                        status,
                                        tempJiraRows
                                      );
                                      // setJiraRows(tempJiraRows);
                                      // setDisplayJiraRows(tempJiraRows);

                                      // localStorage.setItem(
                                      //   'actionList',
                                      //   JSON.stringify(tempJiraRows)
                                      // );
                                      //
                                    }}
                                  />
                                )}
                              </>
                            </TableCell>
                          );
                        } else if (column.id == 'status') {
                          return (
                            <TableCell
                              key={column.id + '12'}
                              align={column.align}
                              sx={{
                                minWidth: '80px',
                              }}
                            >
                              <StatusDropDown
                                status={value}
                                outStatusSelected={valueOut => {
                                  var tempJiraRows = jiraRows;
                                  var action = '';
                                  var emailId = '';
                                  var status = '';

                                  tempJiraRows.map((obj: any, i: number) => {
                                    if (index == i) {
                                      obj[column.id] = valueOut;

                                      action = obj;
                                      emailId = (obj.assignedTo!=null||obj.assignedTo!=undefined) ?obj.assignedTo:"";
                                      status = valueOut;
                                    }
                                  });
                                  callUpdateAction(
                                    action,
                                    emailId,
                                    status,
                                    tempJiraRows
                                  );
                                  // console.log("run")
                                  // setJiraRows(tempJiraRows);
                                  // updateJiraCount(tempJiraRows);

                                  // localStorage.setItem(
                                  //   'actionList',
                                  //   JSON.stringify(tempJiraRows)
                                  // );
                                  // updateJiraCount(tempJiraRows);
                                }}
                              />
                              {/* {value} */}
                            </TableCell>
                          );
                        } else if (column.id == 'teamId') {
                          return (
                            <TableCell
                              key={column.id + '12'}
                              align={column.align}
                              sx={{
                                minWidth: '20px',
                                alignItems: 'center',
                              }}
                            >
                              <EllipsisVerticalIcon width="24px" />
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              sx={{ maxWidth: '250px' }}
                            >
                              {value}
                            </TableCell>
                          );
                        }
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
            displayJiraRows.filter((row1: any) => searchFunction(row1)).length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
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
