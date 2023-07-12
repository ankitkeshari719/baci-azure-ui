import React, { useState } from 'react';
import { getParticipantsCount } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import {
  Box,
  FormControl,
  Grid,
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
  BodyRegularTypography,
  ButtonLabelTypography,
  H2SemiBoldTypography,
  H4SemiBoldTypography,
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
    borderCollapse: 'collapse',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    border: '1px solid #CCC',
    minWidth: '200px',
    borderCollapse: 'collapse',
  },
}));

export default function AverageParticipantChart({
  dashboard,
  team,
}: {
  dashboard?: boolean;
  team: string;
}) {
  const [participantsCounts, setParticipantsCounts] = useState<any>([]);
  const [averageParticipants, setAverageParticipants] = useState([]);
  const [months, setMonths] = useState([]);
  const [fromDate, setFromDate] = useState<string>('10');
  const [toDate, setToDate] = useState<string>('16');
  const [selectedFromDate, setSelectedFromDate] = useState<string>();
  const [selectedToDate, setSelectedToDate] = useState<string>();
  const [totalAverageParticipants, setTotalAverageParticipants] =
    useState<number>();
  const navigate = useNavigate();
  const windowWidth = React.useRef(window.innerWidth);

  const getChartWidth = () => {
    switch (true) {
      case windowWidth.current <= 1051:
        return '400';
      case windowWidth.current > 1051 && windowWidth.current <= 1150:
        return '500';
      case windowWidth.current >= 1151 && windowWidth.current <= 1199:
        return '520';
      case windowWidth.current >= 1200 && windowWidth.current <= 1300:
        return '650';
      case windowWidth.current >= 1301 && windowWidth.current <= 1400:
        return '700';
      case windowWidth.current >= 1401 && windowWidth.current <= 1500:
        return '750';
      case windowWidth.current >= 1500:
        return '850';

      default:
        return '500';
    }
  };

  React.useEffect(() => {
    const tempSelectedFromDate = MONTH_SELECTORS.filter(
      monthSelector => monthSelector.id === Number(fromDate)
    );
    const tempSelectedToDate = MONTH_SELECTORS.filter(
      monthSelector => monthSelector.id === Number(toDate)
    );

    setSelectedFromDate(
      tempSelectedFromDate &&
        tempSelectedFromDate[0] &&
        tempSelectedFromDate[0].month
    );
    setSelectedToDate(
      tempSelectedToDate && tempSelectedToDate[0] && tempSelectedToDate[0].month
    );
  }, [fromDate, toDate]);

  React.useEffect(() => {
    handleGetParticipantChartData();
  }, [fromDate, toDate]);

  const handleGetParticipantChartData = async () => {
    await getParticipantsCount(fromDate, toDate, team).then(
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
          setTotalAverageParticipants(Math.round(temp / res.result.length));
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
      toolbar: {
        show: true,
        tools: {
          download: false,
        },
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
    <>
      {dashboard ? (
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          width="550"
          height="370"
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
            <Link to={'/facilitator/analytics/'}>Analytics </Link>&nbsp;\ Count
            of participants
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
              onClick={() => navigate('/facilitator/analytics/')}
            />
            <H2SemiBoldTypography
              label="Count of all participants over time"
              style={{ color: '#2C69A1', marginLeft: '16px' }}
            />
          </Grid>
          {/* Table and Selector */}
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            sx={{
              padding: '0px !important',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              marginTop: '24px',
            }}
          >
            {/* Selector */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'start',
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
                sx={{
                  minWidth: 120,
                  marginLeft: '16px',
                  marginRight: '16px',
                }}
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
              <Box sx={{ minWidth: 120, marginLeft: '24px' }}>
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
            <Box sx={{ marginTop: '32px' }}>
              <TableContainer style={{ borderCollapse: 'collapse' }}>
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
            </Box>
          </Grid>
          {/* Chart  */}
          <Grid
            item
            xs={12}
            md={6}
            lg={7}
            sx={{
              padding: '0px !important',
              marginTop: '16px',
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
            }}
          >
            <Box>
              <Grid item xs={12} sx={{ padding: '0px !important' }}>
                <BodyRegularTypography
                  label="Avg. Participants per Month"
                  style={{ color: '#343434' }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ padding: '0px !important', marginTop: '10px' }}
              >
                <H4SemiBoldTypography
                  label={totalAverageParticipants + ' Participants'}
                  style={{ color: '#343434' }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ padding: '0px !important', marginTop: '10px' }}
              >
                <BodyRegularTypography
                  label={selectedFromDate + ' To ' + selectedToDate}
                  style={{ color: '#343434' }}
                />
              </Grid>
            </Box>
            <ReactApexChart
              options={options}
              series={series}
              type="area"
              width={getChartWidth()}
              height="700"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
