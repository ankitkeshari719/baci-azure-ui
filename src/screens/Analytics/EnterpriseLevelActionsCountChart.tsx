import React, { useState } from 'react';
import { getEnterpriseLevelActionsCount } from '../../helpers/msal/services';
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
} from '@mui/material';
import {
  ButtonLabelTypography,
  H2SemiBoldTypography,
} from '../../components/CustomizedTypography';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'heroicons-react';
import { MONTH_SELECTORS, MenuProps } from './const';

export default function EnterpriseLevelActionsCountChart({
  dashboard,
}: {
  dashboard?: boolean;
}) {
  const [enterpriseLevelActions, setEnterpriseLevelActions] = useState<any>([]);
  const [assignedActions, setAssignedActions] = useState([]);
  const [completedActions, setCompletedActions] = useState([]);
  const [months, setMonths] = useState([]);
  const [fromDate, setFromDate] = useState<string>('10');
  const [toDate, setToDate] = useState<string>('15');
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
    handleEnterpriseTeamLevelActionsCountData();
  }, [fromDate, toDate]);

  const handleEnterpriseTeamLevelActionsCountData = async () => {
    await getEnterpriseLevelActionsCount(fromDate, toDate).then(
      res => {
        if (res && res.result) {
          setEnterpriseLevelActions(res.result);
          setAssignedActions(res.result?.map((item: any) => item.assigned));
          setCompletedActions(res.result?.map((item: any) => item.completed));
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
      name: 'Completed Actions',
      data: completedActions,
    },
    {
      name: 'Action Pending',
      data: assignedActions,
    },
  ];

  const options: ApexOptions = {
    //data on the x-axis
    xaxis: {
      categories: months,
    },
    chart: {
      id: 'bar',
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
      width: 1,
      colors: ['#fff'],
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
    colors: ['#2C69A1', '#159ADD'],
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      offsetX: 40,
    },
    fill: {
      opacity: 1,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
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
          type="bar"
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
            <Link to={'/analytics/'}>Analytics </Link>&nbsp;\ Count of actions
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
              onClick={() => navigate('/analytics/')}
            />
            <H2SemiBoldTypography
              label="Count of actions (Assigned vs Completed) all teams"
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
              type="bar"
              width={getChartWidth()}
              height="500"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
}
