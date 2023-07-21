import React, { useState } from 'react';
import { getDummyChartData } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { H1RegularTypography } from '../../components/CustomizedTypography';
import { Box } from '@mui/material';
import * as Icons from 'heroicons-react';
import { useNavigate } from 'react-router-dom';

export default function DummyChart() {
  const [averageTemp, setAverageTemp] = useState([]);
  const [date, setDate] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetDummyChartData();
  }, []);

  const handleGetDummyChartData = async () => {
    await getDummyChartData().then(
      res => {
        if (res && res.result) {
          setAverageTemp(res.result?.map((item: any) => item.average_temp));
          setDate(res.result?.map((item: any) => item.date));
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
      name: 'Temperature in Celsius',
      data: averageTemp,
    },
  ];

  const options = {
    //data on the x-axis
    chart: { id: 'bar-chart' },
    xaxis: {
      categories: date,
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '48px',
      }}
    >
      {/* Back Button & Chart Title */}
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
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
        <H1RegularTypography label="Dummy Chart for R&D" />
      </Box>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        width="650"
      />
    </Box>
  );
}
