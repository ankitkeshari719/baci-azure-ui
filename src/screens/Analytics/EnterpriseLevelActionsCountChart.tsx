import React, { useState } from 'react';
import {
  chartInputType,
  formatDateForAPI,
  formatDateToMonthYear,
  getActionsChartData,
  getEnterpriseLevelActionsCounts,
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
import { UserContext } from '../../contexts/UserContext';

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

export default function EnterpriseLevelActionsCountChart({
  dashboard,
  team,
  count
}: {
  dashboard?: boolean;
  team: string;
  count: (count:number) => void;
}) {
  const [enterpriseLevelActions, setEnterpriseLevelActions] = useState<any>([]);
  const [assignedActions, setAssignedActions] = useState<any>([]);
  const [completedActions, setCompletedActions] = useState<any>([]);
  const [completedPercentage, setCompletedPercentage] = useState<Number>();
  const [months, setMonths] = useState<any>([]);
  const [gUser,userDispatch]= React.useContext(UserContext);
  const [fromDate, setFromDate] = useState<string>(
    gUser.chartStartDate
      ? gUser.chartStartDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          new Date().getMonth().toString().slice(-2)
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [toDate, setToDate] = useState<string>(
    gUser.chartEndDate
      ? gUser.chartEndDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          (new Date().getMonth() + 1).toString().slice(-2)
  );
  const navigate = useNavigate();
  const windowWidth = React.useRef(window.innerWidth);

  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    if (gUser.azureUser?.roleName && gUser.azureUser?.roleName === BASIC) {
      setPath('basic');
    } else if (
      gUser.azureUser?.roleName &&
      gUser.azureUser?.roleName === ENTERPRISE
    ) {
      setPath('enterprise');
    }
  }, [gUser.azureUser?.roleName]);

  React.useEffect(() => {
    handleEnterpriseLevelActionsCountData();
  }, [fromDate, toDate,gUser.teamId]);



  const handleEnterpriseLevelActionsCountData = async () => {
    if (gUser.azureUser != undefined) {
      const chartInput: chartInputType = {
        userId: gUser.azureUser?.emailId,
        roleName: gUser.azureUser?.roleName,
        enterpriseId: gUser.azureUser?.enterpriseId,
        teamId: gUser.teamId?gUser.teamId:"0",
        fromDate: formatDateForAPI(fromDate),
        toDate: formatDateForAPI(toDate,true),
      };
      setLoading(true);
      await getActionsChartData(chartInput).then(
        res => {
          setLoading(false);
          setEnterpriseLevelActions(res.chartData);
          setAssignedActions(res.chartData?.map((item: any) => item.pending));
          setCompletedActions(
            res.chartData?.map((item: any) => item.completed)
          );

          count(res.actionsData?.length);
          setMonths(
            res.chartData?.map((item: any) => formatDateToMonthYear(item.month))
          );
          var tempCompletedPercentage = 0;
          var tempcompletedActions = 0;
          var allActions = 0;
          res.chartData?.forEach((item: any) => {
            allActions = allActions + item.pending + item.completed;
            tempcompletedActions = tempcompletedActions + item.completed;
            // tempCompletedPercentage=tempCompletedPercentage +  +(item.completedInPer.toFixed(2));
          });
          tempCompletedPercentage = +(
            (tempcompletedActions / allActions) *
            100
          ).toFixed(2);

          setCompletedPercentage(tempCompletedPercentage);
        },
        err => {
          setLoading(false);
          console.log('err', err);
        }
      );
    }
  };

  const series = [
    //data on the y-axis
    {
      name: 'Completed Actions',
      data: completedActions,
    },
    {
      name: 'Actions Pending',
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
      height: 350,
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

  const handleFromDate = (event: any) => {
    setFromDate(event as string);
  };

  const handleToDate = (event: any) => {
    setToDate(event as string);
  };

  React.useEffect(() => {
    const fromDateInput = gUser.chartStartDate;
    const toDateInput = gUser.chartEndDate;
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
  }, [gUser.chartStartDate, gUser.chartEndDate]);

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
                of actions
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
                  label="Count of All Actions (Assigned vs Completed)"
                  style={{ color: '#2C69A1', marginLeft: '16px' }}
                />
              </Grid>
              {/* Table and Selector */}
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
                        <StyledTableCell align="center">Month</StyledTableCell>
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
                      {enterpriseLevelActions.map(
                        (enterpriseLevelAction: any, index: number) => {
                          return (
                            <TableRow key={enterpriseLevelAction.month + index}>
                              <StyledTableCell
                                component="th"
                                scope="row"
                                align="center"
                              >
                                {formatDateToMonthYear(
                                  enterpriseLevelAction.month
                                )}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {enterpriseLevelAction.pending}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {enterpriseLevelAction.completed}
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {
                                  +enterpriseLevelAction.completedInPer.toFixed(
                                    2
                                  )
                                }
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
                      label={completedPercentage + '%'}
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
