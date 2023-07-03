import React, { useState } from 'react';
import { getRetrosCount } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import { H2SemiBoldTypography } from '../../components/CustomizedTypography';
import * as Icons from 'heroicons-react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F0F0F0',
    color: '#000000',
    border: '1px solid #CCC',
    minWidth: '200px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    border: '1px solid #CCC',
    minWidth: '200px',
  },
}));

export default function AverageRetroChart() {
  const [retrosCounts, setRetrosCounts] = useState<any>([]);
  const [averageRetros, setAverageRetros] = useState([]);
  const [months, setMonths] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetRetroChartData();
  }, []);

  const handleGetRetroChartData = async () => {
    await getRetrosCount().then(
      res => {
        if (res && res.result) {
          setRetrosCounts(res.result);
          setAverageRetros(res.result?.map((item: any) => item.averageRetros));
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
      name: 'Total No. of Retros',
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
    },
    title: {
      text: 'Avg. Sessions over time per month',
      style: {
        fontFamily: 'Poppins',
        fontWeight: '400',
        fontSize: '18px',
        color: '#4E4E4E',
      },
    },
    subtitle: {
      text: '61 Sessions',
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

  return (
    <>
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
            <Link to={'/analytics/'}>Analytics </Link>&nbsp;\ Count of all Sessions
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
              label="Count of all sessions"
              style={{ color: '#2C69A1', marginLeft: '12px' }}
            />
          </Box>
          {/* Chart and table */}
          <Grid container spacing={2} sx={{ marginTop: '48px' }}>
            <Grid item xs={12} md={4} sx={{ padding: '0px !important' }}>
              <TableContainer>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Month</StyledTableCell>
                    <StyledTableCell align="left">
                      No. of Retros
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {retrosCounts.map((retrosCount: any) => {
                    return (
                      <TableRow key={retrosCount.id}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {retrosCount.month}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {retrosCount.averageRetros}
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </TableContainer>
            </Grid>
            <Grid item xs={12} md={8}>
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
    </>
  );
}
