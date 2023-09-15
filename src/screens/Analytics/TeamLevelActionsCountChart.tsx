import React, { useState } from 'react';
import { getTeamLevelActionsCounts } from '../../helpers/msal/services';
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
import { GlobalContext } from '../../contexts/GlobalContext';
import {
  BASIC,
  ENTERPRISE,
  ENTERPRISE_ADMIN,
} from '../../constants/applicationConst';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#F0F0F0',
    color: '#000000',
    border: '1px solid #CCC',
    minWidth: '130px',
    borderCollapse: 'collapse',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
    border: '1px solid #CCC',
    minWidth: '130px',
    borderCollapse: 'collapse',
  },
}));

export default function TeamLevelActionsCountChart({
  dashboard,
}: {
  dashboard?: boolean;
}) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [teamLevelActions, setTeamLevelActions] = useState<any>([]);
  const [assignedActions, setAssignedActions] = useState<any>([]);
  const [completedActions, setCompletedActions] = useState<any>([]);
  const [completedPercentage, setCompletedPercentage] = useState<Number>();
  const [months, setMonths] = useState<any>([]);
  const [fromDate, setFromDate] = useState<string>(
    global.chartStartDate ? global.chartStartDate : '10'
  );
  const [toDate, setToDate] = useState<string>(
    global.chartEndDate ? global.chartEndDate : '16'
  );
  const [selectedFromDate, setSelectedFromDate] = useState<string>();
  const [selectedToDate, setSelectedToDate] = useState<string>();
  const navigate = useNavigate();
  const windowWidth = React.useRef(window.innerWidth);

  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [path, setPath] = React.useState('');

  React.useEffect(() => {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      setPath('basic');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      setPath('enterprise');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      setPath('enterpriseAdmin');
    }
  }, [tempLocalUserData]);

  const getChartWidth = () => {
    switch (true) {
      case windowWidth.current <= 1051:
        return '400';
      case windowWidth.current > 1051 && windowWidth.current <= 1150:
        return '450';
      case windowWidth.current >= 1151 && windowWidth.current <= 1199:
        return '500';
      case windowWidth.current >= 1200 && windowWidth.current <= 125:
        return '520';
      case windowWidth.current >= 1251 && windowWidth.current <= 1300:
        return '550';
      case windowWidth.current >= 1301 && windowWidth.current <= 1400:
        return '600';
      case windowWidth.current >= 1401 && windowWidth.current <= 1500:
        return '650';
      case windowWidth.current >= 1500:
        return '700';

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
    handleGetTeamLevelActionsCountsData();
  }, [fromDate, toDate]);

  function removeDuplicates(arr: string[]) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }

  const handleGetTeamLevelActionsCountsData = async () => {
    await getTeamLevelActionsCounts(fromDate, toDate).then(
      res => {
        if (res && res.result) {
          const teamsData = res.result.map((item: any, index: number) => {
            return item.teams;
          });
          let nameArray = [];
          let assignedArray = [];
          let completedArray = [];
          let teamNameArray = [];
          let tempTeamLevelActions = [];
          let tempCompletedPercentage = 0;
          for (let i = 0; i < teamsData.length; i++) {
            for (let j = 0; j < teamsData[i].length; j++) {
              nameArray.push(teamsData[i][j].name);
            }
          }
          teamNameArray = removeDuplicates(nameArray);
          for (let i = 0; i < teamNameArray.length; i++) {
            assignedArray.push(0);
            completedArray.push(0);
          }
          for (let i = 0; i < teamNameArray.length; i++) {
            for (let j = 0; j < teamsData.length; j++) {
              for (let k = 0; k < teamsData[j].length; k++) {
                if (teamsData[j][k].name === teamNameArray[i]) {
                  assignedArray[i] =
                    assignedArray[i] + teamsData[j][k].assigned;
                  completedArray[i] =
                    completedArray[i] + teamsData[j][k].completed;
                }
              }
            }
          }
          setAssignedActions(assignedArray);
          setCompletedActions(completedArray);
          setMonths(teamNameArray);

          for (let i = 0; i < teamNameArray.length; i++) {
            tempTeamLevelActions.push({
              team: teamNameArray[i],
              assigned: assignedArray[i],
              completed: completedArray[i],
              completedPercentage: Math.round(
                (completedArray[i] / (assignedArray[i] + completedArray[i])) *
                  100
              ),
            });
          }
          setTeamLevelActions(tempTeamLevelActions);

          for (let i = 0; i < completedArray.length; i++) {
            tempCompletedPercentage =
              tempCompletedPercentage +
              (completedArray[i] / (completedArray[i] + assignedArray[i])) *
                100;
          }
          setCompletedPercentage(
            Math.round(tempCompletedPercentage / teamNameArray.length)
          );
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };
  React.useEffect(() => {
    const fromDateInput = global.chartStartDate;
    const toDateInput = global.chartEndDate;
    if (
      fromDateInput != '' &&
      fromDateInput != undefined &&
      fromDateInput != null
    ) {
      setFromDate(fromDateInput);
    }
    if (toDateInput != '' && toDateInput != undefined && toDateInput != null) {
      setToDate(toDateInput);
    }
  }, [global.chartStartDate, global.chartEndDate]);

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
            <Link to={path + '/analytics/'}>Analytics </Link>&nbsp;\ Count Level
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
              onClick={() => navigate(-1)}
            />
            <H2SemiBoldTypography
              label="Count of Team Actions (Assigned vs Completed)"
              style={{ color: '#2C69A1', marginLeft: '16px' }}
            />
          </Grid>
          {/* Table with Selector*/}
          <Grid
            item
            xs={12}
            md={6}
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
                    <StyledTableCell align="center">Team</StyledTableCell>
                    <StyledTableCell align="center">Pending</StyledTableCell>
                    <StyledTableCell align="center">Completed</StyledTableCell>
                    <StyledTableCell align="center">
                      Completed %
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teamLevelActions.map((teamLevelAction: any) => {
                    return (
                      <TableRow key={teamLevelActions.id}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {teamLevelAction.team}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {teamLevelAction.assigned}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {teamLevelAction.completed}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {teamLevelAction.completedPercentage}
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
                  label="Avg. Actions Completed"
                  style={{ color: '#343434' }}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ padding: '0px !important', marginTop: '10px' }}
              >
                <H4SemiBoldTypography
                  label={completedPercentage + '%'}
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
