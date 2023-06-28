import React, { useState } from 'react';
import { getDummyChartData } from '../../helpers/msal/services';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';

export default function DummyChart() {
  const [averageTemp, setAverageTemp] = useState([]);
  const [date, setDate] = useState([]);

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
    <>
      <Chart options={options} series={series} type="bar" width="650" />
      <Chart options={options} series={series} type="line" width="650" />
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        width="650"
      />
    </>
  );
}
