import React, { useState } from 'react';
import {
  chartInputType,
  formatDateForAPI,
  formatDateToMonthYear,
  getEnterpriseLevelSentimentsMoods,
  getParticipantMoodCount,
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
} from '@mui/material';
import {
  BodyRegularTypography,
  ButtonLabelTypography,
  H2SemiBoldTypography,
  H4RegularTypography,
} from '../../components/CustomizedTypography';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import { MONTH_SELECTORS, MenuProps, getChartWidth } from './const';
import { GlobalContext } from '../../contexts/GlobalContext';
import { BASIC, ENTERPRISE } from '../../constants/applicationConst';
import DateSelector from '../../components/Elements/EnterpriseDashboardPages/DateSelector';

export default function EnterpriseLevelSentimentsMoodsChart({
  dashboard,
  team,
}: {
  dashboard?: boolean;
  team: string;
}) {
  const [sadMoods, setSadMoods] = useState([]);
  const [neutralMoods, setNeutralMoods] = useState([]);
  const [happyMoods, setHappyMoods] = useState([]);
  const [sadMoodPercentage, setSadMoodPercentage] = useState<number>();
  const [neutralMoodPercentage, setNeutralMoodPercentage] = useState<number>();
  const [happyMoodPercentage, setHappyMoodPercentage] = useState<number>();
  const [months, setMonths] = useState<any[]>([]);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [loading,setLoading]=useState<boolean>(true);
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
  const navigate = useNavigate();
  const windowWidth = React.useRef(window.innerWidth);

  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    if (global.azureUser?.roleName && global.azureUser?.roleName === BASIC) {
      setPath('basic');
    } else if (global.azureUser?.roleName && global.azureUser?.roleName === ENTERPRISE) {
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
    handleGetEnterpriseLevelSentimentsMoods();
  }, [fromDate, toDate]);

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentsMoods();
  }, [global.teamId]);

  const handleGetEnterpriseLevelSentimentsMoods = async () => {
    if(global.azureUser!=undefined){  
      const chartInput: chartInputType = {
     userId: global.azureUser?.emailId,
     roleName: global.azureUser?.roleName,
     enterpriseId: global.azureUser?.enterpriseId,
     teamId: global.teamId?global.teamId:"0",
     fromDate: formatDateForAPI(fromDate),
     toDate: formatDateForAPI(toDate),
   };
   setLoading(true);

    await getParticipantMoodCount(chartInput).then(res => {
      setLoading(false)
      if (res.data.length > 0) {
        let chartData: any[] = [];
        var totalHappyCards = 0;
        var totalNeutralCards = 0;
        var totalSadCards = 0;
        var totalCards = 0;
        var months: any[] = [];
        res.data.forEach((item: any, index: number) => {
          var obj = {
            happy: item.pulseCheckChartData.happyCards,
            id: index,
            month: item.month,
            neutral: item.pulseCheckChartData.neutralCards,
            sad: item.pulseCheckChartData.sadCards,
          };
          months.push(formatDateToMonthYear(item.month));
          totalHappyCards =
            totalHappyCards + item.pulseCheckChartData.happyCards;
          totalNeutralCards =
            totalNeutralCards + item.pulseCheckChartData.neutralCards;
          totalSadCards = totalSadCards + item.pulseCheckChartData.sadCards;
          chartData.push(obj);
        });
        totalCards = totalHappyCards + totalNeutralCards + totalSadCards;

    
        setMonths(months);
        setSadMoods(
          res.data?.map((item: any) =>
            Math.round(item.pulseCheckChartData.sadCards)
          )
        );
        setNeutralMoods(
          res.data?.map((item: any) =>
            Math.round(item.pulseCheckChartData.neutralCards)
          )
        );
        setHappyMoods(
          res.data?.map((item: any) =>
            Math.round(item.pulseCheckChartData.happyCards)
          )
        );
        const sadPercent = +((totalSadCards / totalCards) * 100).toFixed(2);
        const neutralPercent = +(
          (totalNeutralCards / totalCards) *
          100
        ).toFixed(2);
        const happyPercent = +((totalHappyCards / totalCards) * 100).toFixed(2);
        setSadMoodPercentage(sadPercent ? sadPercent : 0);
        setNeutralMoodPercentage(neutralPercent ? neutralPercent : 0);
        setHappyMoodPercentage(happyPercent ? happyPercent : 0);
      } else {
        setMonths([]);
        setSadMoods([]);
        setNeutralMoods([]);
        setHappyMoods([]);
      }
    },err=>{
      setLoading(false)
    });}
  };

  const handleFromDate = (event: SelectChangeEvent) => {
    setFromDate(event.target.value as string);
  };

  const handleToDate = (event: SelectChangeEvent) => {
    setToDate(event.target.value as string);
  };

  const series = [
    //data on the y-axis
    {
      name: 'Sad',
      data: sadMoods,
    },
    {
      name: 'Neutral',
      data: neutralMoods,
    },
    {
      name: 'Happy',
      data: happyMoods,
    },
  ];

  const options: ApexOptions = {
    //data on the x-axis
    xaxis: {
      categories: months,
    },
    yaxis: {
      max: 100,
    },
    chart: {
      type: 'area',
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
    colors: ['#EE7538', '#2C69A1', '#34A853'],
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
      curve: 'smooth',
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      },
    },
    grid: {
      show: true,
      borderColor: '#CCCCCC',
      strokeDashArray: 0,
      position: 'front',
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
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 40,
    },
  };

  return (
    
    <>
  {loading?<CircularProgress />:


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
            <Link to={path + '/analytics/'}>Analytics </Link>&nbsp;\ Count
            Sentiments - Mood
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
              label="Sentiments - Mood"
              style={{ color: '#2C69A1', marginLeft: '16px' }}
            />
          </Grid>
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

          {/* Percentage */}
          <Grid
            item
            xs={12}
            sx={{
              padding: '0px !important',
              marginTop: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <H4RegularTypography label={happyMoodPercentage + '%'} />
              <BodyRegularTypography label="Happy" />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <H4RegularTypography label={neutralMoodPercentage + '%'} />
              <BodyRegularTypography label="Neutral" />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <H4RegularTypography label={sadMoodPercentage + '%'} />
              <BodyRegularTypography label="Sad" />
            </Box>
          </Grid>
          {/* Chart  */}
          <Grid
            item
            xs={12}
            sx={{
              padding: '0px !important',
              marginTop: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              width={getChartWidth(windowWidth.current)}
              height="500"
            />
          </Grid>
        </Grid>
      )}
    </>}

    </>
  );
}
