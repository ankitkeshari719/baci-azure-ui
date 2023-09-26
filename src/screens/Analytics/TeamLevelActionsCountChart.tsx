import React, { useState } from 'react';
import {
  chartInputType,
  formatDateForAPI,
  formatDateToMonthYear,
  getTeamLevelActionsCounts,
  getTeamLevelActionsDataForChart,
} from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import {
  BodyRegularTypography,
  ButtonLabelTypography,
  H2SemiBoldTypography,
  H4SemiBoldTypography,
} from '../../components/CustomizedTypography';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import { MONTH_SELECTORS, MenuProps, getChartWidth } from './const';
import { GlobalContext } from '../../contexts/GlobalContext';
import { BASIC, ENTERPRISE } from '../../constants/applicationConst';
import DateSelector from '../../components/Elements/EnterpriseDashboardPages/DateSelector';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F0F0F0',
    color: '#000000',
    border: '1px solid #CCC',
    minWidth: '130px',
    borderCollapse: 'collapse',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    border: '1px solid #CCC',
    minWidth: '130px',
    borderCollapse: 'collapse',
  },
}));

export default function TeamLevelActionsCountChart({
  dashboard,
  team,
}: {
  dashboard?: boolean;
  team?: string;
}) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [teamLevelActions, setTeamLevelActions] = useState<any>([]);
  const [assignedActions, setAssignedActions] = useState<any>([]);
  const [completedActions, setCompletedActions] = useState<any>([]);
  const [completedPercentage, setCompletedPercentage] = useState<Number>();
  const [months, setMonths] = useState<any>([]);
  const [fromDate, setFromDate] = useState<string>(
    global.chartStartDate
      ? global.chartStartDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          new Date().getMonth().toString().slice(-2)
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [toDate, setToDate] = useState<string>(
    global.chartEndDate
      ? global.chartEndDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          (new Date().getMonth() + 1).toString().slice(-2)
  );

  const navigate = useNavigate();
  const windowWidth = React.useRef(window.innerWidth);

  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    if (global.azureUser?.roleName && global.azureUser?.roleName === BASIC) {
      setPath('basic');
    } else if (
      global.azureUser?.roleName &&
      global.azureUser?.roleName === ENTERPRISE
    ) {
      setPath('enterprise');
    }
  }, [global.azureUser?.roleName]);

  React.useEffect(() => {
    handleGetTeamLevelActionsCountsData();
  }, [fromDate, toDate,global?.teamId]);

  function removeDuplicates(arr: string[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }



  const handleGetTeamLevelActionsCountsData = async () => {
    if (global.azureUser != undefined) {
      const chartInput: chartInputType = {
        userId: global.azureUser?.emailId,
        roleName: global.azureUser?.roleName,
        enterpriseId: global.azureUser?.enterpriseId,
        teamId: global.teamId?global.teamId:"0",
        fromDate: formatDateForAPI(fromDate),
        toDate: formatDateForAPI(toDate),
      };

      setLoading(true);
      await getTeamLevelActionsDataForChart(chartInput).then(
        res => {
          // console.log(res.data);
          setLoading(false);
          if (res.data.length > 0) {
            let tempData = [];
            let assignedArray = [];
            let completedArray = [];
            let teamNameArray = [];
            var totalPercentage = 0;
            var totalCompleted = 0;
            var totalActions = 0;
            for (let i = 0; i < res.data.length; i++) {
              tempData.push({
                team: res.data[i].teamName,
                assigned: res.data[i].pending,
                completed: res.data[i].completed,
                completedPercentage: +res.data[i].completedInPer.toFixed(2),
              });
              totalCompleted = totalCompleted + res.data[i].completed;
              totalActions =
                totalActions + res.data[i].completed + res.data[i].pending;

              assignedArray.push(res.data[i].pending);
              completedArray.push(res.data[i].completed);
              teamNameArray.push(res.data[i].teamName);
            }
            totalPercentage = (totalCompleted / totalActions) * 100;
            setTeamLevelActions(tempData);
            setAssignedActions(assignedArray);
            setCompletedActions(completedArray);
            setMonths(teamNameArray);
            setCompletedPercentage(+totalPercentage.toFixed(2));
          } else {
            setTeamLevelActions([]);
            setAssignedActions([]);
            setCompletedActions([]);
            setMonths([]);
            setCompletedPercentage(0);
          }
        },

        err => {
          console.log(err);
          setLoading(false);
        }
      );
    }
  };
  React.useEffect(() => {
    const fromDateInput = global.chartStartDate;
    const toDateInput = global.chartEndDate;
    if (
      fromDateInput != '' &&
      fromDateInput != undefined &&
      fromDateInput != null
    ) {
      setFromDate(fromDateInput);
    }
    if (toDateInput != '' && toDateInput != undefined && toDateInput != null) {
      setToDate(toDateInput);
    }
  }, [global.chartStartDate, global.chartEndDate]);

  const series = [
    //data on the y-axis
    {
      name: 'Completed Actions',
      data: completedActions,
    },
    {
      name: 'Action Pending',
      data: assignedActions,
    },
  ];

  const options: ApexOptions = {
    //data on the x-axis
    xaxis: {
      categories: months,
    },
    chart: {
      id: 'bar',
      stacked: true,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: true,
        tools: {
          download: false,
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        fontFamily: 'Poppins',
        fontWeight: '400',
        fontSize: '12px',
        colors: ['#ffffff'],
      },
      background: {
        enabled: true,
        foreColor: '#333333',
        borderRadius: 50,
        dropShadow: {
          top: 10,
        },
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    grid: {
      show: true,
      borderColor: '#CCCCCC',
      strokeDashArray: 0,
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    colors: ['#2C69A1', '#159ADD'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 40,
    },
    fill: {
      opacity: 1,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
  };

  const handleFromDate = (event: SelectChangeEvent) => {
    setFromDate(event.target.value as string);
  };

  const handleToDate = (event: SelectChangeEvent) => {
    setToDate(event.target.value as string);
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {dashboard ? (
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              width="518"
              height="320"
            />
          ) : (
            <Grid
              container
              spacing={2}
              sx={{ padding: '48px', overflowY: 'auto' }}
            >
              {/* Route Path */}
              <Grid
                item
                xs={12}
                sx={{
                  padding: '0px !important',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <Link to={path + '/analytics/'}>Analytics </Link>&nbsp;\ Count
                Level
              </Grid>
              {/* Back Button & Chart Title */}
              <Grid
                item
                xs={12}
                sx={{
                  padding: '0px !important',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  marginTop: '24px',
                }}
              >
                <Icons.ArrowCircleLeftOutline
                  size={32}
                  style={{
                    cursor: 'pointer',
                    color: '#159ADD',
                  }}
                  onClick={() => navigate(-1)}
                />
                <H2SemiBoldTypography
                  label="Count of Team Actions (Assigned vs Completed)"
                  style={{ color: '#2C69A1', marginLeft: '16px' }}
                />
              </Grid>
              {/* Table with Selector*/}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  padding: '0px !important',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  marginTop: '24px',
                }}
              >
                {/* Selector */}

                <Box>
                  {' '}
                  <DateSelector
                    fromDate={fromDate}
                    toDate={toDate}
                    handleFromDate={handleFromDate}
                    handleToDate={handleToDate}
                  />{' '}
                </Box>

                {/* Table */}
                <Box sx={{ marginTop: '32px' }}>
                  <TableContainer style={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Team</StyledTableCell>
                        <StyledTableCell align="center">
                          Pending
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Completed
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Completed %
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {teamLevelActions.map(
                        (teamLevelAction: any, index: number) => {
                          return (
                            <TableRow key={'teamLevelActions' + index}>
                              <StyledTableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {teamLevelAction.team}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {teamLevelAction.assigned}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {teamLevelAction.completed}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {teamLevelAction.completedPercentage}
                              </StyledTableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </TableContainer>
                </Box>
              </Grid>
              {/* Chart  */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  padding: '0px !important',
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Box>
                  <Grid item xs={12} sx={{ padding: '0px !important' }}>
                    <BodyRegularTypography
                      label="Avg. Actions Completed"
                      style={{ color: '#343434' }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ padding: '0px !important', marginTop: '10px' }}
                  >
                    <H4SemiBoldTypography
                      label={
                        completedPercentage != undefined
                          ? completedPercentage + ' % '
                          : 0 + ' %'
                      }
                      style={{ color: '#343434' }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ padding: '0px !important', marginTop: '10px' }}
                  >
                    <BodyRegularTypography
                      label={
                        formatDateToMonthYear(fromDate) +
                        ' To ' +
                        formatDateToMonthYear(toDate)
                      }
                      style={{ color: '#343434' }}
                    />
                  </Grid>
                </Box>
                <ReactApexChart
                  options={options}
                  series={series}
                  type="bar"
                  width={getChartWidth(windowWidth.current)}
                  height="500"
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
}
