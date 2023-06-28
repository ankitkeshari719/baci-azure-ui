import React, { useState } from 'react';
import { getEnterpriseLevelSentimentsMoods } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Box, Grid } from '@mui/material';
import {
  H1RegularTypography,
  H3RegularTypography,
} from '../../components/CustomizedTypography';
import { ContainedButton } from '../../components';
import { useNavigate } from 'react-router-dom';

export default function EnterpriseLevelSentimentsMoodsChart() {
  const [moods, setMoods] = useState<any>([]);
  const [sadMoods, setSadMoods] = useState([]);
  const [neutralMoods, setNeutralMoods] = useState([]);
  const [happyMoods, setHappyMoods] = useState([]);
  const [months, setMonths] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentsMoods();
  }, []);

  const handleGetEnterpriseLevelSentimentsMoods = async () => {
    await getEnterpriseLevelSentimentsMoods().then(
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
    chart: {
      type: 'area',
      height: 350,
      stacked: true,
      // stackType: '100%',
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
      strokeDashArray: 3,
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
      position: 'top',
      horizontalAlign: 'left',
      offsetX: 40,
    },
  };

  return (
    <Box sx={{ overflowY: 'auto' }} height="calc(var(--app-height))">
      <Box sx={{ margin: '48px' }}>
        {/* Analytics Title */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <H1RegularTypography label="Analytics" />
        </Box>
        {/* Back Button */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <ContainedButton
            id="go_back_to_analytics"
            name="Back"
            onClick={() => navigate('/analytics/')}
            size={'small'}
          />
        </Box>
        {/* Chart Title */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '48px',
          }}
        >
          <H3RegularTypography
            label="Analytics - Enterprise Level - Sentiments - Moods."
            style={{ color: '#767676' }}
          />
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
              width="850"
              height="464"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
