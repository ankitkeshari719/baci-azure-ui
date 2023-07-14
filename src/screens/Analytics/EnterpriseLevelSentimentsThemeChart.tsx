import React, { useState } from 'react';
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

export default function EnterpriseLevelSentimentsThemeChart({
  dashboard,
  team,
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
  const [fromDate, setFromDate] = useState<string>('10');
  const [toDate, setToDate] = useState<string>('16');
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

  React.useEffect(() => {
    handleGetEnterpriseLevelSentimentsThemes();
  }, [fromDate, toDate]);

  const handleGetEnterpriseLevelSentimentsThemes = async () => {};

  const handleFromDate = (event: SelectChangeEvent) => {
    setFromDate(event.target.value as string);
  };

  const handleToDate = (event: SelectChangeEvent) => {
    setToDate(event.target.value as string);
  };

  const series = [
    //data on the y-axis
    {
      name: 'Work Prioritisation',
      data: [15, 10, 75],
    },
    {
      name: 'Openness to Feedback',
      data: [15, 10, 75],
    },
    {
      name: 'Decision Making',
      data: [15, 10, 75],
    },
    {
      name: 'Structure & Capabilities',
      data: [15, 10, 75],
    },
    {
      name: 'People & Resources',
      data: [15, 10, 75],
    },
    {
      name: 'Individual & Team',
      data: [15, 10, 75],
    },
    {
      name: 'Work Technology & Tools',
      data: [15, 30, 55],
    },
    {
      name: 'External Environment & Condition',
      data: [10, 65, 25],
    },
  ];

  const options: ApexOptions = {
    //data on the x-axis
    xaxis: {
      categories: ['Sad', 'Neutral', 'Happy'],
    },
    chart: {
      type: 'heatmap',
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
            <Link to={'/facilitator/analytics/'}>Analytics </Link>&nbsp;\ Key
            themes heatmap
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
              label="Key themes heatmap"
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
              <H4RegularTypography label={sadMoodPercentage + '%'} />
              <BodyRegularTypography label="Sad" />
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
              <H4RegularTypography label={happyMoodPercentage + '%'} />
              <BodyRegularTypography label="Happy" />
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
              type="heatmap"
              width={getChartWidth()}
              height="500"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
