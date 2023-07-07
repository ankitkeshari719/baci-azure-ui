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
import { ActionList, jiraActionStatus, users } from '../../../helpers/DemoConst';
import Avatar from '../Avatar';
import { Box, TextField } from '@mui/material';
import { BodyRegularTypography, BodySemiBoldTypography, H1SemiBoldTypography, H2SemiBoldTypography } from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';

interface Column {
    id: 'teamName' | 'jiraId' | 'initialSession' | 'action.value' | 'action.assigneeId' | 'startDate' | 'status';
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'teamName', label: 'Team', minWidth: 200 },
    { id: 'jiraId', label: 'JIRA ID', minWidth: 200 },
    { id: 'action.value', label: 'Action', minWidth: 330 },
    {
        id: 'initialSession',
        label: 'Initial Session',
        //  getActions: (params: GridRowParams) => [
        //      <GridActionsCellItem icon={<SecurityIcon/>}  label="Delete" showInMenu/>,
        //      <GridActionsCellItem icon={<SecurityIcon/>}  label="Print"  />,
        //    ],
        minWidth: 400,
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
    //   {
    //     field: 'fullName',
    //     headerName: 'Assignee',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (params: GridValueGetterParams) =>
    //       `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    //   },
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
    const [searched, setSearched] = React.useState<string>("");

  
    const requestSearch = (searchedVal:any) => {
        console.log(searchedVal.target.value,"searchedVal")
      const filteredRows = jiraRows.filter((row:any) => {
        return row.teamName.toLowerCase().includes(searchedVal.target.value.toLowerCase());
      });
      setJiraRows(filteredRows);
    };
  
    const cancelSearch = () => {
      setSearched("");
      requestSearch(searched);
    };





    function flattenObject(ob: any) {
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
    }

    React.useEffect(() => {
       
        let tempJiraRows: any = [];
        ActionList.map(action => {
            tempJiraRows.push(flattenObject(action))
        })
        setJiraRows(tempJiraRows)

    }, [])





    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const returnUser =(id:string)=>{
       const user= users.find(user=> user.id==id);
       return<Box display="flex" flexDirection="row" alignItems="center">
       <Avatar avatar={user?.avatar} css={{width:"32px",height:'32px'}}/>
       {user?.name}
       </Box>
    }

    const statusColors=["rgba(234, 67, 53, 1)",  "rgba(223, 133, 23, 1)", "rgba(52, 168, 83, 1)",   "rgba(128, 128, 128, 1)"];
const returnTheColor=(status:string)=>{
  return  statusColors[jiraActionStatus.findIndex((element)=> element==status)];
}


    return (
        <Paper sx={{ width: '100%', background:'rgb(249 251 252)',padding:'20px' }}>

<H2SemiBoldTypography label="All Actions" style={{color: commonStyles.PrimaryDark}}/>


<Box display="flex" flexDirection="row">
{jiraActionStatus.map((action,index)=>{
    return<Box display="flex" flexDirection="column" width="92px"  gap="8px" padding="16px" borderRadius="4px" marginRight="10px" marginTop="20px" marginBottom="20px" sx={{background:"white", border: "1px solid "+commonStyles.PrimaryLight}}>
     <H1SemiBoldTypography style={{color:statusColors[index]}} label="22"/>
     <BodyRegularTypography style={{color:statusColors[index]}} label="TO DO"/>

        </Box>
})}
</Box>

{/* <TextField
          value={searched}
          onChange={(searchVal:any) => requestSearch(searchVal)}
        //   onCancelSearch={() => cancelSearch()}
        /> */}
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                       
                        <TableRow > 
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    sx={{borderBottom:'2px solid gray'}}
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
                                    <StyledTableRow hover role="checkbox" tabIndex={-1} key={index} >
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            if (column.id == "jiraId") {
                                                return (<TableCell key={column.id + "12"} align={column.align} sx={{
                                                    color: "rgba(0, 0, 238, 1)", minWidth: '100px'
                                                }}>
                                                    {value}
                                                </TableCell>)
                                            }

                                            else if (column.id == "action.assigneeId") {
                                                return (<TableCell key={column.id + "12"} align={column.align} sx={{
                                                     minWidth: '100px'
                                                }}>
                                                  {returnUser(value)}
                                                </TableCell>)
                                            }
                                           
                                            else if (column.id == "status") {
                                                return (<TableCell key={column.id + "12"} align={column.align} sx={{
                                                     minWidth: '100px', color:returnTheColor(value)

                                                }}>
                                                  {value}
                                                </TableCell>)
                                            }   
                                            else {
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
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
    );
}