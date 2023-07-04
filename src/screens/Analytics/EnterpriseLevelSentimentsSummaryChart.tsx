import React, { useState } from 'react';
import { getParticipantsCount } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Box, Grid } from '@mui/material';
import {
  H2SemiBoldTypography,
} from '../../components/CustomizedTypography';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';

export default function EnterpriseLevelSentimentsSummaryChart() {
  const [participantsCounts, setParticipantsCounts] = useState<any>([]);
  const [averageParticipants, setAverageParticipants] = useState([]);
  const [months, setMonths] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetParticipantChartData();
  }, []);

  const handleGetParticipantChartData = async () => {
    // await getParticipantsCount().then(
    //   res => {
    //     if (res && res.result) {
    //       setParticipantsCounts(res.result);
    //       setAverageParticipants(
    //         res.result?.map((item: any) => item.averageParticipants)
    //       );
    //       setMonths(res.result?.map((item: any) => item.month));
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
      name: 'Total No. of Participants',
      data: averageParticipants,
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
    },
    title: {
      text: 'Avg. Participants per Month',
      style: {
        fontFamily: 'Poppins',
        fontWeight: '400',
        fontSize: '18px',
        color: '#4E4E4E',
      },
    },
    subtitle: {
      text: '154 Participants',
      style: {
        fontFamily: 'Poppins',
        fontWeight: '400',
        fontSize: '24px',
        color: '#000000',
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
          <Link to={'/analytics/'}>Analytics </Link>&nbsp;\ Overall summary
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
            label="Overall summary paragraph and word cloud"
            style={{ color: '#2C69A1', marginLeft: '12px' }}
          />
        </Box>
        {/* Chart */}
        <Grid container spacing={2} sx={{ marginTop: '48px' }}>
          <Grid item xs={12} sx={{ padding: '0px !important' }}>
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
