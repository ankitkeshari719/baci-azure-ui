import React, { useState } from 'react';
import { getEnterpriseLevelSentimentsMoods } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  Box,
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
import { MONTH_SELECTORS, MenuProps } from './const';
import { GlobalContext } from '../../contexts/GlobalContext';

export default function EnterpriseLevelSentimentsMoodsChart({

  dashboard,
  team
}: {

  dashboard?: boolean;
  team: string;
}) {
  const [moods, setMoods] = useState<any>([]);
  const [sadMoods, setSadMoods] = useState([]);
  const [neutralMoods, setNeutralMoods] = useState([]);
  const [happyMoods, setHappyMoods] = useState([]);
  const [sadMoodPercentage, setSadMoodPercentage] = useState<number>();
  const [neutralMoodPercentage, setNeutralMoodPercentage] = useState<number>();
  const [happyMoodPercentage, setHappyMoodPercentage] = useState<number>();
  const [months, setMonths] = useState([]);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [fromDate, setFromDate] = useState<string>(global.chartStartDate?global.chartStartDate:'10');
  const [toDate, setToDate] = useState<string>(global.chartEndDate?global.chartEndDate: '16');
  const navigate = useNavigate();
  const windowWidth = React.useRef(window.innerWidth);

  const getChartWidth = () => {
    switch (true) {
      case windowWidth.current <= 1051:
        return '700';
      case windowWidth.current > 1051 && windowWidth.current <= 1150:
        return '750';
      case windowWidth.current >= 1151 && windowWidth.current <= 1199:
        return '800';
      case windowWidth.current >= 1200 && windowWidth.current <= 1300:
        return '900';
      case windowWidth.current >= 1301 && windowWidth.current <= 1400:
        return '1000';
      case windowWidth.current >= 1401 && windowWidth.current <= 1500:
        return '1050';
      case windowWidth.current >= 1500:
        return '1100';
      default:
        return '500';
    }
  };


  React.useEffect(()=>{
   
    const fromDateInput = global.chartStartDate;
    const toDateInput=global.chartEndDate;
    if(fromDateInput!=""&&fromDateInput!=undefined&&fromDateInput!=null){
      setFromDate(fromDateInput);
    }
     if(toDateInput!=""&&toDateInput!=undefined&&toDateInput!=null){
      setToDate(toDateInput);
    }
  },[
    global.chartStartDate,
    global.chartEndDate
    
    
  ])


  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentsMoods();
  }, [fromDate, toDate]);

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentsMoods();
  }, [team]);

  const handleGetEnterpriseLevelSentimentsMoods = async () => {
    await getEnterpriseLevelSentimentsMoods(fromDate, toDate,team).then(
      res => {
        if (res && res.result) {
          setMoods(res.result);
          setSadMoods(
            res.result?.map((item: any) =>
              Math.round(
                (item.sad / (item.sad + item.neutral + item.happy)) * 100
              )
            )
          );
          setNeutralMoods(
            res.result?.map((item: any) =>
              Math.round(
                (item.neutral / (item.sad + item.neutral + item.happy)) * 100
              )
            )
          );
          setHappyMoods(
            res.result?.map((item: any) =>
              Math.round(
                (item.happy / (item.sad + item.neutral + item.happy)) * 100
              )
            )
          );
          setMonths(res.result?.map((item: any) => item.month));
          let temp_1 = 0;
          let temp_2 = 0;
          let temp_3 = 0;
          res.result.map((item: any) => {
            temp_1 = temp_1 + item.sad;
            temp_2 = temp_2 + item.neutral;
            temp_3 = temp_3 + item.happy;
          });
          const sadData = (temp_1 / (temp_1 + temp_2 + temp_3)) * 100;
          const neutralData = (temp_2 / (temp_1 + temp_2 + temp_3)) * 100;
          const happyData = (temp_3 / (temp_1 + temp_2 + temp_3)) * 100;
          setSadMoodPercentage(Math.round(sadData));
          setNeutralMoodPercentage(Math.round(neutralData));
          setHappyMoodPercentage(Math.round(happyData));
        }
      },
      err => {
        console.log('err', err);
      }
    );
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
            <Link to={'/facilitator/analytics/'}>Analytics </Link>&nbsp;\
            Participants Mood
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
              label="Participants Mood"
              style={{ color: '#2C69A1', marginLeft: '16px' }}
            />
          </Grid>
          {/* Selector */}
          <Grid
            item
            xs={12}
            sx={{
              padding: '0px !important',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '16px',
            }}
          >
            {/* Select Range Title */}
            <ButtonLabelTypography
              label="Select Range:"
              style={{
                color: '#343434',
              }}
            />
            {/* From Date */}
            <Box
              sx={{ minWidth: 240, marginLeft: '16px', marginRight: '16px' }}
            >
              <FormControl fullWidth>
                <Select
                  sx={{
                    fieldset: {
                      border: 'none',
                      opacity: 1,
                      color: '#4E4E4E',
                    },
                  }}
                  labelId="from-Date"
                  id="from_date"
                  value={fromDate}
                  label="From"
                  onChange={handleFromDate}
                  IconComponent={props => (
                    <Icons.ChevronDownOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        top: 'calc(50% - 0.8em)',
                      }}
                      {...props}
                    />
                  )}
                  MenuProps={MenuProps}
                >
                  {MONTH_SELECTORS.map(month_selector => {
                    return (
                      <MenuItem
                        value={month_selector.id}
                        key={month_selector.id}
                      >
                        {month_selector.month}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
            <ButtonLabelTypography
              label="To"
              style={{
                color: '#343434',
              }}
            />
            {/*To Date */}
            <Box sx={{ minWidth: 240, marginLeft: '16px' }}>
              <FormControl fullWidth>
                <Select
                  sx={{
                    fieldset: {
                      border: 'none',
                      opacity: 1,
                      color: '#4E4E4E',
                    },
                  }}
                  labelId="to-Date"
                  id="to_date"
                  value={toDate}
                  label="To"
                  onChange={handleToDate}
                  IconComponent={props => (
                    <Icons.ChevronDownOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        position: 'absolute',
                        top: 'calc(50% - 0.8em)',
                      }}
                      {...props}
                    />
                  )}
                  MenuProps={MenuProps}
                >
                  {MONTH_SELECTORS.map(month_selector => {
                    return (
                      <MenuItem
                        value={month_selector.id}
                        key={month_selector.id}
                      >
                        {month_selector.month}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Grid>
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
              width={getChartWidth()}
              height="500"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
