import React, { useState } from 'react';
import { getParticipantsCount } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
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
  ButtonLabelTypography,
  H2SemiBoldTypography,
} from '../../components/CustomizedTypography';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import { MONTH_SELECTORS, MenuProps } from './const';

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
  const [fromDate, setFromDate] = useState<string>('10');
  const [toDate, setToDate] = useState<string>('15');
  const [totalAverageParticipants, setTotalAverageParticipants] =
    useState<number>();
  const navigate = useNavigate();

  React.useEffect(() => {
    handleGetParticipantChartData();
  }, [fromDate, toDate]);

  const handleGetParticipantChartData = async () => {
    await getParticipantsCount(fromDate, toDate).then(
      res => {
        if (res && res.result) {
          setParticipantsCounts(res.result);
          setAverageParticipants(
            res.result?.map((item: any) => item.averageParticipants)
          );
          setMonths(res.result?.map((item: any) => item.month));
          let temp = 0;
          res.result.map((item: any) => {
            temp = temp + item.averageParticipants;
          });
          setTotalAverageParticipants(temp);
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
      text: totalAverageParticipants + ' Participants',
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
    colors: ['#0E9CFF'],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    },
  };

  const handleFromDate = (event: SelectChangeEvent) => {
    setFromDate(event.target.value as string);
  };

  const handleToDate = (event: SelectChangeEvent) => {
    setToDate(event.target.value as string);
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
          <Link to={'/analytics/'}>Analytics </Link>&nbsp;\ Count of
          participants
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
            label="Count of all participants over time"
            style={{ color: '#2C69A1', marginLeft: '12px' }}
          />
        </Box>
        {/* Chart and table */}
        <Grid container spacing={2} sx={{ marginTop: '48px' }}>
          <Grid item xs={12} md={4} sx={{ padding: '0px !important' }}>
            {/* Selector */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start',
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
                sx={{ minWidth: 120, marginLeft: '16px', marginRight: '16px' }}
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
              <Box sx={{ minWidth: 120, marginLeft: '16px' }}>
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
            </Box>
            {/* Table */}
            <Box sx={{ marginTop: '48px' }}>
              <TableContainer>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Month</StyledTableCell>
                    <StyledTableCell align="left">
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
            </Box>
          </Grid>
          <Grid item xs={12} md={8} sx={{ padding: '0px !important' }}>
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              width="850"
              height="500"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
