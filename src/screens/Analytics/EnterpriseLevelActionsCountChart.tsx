import React, { useState } from 'react';
import { getEnterpriseLevelActionsCount } from '../../helpers/msal/services';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Box, Grid } from '@mui/material';
import {
  H1RegularTypography,
  H3RegularTypography,
} from '../../components/CustomizedTypography';
import { ContainedButton } from '../../components';
import { useNavigate } from 'react-router-dom';

export default function EnterpriseLevelActionsCountChart() {
  const [enterpriseLevelActions, setEnterpriseLevelActions] = useState<any>([]);
  const [assignedActions, setAssignedActions] = useState([]);
  const [completedActions, setCompletedActions] = useState([]);
  const [months, setMonths] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    handleEnterpriseTeamLevelActionsCountData();
  }, []);

  const handleEnterpriseTeamLevelActionsCountData = async () => {
    await getEnterpriseLevelActionsCount().then(
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
      name: 'Assigned',
      data: assignedActions,
    },
    {
      name: 'Completed',
      data: completedActions,
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
      //   stackType: '100%',
      zoom: {
        enabled: false,
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
    colors: ['#2C69A1', '#159ADD'],
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
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
            label="Analytics - Enterprise Level - Count of actions (assigned vs completed) all teams."
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
              type="bar"
              width="850"
              height="464"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
