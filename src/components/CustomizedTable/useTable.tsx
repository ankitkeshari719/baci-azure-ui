import * as React from 'react';
import { Checkbox, Table, TableCell } from '@mui/material';
import {
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  table: {
    marginTop: theme.spacing(3),
    '& thead td': {
      fontWeight: '800',
      color: '#343434',
      backgroundColor: '#ffffff',
    },
    '& tbody td': {
      fontWeight: '300',
    },
    '& tbody tr:hover': {
      backgroundColor: '#CEEFFF',
      cursor: 'pointer',
    },
  },
}));

export default function useTable(
  records?: any,
  headCells?: any,
  filterFn?: any,
  isSelectAllChecked?:any,
  handleSelectAllCheckbox?:any,

) {
  const classes = useStyles();

  const pages = [5, 10, 25];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(pages[page]);
  const [order, setOrder] = React.useState<any>();
  const [orderBy, setOrderBy] = React.useState();

  // ---------------------------------------------Table Container -------------------------------
  const TblContainer = (props: any) => {
    return <Table className={classes.table}>{props.children}</Table>;
  };

  // ---------------------------------------------Table Header -------------------------------
  const handleSortRequest = (cellId: any) => {
    const isAsc = orderBy === cellId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(cellId);
  };

  const TblHead = (props: any) => {
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell: any) => {
            return (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                {headCell.id === 'check' ? (
                  <>
                    <TableCell>
                      <Checkbox
                        checked={isSelectAllChecked}
                        onChange={handleSelectAllCheckbox}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </TableCell>
                  </>
                ) : (
                  <>
                    {headCell.disableSorting ? (
                      headCell.label
                    ) : (
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCell.id);
                        }}
                      >
                        {headCell.label}
                      </TableSortLabel>
                    )}
                  </>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  };

  // ---------------------------------------------Table Pagination -------------------------------

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const TblPagination = () => {
    return (
      <TablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={records.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    );
  };

  const stableSort = (array: any, comparator: any) => {
    const stabilizedThis = array.map((el: any, index: any) => [el, index]);
    stabilizedThis.sort((a: any, b: any) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el: any) => el[0]);
  };

  const getComparator = (order: any, orderBy: any) => {
    return order === 'desc'
      ? (a: any, b: any) => descendingComparator(a, b, orderBy)
      : (a: any, b: any) => -descendingComparator(a, b, orderBy);
  };

  function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const recordAfterPagingAndSorting = () => {
    return stableSort(
      filterFn.fn(records),
      getComparator(order, orderBy)
    ).slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  };

  return { TblContainer, TblHead, TblPagination, recordAfterPagingAndSorting };
}
