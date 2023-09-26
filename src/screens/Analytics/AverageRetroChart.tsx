import React, { useState } from 'react';
import {
  chartInputType,
  formatDateForAPI,
  formatDateToMonthYear,
  getCountOfAllSessionsOverTime,
  getRetrosCount,
} from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Link, useNavigate } from 'react-router-dom';
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
    minWidth: '200px',
    borderCollapse: 'collapse',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    border: '1px solid #CCC',
    minWidth: '200px',
    borderCollapse: 'collapse',
  },
}));

export default function AverageRetroChart({
  dashboard,
  team,
}: {
  dashboard?: boolean;
  team: string;
}) {
  const [retrosCounts, setRetrosCounts] = useState<any>([]);
  const [averageRetros, setAverageRetros] = useState([]);
  const [months, setMonths] = useState([]);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState<string>(
    global.chartStartDate
      ? global.chartStartDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          new Date().getMonth().toString().slice(-2)
  );
  const [toDate, setToDate] = useState<string>(
    global.chartEndDate
      ? global.chartEndDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          (new Date().getMonth() + 1).toString().slice(-2)
  );

  const [totalAverageSessions, setTotalAverageSessions] = useState<number>();
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

  React.useEffect(() => {
    handleGetRetroChartData();
  }, [fromDate, toDate]);

  React.useEffect(() => {
    handleGetRetroChartData();
  }, [team]);

  const handleGetRetroChartData = async () => {
    if (global.azureUser != undefined) {
      const chartInput: chartInputType = {
        userId: global.azureUser?.emailId,
        roleName: global.azureUser?.roleName,
        enterpriseId: global.azureUser?.enterpriseId,
        teamId: team,
        fromDate: formatDateForAPI(fromDate),
        toDate: formatDateForAPI(toDate),
      };
      setLoading(true);
      await getCountOfAllSessionsOverTime(chartInput).then(
        res => {
          setLoading(false);
          if (res.data.length > 0) {
            setRetrosCounts(res.data);
            var totalRetrocount = 0;
            res.data.forEach((element: any) => {
              totalRetrocount = element.retroCount + totalRetrocount;
            });
            totalRetrocount = totalRetrocount / res.data.length;

            setAverageRetros(res.data?.map((item: any) => item.retroCount));
            setMonths(
              res.data?.map((item: any) => formatDateToMonthYear(item.month))
            );
            setTotalAverageSessions(+totalRetrocount.toFixed(2));
          } else {
            setRetrosCounts([]);
            setAverageRetros([]);
            setMonths([]);
            setTotalAverageSessions(0);
          }
        },
        err => {
          setLoading(false);
        }
      );
    }
  };

  const series = [
    //data on the y-axis
    {
      name: 'Total No. of Session',
      data: averageRetros,
    },
  ];

  const options: ApexOptions = {
    //data on the x-axis
    xaxis: {
      categories: months,
    },
    chart: {
      id: 'area-chart',
      height: 350,
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
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      colors: undefined,
      width: 2,
      dashArray: 0,
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
    colors: ['#0E9CFF'],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
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
              type="area"
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
                of all Sessions
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
                  label="Count of all sessions"
                  style={{ color: '#2C69A1', marginLeft: '12px' }}
                />
              </Grid>
              {/* Table and Selector */}
              <Grid
                item
                xs={12}
                md={6}
                lg={5}
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
                  />
                </Box>
                {/* Table Container */}
                <Box sx={{ marginTop: '32px' }}>
                  <TableContainer style={{ borderCollapse: 'collapse' }}>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Month</StyledTableCell>
                        <StyledTableCell align="center">
                          No. of Sessions
                        </StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {retrosCounts.map((retrosCount: any, index: number) => {
                        return (
                          <TableRow key={'retroCount' + index}>
                            <StyledTableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {formatDateToMonthYear(retrosCount.month)}
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {retrosCount.retroCount}
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </TableContainer>
                </Box>
              </Grid>
              {/* Chart */}
              <Grid
                item
                xs={12}
                md={6}
                lg={7}
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
                      label="Avg. Sessions over time per month"
                      style={{ color: '#343434' }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ padding: '0px !important', marginTop: '10px' }}
                  >
                    <H4SemiBoldTypography
                      label={totalAverageSessions + ' Sessions'}
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
                  type="area"
                  width={getChartWidth(windowWidth.current)}
                  height="700"
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
}
