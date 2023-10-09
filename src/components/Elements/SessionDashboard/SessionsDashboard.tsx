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
import { Box, InputAdornment, TextField, TableSortLabel } from '@mui/material';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import AssigneeDropdown from '../actionDashboard/AssigneeDropdown';
import StatusDropDown from '../actionDashboard/StatusDropDown';

interface Column {
  id:
    | 'teamName'
    | 'teamId'
    | 'createdBy'
    | 'members'
    | 'teamDepartment'
    | 'sessions'
    | 'actions'
    | 'createdAt'
    | 'action';
  label: string;
  minWidth?: number;
  align?: 'right';
  displayName?: string;
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: 'teamId',
    label: 'Team Id',
    minWidth: 200,
    displayName: 'Team Id',
  },
  {
    id: 'teamName',
    label: 'Team Name',
    minWidth: 200,
    displayName: 'Team Name',
  },
  { id: 'createdBy', label: 'Creator', minWidth: 200, displayName: 'Creator' },
  {
    id: 'members',
    label: 'Members',
    minWidth: 300,
    displayName: 'Members',
  },
  {
    id: 'teamDepartment',
    label: 'Department',
    minWidth: 250,
    displayName: 'Department',
  },
  {
    id: 'sessions',
    label: 'Sessions',
    minWidth: 90,
    displayName: 'Sessions',
  },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 90,
    displayName: 'Actions',
  },
  {
    id: 'createdAt',
    label: 'Created on',
    minWidth: 90,
    displayName: 'Created on',
  },
  {
    id: 'action',
    label: 'Action',
    minWidth: 20,
    displayName: 'Action',
  },
];

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ActionCount = [
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

type Props = {
  sessions: any;
};

export default function SessionsDashboard({ sessions }: Props) {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [orderDirection, setOrderDirection] = React.useState('asc');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchedVal, setSearchedVal] = React.useState('');
  const [teamsTableData, setTeamsTableData] = React.useState(sessions);

  const [displayJiraRows, setDisplayJiraRows] = React.useState<any>([]);
  const [csvData, setCsvData] = React.useState<any>([]);
  const [actionCount, setActionCount] = React.useState<any[]>(ActionCount);

  React.useEffect(() => {
    setTeamsTableData(sessions);
  }, []);

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
    let initialData = [];
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
        <H2SemiBoldTypography
          label="My Sessions"
          style={{ color: commonStyles.PrimaryDark }}
        />
        {/* Search */}
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
            sx={{
              marginTop: '20px',
              marginBottom: '10px',
              background: 'white',
              width: '450px',
            }}
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
        </Box>
        {/* Main Table  */}
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
              {teamsTableData
                .filter((row1: any) => searchFunction(row1))
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
        {/* Table Pagination */}
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
    </>
  );
}
