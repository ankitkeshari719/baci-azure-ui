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
import { MONTH_SELECTORS, MenuProps } from './const';
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

  const [selectedFromDate, setSelectedFromDate] = useState<string>();
  const [selectedToDate, setSelectedToDate] = useState<string>();
  const [totalAverageSessions, setTotalAverageSessions] = useState<number>();
  const navigate = useNavigate();
  const windowWidth = React.useRef(window.innerWidth);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      setPath('basic');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      setPath('enterprise');
    }
  }, [tempLocalUserData]);

  const getChartWidth = () => {
    switch (true) {
      case windowWidth.current <= 1051:
        return '400';
      case windowWidth.current > 1051 && windowWidth.current <= 1150:
        return '500';
      case windowWidth.current >= 1151 && windowWidth.current <= 1199:
        return '520';
      case windowWidth.current >= 1200 && windowWidth.current <= 1300:
        return '650';
      case windowWidth.current >= 1301 && windowWidth.current <= 1400:
        return '700';
      case windowWidth.current >= 1401 && windowWidth.current <= 1500:
        return '750';
      case windowWidth.current >= 1500:
        return '850';

      default:
        return '500';
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

  // React.useEffect(() => {
  //   const tempSelectedFromDate = MONTH_SELECTORS.filter(
  //     monthSelector => monthSelector.id === Number(fromDate)
  //   );
  //   const tempSelectedToDate = MONTH_SELECTORS.filter(
  //     monthSelector => monthSelector.id === Number(toDate)
  //   );

  //   setSelectedFromDate(
  //     tempSelectedFromDate &&
  //       tempSelectedFromDate[0] &&
  //       tempSelectedFromDate[0].month
  //   );
  //   setSelectedToDate(
  //     tempSelectedToDate && tempSelectedToDate[0] && tempSelectedToDate[0].month
  //   );
  // }, [fromDate, toDate]);

  React.useEffect(() => {
    handleGetRetroChartData();
  }, [fromDate, toDate]);

  React.useEffect(() => {
    handleGetRetroChartData();
  }, [team]);

  const handleGetRetroChartData = async () => {
    if(global.azureUser!=undefined){  
      const chartInput: chartInputType = {
     userId: global.azureUser?.emailId,
     roleName: global.azureUser?.roleName,
     enterpriseId: global.azureUser?.enterpriseId,
     teamId: '0',
     fromDate: formatDateForAPI(fromDate),
     toDate: formatDateForAPI(toDate),
   };
    await getCountOfAllSessionsOverTime(chartInput).then(res => {
   
      if(res.data.length>0)
      {setRetrosCounts(res.data);
      var totalRetrocount = 0;
      res.data.forEach((element: any) => {
        totalRetrocount = element.retroCount + totalRetrocount;
      });
      totalRetrocount = totalRetrocount / res.data.length;

      setAverageRetros(res.data?.map((item: any) => item.retroCount));
      setMonths(
        res.data?.map((item: any) => formatDateToMonthYear(item.month))
      );
      setTotalAverageSessions(+totalRetrocount.toFixed(2));}
      else{
        setRetrosCounts([]);
        setAverageRetros([]);
        setMonths([]);
        setTotalAverageSessions(0)
      }
    });
  }
    // await getRetrosCount('10', '16', team).then(
    //   res => {
    //     if (res && res.result) {
    //       console.log(res.result)
    //       setRetrosCounts(res.result);
    //       setAverageRetros(res.result?.map((item: any) => item.averageRetros));
    //       setMonths(res.result?.map((item: any) => item.month));
    //       let temp = 0;
    //       res.result.map((item: any) => {
    //         temp = temp + item.averageRetros;
    //       });
    //       setTotalAverageSessions(Math.round(temp / res.result.length));
    //     }
    //   },
    //   err => {
    //     console.log('err', err);
    //   }
    // );
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
      {dashboard ? (
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          width="518"
          height="320"
        />
      ) : (
        <Grid container spacing={2} sx={{ padding: '48px', overflowY: 'auto' }}>
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
            <Link to={path + '/analytics/'}>Analytics </Link>&nbsp;\ Count of
            all Sessions
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
              width={getChartWidth()}
              height="700"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
