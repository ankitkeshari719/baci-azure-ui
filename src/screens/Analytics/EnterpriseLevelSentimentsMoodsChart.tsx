import React, { useState } from 'react';
import { getEnterpriseLevelSentimentsMoods } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ButtonLabelTypography, H2SemiBoldTypography } from '../../components/CustomizedTypography';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import { MONTH_SELECTORS } from './const';

export default function EnterpriseLevelSentimentsMoodsChart() {
  const [moods, setMoods] = useState<any>([]);
  const [sadMoods, setSadMoods] = useState([]);
  const [neutralMoods, setNeutralMoods] = useState([]);
  const [happyMoods, setHappyMoods] = useState([]);
  const [months, setMonths] = useState([]);
  const [fromDate, setFromDate] = useState<string>('10');
  const [toDate, setToDate] = useState<string>('15');
  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentsMoods();
  }, [fromDate, toDate]);

  const handleGetEnterpriseLevelSentimentsMoods = async () => {
    await getEnterpriseLevelSentimentsMoods(fromDate, toDate).then(
      res => {
        if (res && res.result) {
          setMoods(res.result);
          setSadMoods(res.result?.map((item: any) => item.sad));
          setNeutralMoods(res.result?.map((item: any) => item.neutral));
          setHappyMoods(res.result?.map((item: any) => item.happy));
          setMonths(res.result?.map((item: any) => item.month));
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
    <Box sx={{ overflowY: 'auto' }} height="calc(var(--app-height))">
      <Box sx={{ margin: '48px' }}>
        {/* Route Path */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <Link to={'/analytics/'}>Analytics </Link>&nbsp;\ Participants Mood
        </Box>
        {/* Back Button & Chart Title */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: '12px',
          }}
        >
          <Icons.ArrowCircleLeftOutline
            size={32}
            style={{
              cursor: 'pointer',
              color: '#159ADD',
            }}
            onClick={() => navigate('/analytics/')}
          />
          <H2SemiBoldTypography
            label="Participants Mood"
            style={{ color: '#2C69A1', marginLeft: '12px' }}
          />
        </Box>
        {/* Selector */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Select Range Title */}
          <ButtonLabelTypography
            label="Select Range"
            style={{
              color: '#343434',
            }}
          />
          {/* From Date */}
          <Box sx={{ minWidth: 120, marginLeft: '8px', marginRight: '8px' }}>
            <FormControl fullWidth>
              <InputLabel id="from-Date">From</InputLabel>
              <Select
                labelId="from-Date"
                id="from_date"
                value={fromDate}
                label="From"
                onChange={handleFromDate}
              >
                {MONTH_SELECTORS.map(month_selector => {
                  return (
                    <MenuItem value={month_selector.id} key={month_selector.id}>
                      {month_selector.month}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          {/*To Date */}
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="to-Date">To</InputLabel>
              <Select
                labelId="to-Date"
                id="to_date"
                value={toDate}
                label="To"
                onChange={handleToDate}
              >
                {MONTH_SELECTORS.map(month_selector => {
                  return (
                    <MenuItem value={month_selector.id} key={month_selector.id}>
                      {month_selector.month}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
        {/* Chart */}
        <Grid container spacing={2} sx={{ marginTop: '48px' }}>
          <Grid
            item
            xs={12}
            sx={{
              padding: '0px !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              width="1200"
              height="500"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
