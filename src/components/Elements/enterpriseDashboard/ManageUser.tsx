import { Paper, Box, TextField, InputAdornment } from '@mui/material';
import * as React from 'react';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import useTable from '../../CustomizedTable/useTable';
import { TableBody, TableCell, TableRow } from '@material-ui/core';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const styles = {
  accessCodeTextField: {
    '& .MuiFilledInput-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
      borderRadius: '0px !important',
    },
  },
};

const EMPLOYEES = [
  {
    id: 1,
    fullName: 'Ruchika',
    email: 'ruchika@gslab.com',
    mobile: 12344,
    department: 'Developer',
  },
  {
    id: 2,
    fullName: 'Vikash',
    email: 'vikash@gslab.com',
    mobile: 1,
    department: 'Developer',
  },
  {
    id: 3,
    fullName: 'Sean',
    email: 'sean@gslab.com',
    mobile: 12,
    department: 'Developer',
  },
  {
    id: 4,
    fullName: 'Wood',
    email: 'wood@gslab.com',
    mobile: 123,
    department: 'Developer',
  },
  {
    id: 5,
    fullName: 'Brijech',
    email: 'brijech@gslab.com',
    mobile: 1234,
    department: 'Developer',
  },
  {
    id: 6,
    fullName: 'Ankit',
    email: 'ankit@gslab.com',
    mobile: 12344,
    department: 'Developer',
  },
  {
    id: 7,
    fullName: 'Sanu',
    email: 'sanu@gslab.com',
    mobile: 1445,
    department: 'Developer',
  },
  {
    id: 8,
    fullName: 'Arvind',
    email: 'arvind@gslab.com',
    mobile: 144,
    department: 'Developer',
  },
  {
    id: 9,
    fullName: 'Sarika',
    email: 'sarika@gslab.com',
    mobile: 124,
    department: 'Developer',
  },
  {
    id: 10,
    fullName: 'Dinehs',
    email: 'dinehs@gslab.com',
    mobile: 344,
    department: 'Developer',
  },
  {
    id: 11,
    fullName: 'Larem',
    email: 'larem@gslab.com',
    mobile: 123404,
    department: 'Developer',
  },
];

const headCells = [
  { id: 'fullName', label: 'Employee Name', disableSorting: false },
  { id: 'email', label: 'Employee Address (Personal)', disableSorting: false },
  { id: 'mobile', label: 'Mobile Number', disableSorting: false },
  { id: 'department', label: 'Department', disableSorting: true },
];

export default function ManageUser() {
  const [records, setRecords] = React.useState(EMPLOYEES);
  const [searchedVal, setSearchedVal] = React.useState('');
  const [filterFn, setFilterFn] = React.useState<any>({
    fn: (items: any) => {
      return items;
    },
  });

  const { TblContainer, TblHead, TblPagination, recordAfterPagingAndSorting } =
    useTable(records, headCells, filterFn);

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

  return (
    <>
      <Box
        sx={{
          width: '100%',
          background: '#F9FBFC',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <BodySemiBoldTypography
          label="Manage User"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="Manage Users"
          style={{ color: commonStyles.PrimaryDark }}
        />
        <Box
          sx={{
            width: '100%',
            height: 'calc(var(--app-height)) - 120px',
            background: 'rgb(249 251 252)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <TextField
            id="outlined-basic"
            label="Search..."
            variant="outlined"
            sx={{ marginTop: '20px', background: 'white', width: '50%' }}
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
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.mobile}</TableCell>
                    <TableCell>{item.department}</TableCell>
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
