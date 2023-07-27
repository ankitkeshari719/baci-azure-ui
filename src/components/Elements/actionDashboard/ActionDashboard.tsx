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
} from '../../../helpers/DemoConst';
import { Box, Checkbox, InputAdornment, TextField } from '@mui/material';
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

interface Column {
  id:
    | 'teamName'
    | 'jiraId'
    | 'initialSession'
    | 'action.value'
    | 'action.assigneeId'
    | 'startDate'
    | 'status'
    | 'teamId';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'teamName', label: 'Team', minWidth: 200 },
  { id: 'jiraId', label: 'JIRA ID', minWidth: 200 },
  { id: 'action.value', label: 'Action', minWidth: 300 },
  {
    id: 'initialSession',
    label: 'Initial Session',

    minWidth: 250,
  },
  {
    id: 'action.assigneeId',
    label: 'Assignee',
    minWidth: 90,
  },
  {
    id: 'startDate',
    label: 'Start Date',
    //  type:Date(),
    minWidth: 90,
  },
  {
    id: 'status',
    label: 'Status',
    minWidth: 90,
  },
  {
    id: 'teamId',
    label: 'Action',
    minWidth: 20,
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

export default function ActionDashboard() {
  const [jiraRows, setJiraRows] = React.useState<any>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searched, setSearched] = React.useState<string>('');

  const [actionCount, setActionCount] = React.useState<any[]>([
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
  ]);

  const requestSearch = (searchedVal: any) => {
    const filteredRows = jiraRows.filter((row: any) => {
      return row.teamName
        .toLowerCase()
        .includes(searchedVal.target.value.toLowerCase());
    });
    setJiraRows(filteredRows);
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

  const updateTable = () => {
    let tempJiraRows: any = [];
    ActionList.map(action => {
      tempJiraRows.push(flattenObject(action));
    });
    setJiraRows(tempJiraRows);
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
    let countOfActions = actionCount;
    ActionList.forEach(action => {
      countOfActions.map(labelObj => {
        if (action.status == labelObj.label) {
          labelObj.count = labelObj.count + 1;
        }
      });
    });
    countOfActions[3].label = countOfActions[3].label;
    setActionCount(countOfActions);
    updateTable();
  }, []);

  React.useEffect(() => {
    const dummyJiraRows: any[] = [];
    let tempJiraRows: any = [];
    ActionList.map(action => {
      tempJiraRows.push(flattenObject(action));
    });
    tempJiraRows.map((jira: any) => {
      actionCount.map((action: any) => {
        if (action.selected && jira.status == action.label) {
          dummyJiraRows.push(jira);
        }
      });
    });
    setJiraRows([...dummyJiraRows]);
  }, [actionCount]);

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
        {/* {React.useMemo(()=>{ */}
        <Box display="flex" flexDirection="row">
          {actionCount.map((action, index) => {
            return (
              <Box
                display="flex"
                flexDirection="column"
                key={index + 'jiraActionStatus'}
                gap="8px"
                padding="16px"
                paddingRight={"26px"}
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
                  position:'relative'
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
                <Checkbox checked={action.selected} size="small"  sx={{position:'absolute',zIndex:2,right:"0px",top:0 }}/>
                <BodyRegularTypography
                  style={{ color: action.color }}
                  label={action.label}
                />
              </Box>
            );
          })}
        </Box>
        {/* } */}
        {/* // ,[actionCount])} */}

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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon width="20px" />
                </InputAdornment>
              ),
            }}
          />

          <FunnelIcon width="32px" style={{ cursor: 'pointer' }} />
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
                  >
                    <BodySemiBoldTypography label={column.label} />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {jiraRows
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
                              }}
                            >
                              {value}
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
                              <AssigneeDropdown status={value} />
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
                              <StatusDropDown status={value} />
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
          count={jiraRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
