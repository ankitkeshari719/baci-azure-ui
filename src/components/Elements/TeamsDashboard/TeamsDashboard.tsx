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
import { users } from '../../../constants/DemoConst';
import { Box, InputAdornment, TextField, TableSortLabel } from '@mui/material';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import {
  REGULAR_USER,
  ENTERPRISE_ADMIN,
  REGULAR_ENTERPRISE,
} from '../../../constants/applicationConst';

interface Column {
  id:
    | 'teamName'
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

type Props = {
  teams: any;
};

export default function TeamsDashboard({ teams }: Props) {
  const navigate = useNavigate();
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [page, setPage] = React.useState(0);
  const [orderDirection, setOrderDirection] = React.useState('asc');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchedVal, setSearchedVal] = React.useState('');
  const [teamsTableData, setTeamsTableData] = React.useState(teams);

  React.useEffect(() => {
    setTeamsTableData(teams);
  }, []);

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
      'createdBy',
      'members',
      'teamDepartment',
      'sessions',
      'actions',
      'createdAt',
      'action',
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
    setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
  };

  // Function to navigate on create new team page
  function createNewTeam() {
    if (tempLocalUserData && tempLocalUserData.roleName === REGULAR_USER) {
      navigate('/facilitator/teams/create/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      navigate('/enterprise/teams/create/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === REGULAR_ENTERPRISE
    ) {
      navigate('/enterprise/teams/create/');
    }
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
          label="Teams"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="My Teams"
          style={{ color: commonStyles.PrimaryDark }}
        />
        {/* Search */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            width: '100%',
            flexDirection: 'row',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <TextField
            id="outlined-basic"
            label="Search..."
            variant="outlined"
            sx={{
              background: 'white',
              width: '450px',
            }}
            onChange={e => setSearchedVal(e.target.value)}
            value={searchedVal}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon width="20px" />
                </InputAdornment>
              ),
            }}
          />
          <ContainedButtonWithIcon
            id={'create_new__retro_button_desktop'}
            label={'New Team'}
            size={'medium'}
            iconPath="/svgs/plusSmall.svg"
            style={{ width: '200px', textAlign: 'center' }}
            onClick={() => createNewTeam()}
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
                    // onClick={() =>
                    //   column.id != 'teamId' &&
                    //   handleSortRequest(column.id, displayJiraRows)
                    // }
                  >
                    <TableSortLabel
                      active={true}
                      direction={orderDirection === 'asc' ? 'asc' : 'desc'}
                    >
                      <BodySemiBoldTypography label={column.label} />
                    </TableSortLabel>
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
            0
            // displayJiraRows.filter((row1: any) => searchFunction(row1)).length
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
