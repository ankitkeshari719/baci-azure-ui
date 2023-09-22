import React, { useState } from 'react';
import { chartInputType, formatDateForAPI, formatDateToMonthYear, getActionsChartData, getEnterpriseLevelActionsCounts } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
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
import { Link, useNavigate } from 'react-router-dom';
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
}: {
  dashboard?: boolean;
  team: string;
}) {
  const [enterpriseLevelActions, setEnterpriseLevelActions] = useState<any>([]);
  const [assignedActions, setAssignedActions] = useState<any>([]);
  const [completedActions, setCompletedActions] = useState<any>([]);
  const [completedPercentage, setCompletedPercentage] = useState<Number>();
  const [months, setMonths] = useState<any>([]);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [fromDate, setFromDate] = useState<string>(
    global.chartStartDate ? global.chartStartDate : 

    new Date().getFullYear().toString()  + '-' +  '0' + (new Date().getMonth() ).toString().slice(-2)
  );
  const [toDate, setToDate] = useState<string>(
    global.chartEndDate ? global.chartEndDate :  new Date().getFullYear().toString()  + '-' +  '0' + (new Date().getMonth() + 1).toString().slice(-2)
  );
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
        return '450';
      case windowWidth.current >= 1151 && windowWidth.current <= 1199:
        return '500';
      case windowWidth.current >= 1200 && windowWidth.current <= 125:
        return '520';
      case windowWidth.current >= 1251 && windowWidth.current <= 1300:
        return '550';
      case windowWidth.current >= 1301 && windowWidth.current <= 1400:
        return '600';
      case windowWidth.current >= 1401 && windowWidth.current <= 1500:
        return '650';
      case windowWidth.current >= 1500:
        return '700';

      default:
        return '500';
    }
  };



  React.useEffect(() => {
    handleEnterpriseLevelActionsCountData();
  }, [fromDate, toDate]);

  React.useEffect(() => {
    handleEnterpriseLevelActionsCountData();
  }, [team]);




  const handleEnterpriseLevelActionsCountData = async () => {

    const chartInput :chartInputType ={
      userId:"vishal.gawande@evoltech.com.au",
      roleName:"Enterprise",
      enterpriseId:"evoltech0.0751886606959975",
      teamId:"0",
      fromDate: formatDateForAPI(fromDate),
      toDate:formatDateForAPI(toDate)
    }
     await getActionsChartData(chartInput).then(res=>{
      setEnterpriseLevelActions(res.chartData);
      setAssignedActions(res.chartData?.map((item: any) => item.pending))
      setCompletedActions(res.chartData?.map((item: any) => item.completed))
      setMonths(res.chartData?.map((item: any) => formatDateToMonthYear(item.month) ));
      var tempCompletedPercentage=0
      var tempcompletedActions=0;
      var allActions=0;
      res.chartData?.forEach((item:any)=>{
        allActions= allActions+item.pending+item.completed;
        tempcompletedActions=tempcompletedActions+item.completed;
        // tempCompletedPercentage=tempCompletedPercentage +  +(item.completedInPer.toFixed(2));
      })
      tempCompletedPercentage= +((tempcompletedActions/allActions)*100).toFixed(2) ;

      setCompletedPercentage(tempCompletedPercentage)
     },
     err=>{
      console.log('err', err);
     })

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

  const handleFromDate = (event: SelectChangeEvent) => {
    console.log(event.target.value)
    setFromDate(event.target.value as string);
  };

  const handleToDate = (event: SelectChangeEvent) => {
    setToDate(event.target.value as string);
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

  return (
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
            actions
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
         <DateSelector fromDate={fromDate} toDate={toDate} handleFromDate={handleFromDate} handleToDate={handleToDate}/> </Box>
            {/* Table */}
            <Box sx={{ marginTop: '32px' }}>
              <TableContainer style={{ borderCollapse: 'collapse' }}>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Month</StyledTableCell>
                    <StyledTableCell align="center">Pending</StyledTableCell>
                    <StyledTableCell align="center">Completed</StyledTableCell>
                    <StyledTableCell align="center">
                      Completed %
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enterpriseLevelActions.map((enterpriseLevelAction: any,index:number) => {
                    return (
                      <TableRow key={enterpriseLevelAction.month+index}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {formatDateToMonthYear(enterpriseLevelAction.month)}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {enterpriseLevelAction.pending}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {enterpriseLevelAction.completed}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                        {+enterpriseLevelAction.completedInPer.toFixed(2)}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
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
                  label={formatDateToMonthYear(fromDate) + ' To ' + formatDateToMonthYear(toDate)}
                  style={{ color: '#343434' }}
                />
              </Grid>
            </Box>
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              width={getChartWidth()}
              height="500"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
