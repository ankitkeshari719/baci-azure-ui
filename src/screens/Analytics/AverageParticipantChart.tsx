import React, { useState } from 'react';
import { getParticipantsCount } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  Box,
  Grid,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
} from '@mui/material';
import {
  H1RegularTypography,
  H3RegularTypography,
} from '../../components/CustomizedTypography';
import { ContainedButton } from '../../components';
import { useNavigate } from 'react-router-dom';

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

export default function AverageParticipantChart() {
  const [participantsCounts, setParticipantsCounts] = useState<any>([]);
  const [averageParticipants, setAverageParticipants] = useState([]);
  const [months, setMonths] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetParticipantChartData();
  }, []);

  const handleGetParticipantChartData = async () => {
    await getParticipantsCount().then(
      res => {
        if (res && res.result) {
          setParticipantsCounts(res.result);
          setAverageParticipants(
            res.result?.map((item: any) => item.averageParticipants)
          );
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
    colors:['#0E9CFF'],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
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
            label="Analytics - Enterprise Level - Count of all participants over time."
            style={{ color: '#767676' }}
          />
        </Box>
        {/* Chart and table */}
        <Grid container spacing={2} sx={{ marginTop: '48px' }}>
          <Grid item xs={12} md={8} sx={{ padding: '0px !important' }}>
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              width="850"
              height="464"
            />
          </Grid>
          <Grid item xs={12} md={4} sx={{ padding: '0px !important' }}>
            <TableContainer>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Month</StyledTableCell>
                  <StyledTableCell align="center">
                    Total No. of Participants
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participantsCounts.map((participantsCount: any) => {
                  return (
                    <TableRow key={participantsCount.id}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        align="center"
                      >
                        {participantsCount.month}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {participantsCount.averageParticipants}
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
