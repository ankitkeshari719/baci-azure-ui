import {
  Box,
  Button,
  createTheme,
  Grid,
  SelectChangeEvent,
  ThemeProvider,
} from '@mui/material';

import * as React from 'react';

import ReactToPrint from 'react-to-print';

import * as Icons from 'heroicons-react';

import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  ButtonLabelTypography,
  CaptionRegularTypography,
  CaptionSemiBoldTypography,
  H1RegularTypography,
  H4RegularTypography,
  H4SemiBoldTypography,
  H6RegularTypography,
  H6SemiBoldTypography,
  TinyTextSemiBoldTypography,
  TinyTextTypography,
} from '../../CustomizedTypography';

import commonStyles from './../../../style.module.scss';

import './EnterpriseDashboard.scss';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

import Avatar from '../Avatar';

import AverageParticipantChart from '../../../screens/Analytics/AverageParticipantChart';

import EnterpriseLevelActionsCountChart from '../../../screens/Analytics/EnterpriseLevelActionsCountChart';

import { useNavigate } from 'react-router-dom';

import EnterpriseLevelSentimentsMoodsChart from '../../../screens/Analytics/EnterpriseLevelSentimentsMoodsChart';

import TeamLevelActionsCountChart from '../../../screens/Analytics/TeamLevelActionsCountChart';

import { retro } from '../../../constants/DemoConst';
import { TextButton } from '../../CustomizedButton/TextButton';

import EnterpriseLevelSentimentsThemeChart from '../../../screens/Analytics/EnterpriseLevelSentimentsThemeChart';
import { useState } from 'react';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import EnterpriseLevelSentimentsSummaryChart from '../../../screens/Analytics/EnterpriseLevelSentimentsSummaryChart';
import moment from 'moment';
import { MONTH_SELECTORS } from '../../../screens/Analytics/const';
import {
  getParticipantsCount,
  getRetrosCount,
} from '../../../helpers/msal/services';
import { OutlinedButton } from '../../CustomizedButton/OutlinedButton';
import AverageRetroChart from '../../../screens/Analytics/AverageRetroChart';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import DateSelector from './DateSelector';
import TeamSelector from '../TeamSelector';
import { BASIC, ENTERPRISE } from '../../../constants/applicationConst';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';

const theme = createTheme({
  palette: {
    primary: {
      main: commonStyles.PrimaryMain,
    },

    secondary: {
      // This is green.A700 as hex.

      main: commonStyles.secondaryMain,
    },
  },
});

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

function EnterpriseDashboard() {
  const navigate = useNavigate();

  const [hoverOnMenu, setHoverOnMenu] = React.useState<Boolean>(false);

  const [hoverIndex, setHoverIndex] = React.useState<number>(0);

  const [selectId, setSelectedId] = React.useState<string>('0');

  const retroList = retro;

  let componentRef = React.useRef(null);

  const currentDate = moment(new Date()).format('Do MMM YYYY');

  const [path, setPath] = React.useState(
    location.pathname.includes('enterprise')
      ? 'enterprise'
      : location.pathname.includes('enterprise')
      ? 'enterprise'
      : 'enterprise'
  );

  const [global, dispatch] = React.useContext(GlobalContext);

  // const [fromDate, setFromDate] = useState<string>(
  //   global.chartStartDate ? global.chartStartDate : '10'
  // );

  const [fromDate, setFromDate] = useState<string>(
    global.chartStartDate
      ? global.chartStartDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          new Date().getMonth().toString().slice(-2)
  );
  const [toDate, setToDate] = useState<string>(
    global.chartEndDate
      ? global.chartEndDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          (new Date().getMonth() + 1).toString().slice(-2)
  );

  // const [toDate, setToDate] = useState<string>(
  //   global.chartEndDate ? global.chartEndDate : '16'
  // );

  const [fromDateString, setFromDateString] = useState<string>('');

  const [toDateString, setToDateString] = useState<string>('');

  const [totalSessions, setTotalSessions] = useState<Number>();
  const [totalParticipants, setTotalParticipants] = useState<Number>();

  const menuList = [
    {
      id: '0',

      label: 'All Teams',

      actions: 'VIEW 15 ACTIONS',

      retros: [
        retroList[2],

        retroList[1],

        retroList[0],

        retroList[3],

        retroList[4],

        retroList[5],
      ],
    },

    {
      id: '1',

      label: 'Mobile Experience Team',

      actions: 'VIEW 15 ACTIONS',

      retros: [retroList[2], retroList[1], retroList[0]],
    },

    {
      id: '2',

      label: 'Superannutation Product Team',

      actions: 'VIEW 5 ACTIONS',

      retros: [retroList[5], retroList[4]],
    },

    {
      id: '3',

      label: 'Insurance Team',

      actions: 'VIEW 15 ACTIONS',

      retros: [retroList[3]],
    },
  ];

  function createNewTeam() {
    if (global.azureUser?.roleName && global.azureUser?.roleName === BASIC) {
      navigate('/basic/teams/create/');
    } else if (
      global.azureUser?.roleName &&
      global.azureUser?.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/teams/create/');
    }
  }
  // Call function to get Sessions
  React.useEffect(() => {
    handleGetRetroChartData();
  }, [fromDate, toDate, selectId]);

  // Call function to get participant
  React.useEffect(() => {
    handleGetParticipantChartData();
  }, [fromDate, toDate, selectId]);

  // Function to get Sessions
  const handleGetRetroChartData = async () => {
    await getRetrosCount(fromDate, toDate, selectId).then(
      res => {
        if (res && res.result) {
          let temp = 0;
          res.result.map((item: any) => {
            temp = temp + item.averageRetros;
          });
          setTotalSessions(Math.round(temp));
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // Function to get participant
  const handleGetParticipantChartData = async () => {
    await getParticipantsCount(fromDate, toDate, selectId).then(
      res => {
        if (res && res.result) {
          let temp = 0;
          res.result.map((item: any) => {
            temp = temp + item.averageParticipants;
          });
          setTotalParticipants(Math.round(temp));
        }
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const handleFromDate = (event: SelectChangeEvent) => {
    setFromDate(event.target.value as string);
    dispatch({
      type: ActionType.CHART_START_DATE,
      payload: { startDate: event.target.value },
    });
  };

  const handleToDate = (event: SelectChangeEvent) => {
    setToDate(event.target.value as string);
    dispatch({
      type: ActionType.CHART_END_DATE,
      payload: { endDate: event.target.value },
    });
  };

  const getTeamNameOnSelect = (selectId: string) => {
    let teamName = '';
    if (selectId === '0') {
      teamName = 'All Teams Analytics';
    } else if (selectId === '1') {
      teamName = 'Mobile Experience Team Analytics';
    } else if (selectId === '2') {
      teamName = 'Superannuation Product Team Analytics';
    } else if (selectId === '3') {
      teamName = 'Insurance Team Analytics';
    }
    return teamName;
  };

  const goToAnalyticsLearnMorePage = (url: string) => {
    navigate(url);
  };

  const navigateToJoinSession = () => {
    navigate('/enterprise/joinRetro/');
  };

  const navigateToCreateSession = () => {
    navigate('/enterprise/createRetro/');
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
        padding="10px"
      >
        {' '}
        {/* Label and Button */}
        <Box
          display="flex"
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
          height="40px"
          alignItems="center"
          onMouseEnter={() => {
            setHoverOnMenu(false);
            setHoverIndex(+selectId);
          }}
        >
          {/* Enterprise Dashboard label */}
          <Box component="span">
            <H1RegularTypography label="Enterprise Dashboard" />
          </Box>
          {/* JOIN SESSION And NEW SESSION Button */}
          <Box component="span">
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: '10px' }}
                onClick={navigateToJoinSession}
              >
                JOIN SESSION
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ marginLeft: '20px', borderRadius: '10px' }}
                onClick={navigateToCreateSession}
              >
                <span style={{ color: 'white' }}>NEW SESSION</span>
              </Button>
            </ThemeProvider>
          </Box>
        </Box>
        {/* Bottom container */}
        <Box display="flex" flexDirection="column" sx={{ overflow: 'auto' }}>
          {/* Teams list menu start */}
          {/* <Box display="flex" flexDirection="row" width="100%" mt="10px">
            {menuList.map((menu, index) => {
              return (
                <Box
                  onMouseEnter={() => {
                    setHoverOnMenu(true);

                    setHoverIndex(index);
                  }}
                  onMouseLeave={() => {
                    // setHoverOnMenu(false);
                    // setHoverIndex(+selectId)
                  }}
                  onClick={() => {
                    setSelectedId(menu.id);
                  }}
                  width="330px"
                  height={menu.id == selectId ? '80px' : '80px'}
                  border="1px solid rgba(206, 239, 255, 1)"
                  borderRadius="5px"
                  boxShadow="6px 10px 20px 4px rgba(21, 154, 221, 0.08)"
                  padding="16px"
                  paddingBottom={menu.id == selectId ? '30px' : '16px'}
                  marginRight="24px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  sx={{
                    background:
                      menu.id == selectId ? 'rgba(0, 0, 0, 0.04)' : 'white',

                    cursor: 'pointer',
                  }}
                  key={'menu' + index}
                >
                  <Box
                    component="span"
                    display="flex"
                    justifyContent="space-between"
                  >
                    <H6RegularTypography
                      style={{
                        width: '274px',

                        color:
                          menu.id == selectId
                            ? commonStyles.primaryDark
                            : 'black',
                      }}
                      label={menu.label}
                    />

                    <EllipsisVerticalIcon width="24px" height="24px" />
                  </Box>
                </Box>
              );
            })}
          </Box> */}
          {/* Retro list starts here after hover */}

          {/* Analytics start here */}
          <Box
            minHeight="540px"
            sx={{
              boxShadow: '10px 10px 40px 20px rgba(21, 154, 221, 0.08)',
              border: '1px solid rgba(250, 250, 250, 1)',
              marginTop: '10px',
              overflowX: 'auto',
              background: 'white',
            }}
            onMouseEnter={() => {
              setHoverOnMenu(false);
              setHoverIndex(+selectId);
            }}
          >
            {/* Analytics label*/}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: '16px',
                marginTop: '16px',
                marginBottom: '16px',
                width: 'calc(100% - 16px)',
                justifyContent: 'space-between',
              }}
            >
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-start"
              >
                {/* <H4RegularTypography label="Analytics" />
                <ReactToPrint
                  trigger={() => (
                    <OutlinedButton
                      id="downloadBoardPdf"
                      label="Download Pdf"
                      size={'small'}
                      onClick={() => {}}
                      style={{
                        marginLeft: '16px',
                      }}
                    />
                  )}
                  content={() => componentRef.current}
                /> */}

                <DateSelector
                  handleFromDate={handleFromDate}
                  handleToDate={handleToDate}
                  fromDate={fromDate}
                  toDate={toDate}
                  disable={true}
                />
                <TeamSelector
                  enterpriseId={
                    global.azureUser?.enterpriseId
                      ? global.azureUser?.enterpriseId
                      : '0'
                  }
                  padding="5px"
                  selectedTeam={'all'}
                  handleChange={(change: any) => {
                    console.log(change);
                  }}
                />

                <ContainedButtonWithIcon
                  id={'create_new_Team'}
                  label={'New Team'}
                  size={'small'}
                  iconPath="/svgs/plusSmall.svg"
                  style={{ width: '200px', textAlign: 'center' }}
                  onClick={() => createNewTeam()}
                />
              </Box>
            </Box>
            {/* Analytics Charts */}
            <Box
              display="flex"
              width="100%"
              paddingLeft="10px"
              flexWrap="wrap"
              rowGap={'10px'}
              ref={componentRef}
              id="scrollableDiv"
            >
              {/* Top Data */}
              <Box
                id="top_data_print"
                display="none"
                sx={{ width: '100%', marginBottom: '24px' }}
              >
                <Box
                  sx={{
                    backgroundColor: '#CEEFFF',
                    display: 'flex',
                    flexDirection: 'row',
                    padding: '24px',
                  }}
                >
                  {/* Image and Label */}
                  <Grid item xs={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                      }}
                    >
                      <img src="/images/colonial_first_state.png"></img>
                      <TinyTextSemiBoldTypography
                        label="Powered by"
                        style={{ color: '#2C69A1', marginTop: '8px' }}
                      />
                      <img
                        src="/svgs/BACI-Beta_Filled.svg"
                        style={{ marginTop: '8px' }}
                      ></img>
                      <a
                        href="https://baci.app/"
                        rel="noreferrer"
                        target="_blank"
                        style={{
                          color: '#2C69A1',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '120%',
                          letterSpacing: '0.006em',
                          marginTop: '8px',
                        }}
                      >
                        https://baci.app
                      </a>
                    </Box>
                  </Grid>
                  {/* Logo and data */}
                  <Grid item xs={6} style={{ marginLeft: '48px' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                      }}
                    >
                      <H4SemiBoldTypography
                        label={getTeamNameOnSelect(selectId)}
                        style={{ color: '#2C69A1' }}
                      />
                      <TinyTextTypography
                        label={'as of ' + currentDate}
                        style={{ color: '#2C69A1', marginTop: '8px' }}
                      />
                      <Box
                        display="flex"
                        flexDirection="row"
                        style={{ marginTop: '16px' }}
                      >
                        <Icons.CalendarOutline
                          size={20}
                          style={{
                            color: '#2C69A1',
                          }}
                        />
                        <BodyRegularTypography
                          label={fromDateString + ' - ' + toDateString}
                          style={{ color: '#2C69A1', marginLeft: '18px' }}
                        />
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        style={{ marginTop: '8px' }}
                      >
                        <img src="/svgs/square_stack.svg"></img>
                        <BodyRegularTypography
                          label={totalSessions + ' Sessions'}
                          style={{ color: '#2C69A1', marginLeft: '18px' }}
                        />
                      </Box>
                      <Box
                        display="flex"
                        flexDirection="row"
                        style={{ marginTop: '8px' }}
                      >
                        <Icons.UserGroupOutline
                          size={20}
                          style={{
                            color: '#2C69A1',
                          }}
                        />
                        <BodyRegularTypography
                          label={totalParticipants + ' Participants'}
                          style={{ color: '#2C69A1', marginLeft: '18px' }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Box>
              </Box>
              {/* Enterprise Level Actions Count Chart */}
              <Box className="chartCard">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <BodySemiBoldTypography label="Count of All Actions (Assigned vs Completed)" />
                  <BootstrapTooltip
                    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in ex a est finibus fermentum aliquet at urna. Vivamus ac aliquet mi. Morbi laoreet tortor metus, ac vehicula turpis imperdiet et."
                    arrow
                    placement="right"
                  >
                    <Icons.InformationCircleOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    />
                  </BootstrapTooltip>
                </Box>
                <Box
                  onClick={() => {
                    navigate(
                      '/enterprise/analytics/enterpriseLevelActionsCount'
                    );
                  }}
                >
                  <EnterpriseLevelActionsCountChart
                    dashboard={true}
                    team={selectId}
                  />
                </Box>
                {/* <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <TextButton
                    id={'Learn_More'}
                    label={'Learn More'}
                    size={'small'}
                    style={{
                      paddingLeft: '0px !important',
                      textDecorationLine: 'underline !important',
                      backgroundColor: 'transparent !important',
                    }}
                    onClick={() =>
                      goToAnalyticsLearnMorePage(
                        '/enterprise/analytics/enterpriseLevelActionsCountLearnMore'
                      )
                    }
                  />
                </Box> */}
              </Box>
              {/* Team Level Actions Count Chart */}

              <Box className="chartCard">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <BodySemiBoldTypography label="Count of Team Actions (Assigned vs Completed)" />
                  <BootstrapTooltip
                    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in ex a est finibus fermentum aliquet at urna. Vivamus ac aliquet mi. Morbi laoreet tortor metus, ac vehicula turpis imperdiet et."
                    arrow
                    placement="right"
                  >
                    <Icons.InformationCircleOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    />
                  </BootstrapTooltip>
                </Box>
                <Box
                  onClick={() => {
                    navigate('/enterprise/analytics/teamLevelActionsCount');
                  }}
                >
                  <TeamLevelActionsCountChart dashboard={true} />
                </Box>
              </Box>

              {/* ------------------------Page Header ----------------------------- */}

              <Grid
                id="page_header_1"
                item
                xs={12}
                display="none"
                style={{
                  width: '100%',
                  marginTop: '108px',
                  marginBottom: '24px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <Grid item xs={6}>
                    <img src="/images/colonial_first_state.png"></img>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      component="span"
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      flexDirection="column"
                    >
                      <CaptionRegularTypography
                        label="All Teams Report Overview"
                        style={{ color: '#159ADD' }}
                      />
                      <a
                        href="https://baci.app/"
                        rel="noreferrer"
                        target="_blank"
                        style={{
                          color: '#2C69A1',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '120%',
                          letterSpacing: '0.006em',
                          marginTop: '8px',
                        }}
                      >
                        https://baci.app
                      </a>
                    </Box>
                  </Grid>
                </Box>
              </Grid>

              {/* Average Participant Chart */}

              <Box className="chartCard">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <BodySemiBoldTypography label="Count of All Participants Over Time" />
                  <BootstrapTooltip
                    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in ex a est finibus fermentum aliquet at urna. Vivamus ac aliquet mi. Morbi laoreet tortor metus, ac vehicula turpis imperdiet et."
                    arrow
                    placement="right"
                  >
                    <Icons.InformationCircleOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    />
                  </BootstrapTooltip>
                </Box>
                <Box
                  onClick={() => {
                    navigate(
                      '/enterprise/analytics/enterpriseLevelParticipantsCount'
                    );
                  }}
                >
                  <AverageParticipantChart dashboard={true} team={selectId} />
                </Box>
              </Box>

              {/* Average Sessions Counts Chart Print*/}

              <Box className="chartCard">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <BodySemiBoldTypography label="Count of All Sessions" />
                  <BootstrapTooltip
                    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in ex a est finibus fermentum aliquet at urna. Vivamus ac aliquet mi. Morbi laoreet tortor metus, ac vehicula turpis imperdiet et."
                    arrow
                    placement="right"
                  >
                    <Icons.InformationCircleOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    />
                  </BootstrapTooltip>
                </Box>
                <Box
                  onClick={() => {
                    navigate(
                      '/enterprise/analytics/enterpriseLevelRetrosCount'
                    );
                  }}
                >
                  <AverageRetroChart dashboard={true} team={selectId} />
                </Box>
              </Box>

              {/* ------------------------Page Header ----------------------------- */}

              <Grid
                id="page_header_1"
                item
                xs={12}
                display="none"
                style={{
                  width: '100%',
                  marginTop: '200px',
                  marginBottom: '24px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <Grid item xs={6}>
                    <img src="/images/colonial_first_state.png"></img>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      component="span"
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      flexDirection="column"
                    >
                      <CaptionRegularTypography
                        label="All Teams Report Overview"
                        style={{ color: '#159ADD' }}
                      />
                      <a
                        href="https://baci.app/"
                        rel="noreferrer"
                        target="_blank"
                        style={{
                          color: '#2C69A1',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '120%',
                          letterSpacing: '0.006em',
                          marginTop: '8px',
                        }}
                      >
                        https://baci.app
                      </a>
                    </Box>
                  </Grid>
                </Box>
              </Grid>

              {/* Enterprise Level Sentiments Theme Chart */}

              <Box className="chartCard">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <BodySemiBoldTypography label="Enterprise Level - Sentiments - Key Themes Heatmap" />
                  <BootstrapTooltip
                    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in ex a est finibus fermentum aliquet at urna. Vivamus ac aliquet mi. Morbi laoreet tortor metus, ac vehicula turpis imperdiet et."
                    arrow
                    placement="right"
                  >
                    <Icons.InformationCircleOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    />
                  </BootstrapTooltip>
                </Box>
                <Box
                  onClick={() => {
                    navigate(
                      '/enterprise/analytics/enterpriseLevelSentimentsThemes'
                    );
                  }}
                >
                  <EnterpriseLevelSentimentsThemeChart
                    dashboard={true}
                    team={selectId}
                  />
                </Box>
              </Box>

              {/* Enterprise Level Sentiments Moods Chart */}

              <Box className="chartCard">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <BodySemiBoldTypography label="Sentiments - Moods" />
                  <BootstrapTooltip
                    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in ex a est finibus fermentum aliquet at urna. Vivamus ac aliquet mi. Morbi laoreet tortor metus, ac vehicula turpis imperdiet et."
                    arrow
                    placement="right"
                  >
                    <Icons.InformationCircleOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    />
                  </BootstrapTooltip>
                </Box>
                <Box
                  onClick={() => {
                    navigate(
                      '/enterprise/analytics/enterpriseLevelSentimentsMoods'
                    );
                  }}
                >
                  <EnterpriseLevelSentimentsMoodsChart
                    dashboard={true}
                    team={selectId}
                  />
                </Box>
              </Box>

              {/* ------------------------Page Header ----------------------------- */}

              <Grid
                id="page_header_1"
                item
                xs={12}
                display="none"
                style={{
                  width: '100%',
                  marginTop: '200px',
                  marginBottom: '24px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}
                >
                  <Grid item xs={6}>
                    <img src="/images/colonial_first_state.png"></img>
                  </Grid>
                  <Grid item xs={6}>
                    <Box
                      component="span"
                      display="flex"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      flexDirection="column"
                    >
                      <CaptionRegularTypography
                        label="All Teams Report Overview"
                        style={{ color: '#159ADD' }}
                      />
                      <a
                        href="https://baci.app/"
                        rel="noreferrer"
                        target="_blank"
                        style={{
                          color: '#2C69A1',
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '12px',
                          lineHeight: '120%',
                          letterSpacing: '0.006em',
                          marginTop: '8px',
                        }}
                      >
                        https://baci.app
                      </a>
                    </Box>
                  </Grid>
                </Box>
              </Grid>

              {/* Enterprise Level Sentiments Summary Chart */}

              <Box className="chartCard">
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <BodySemiBoldTypography label="Enterprise Level - Overall Summary" />
                  <BootstrapTooltip
                    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in ex a est finibus fermentum aliquet at urna. Vivamus ac aliquet mi. Morbi laoreet tortor metus, ac vehicula turpis imperdiet et."
                    arrow
                    placement="right"
                  >
                    <Icons.InformationCircleOutline
                      size={24}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',
                        marginLeft: '5px',
                      }}
                    />
                  </BootstrapTooltip>
                </Box>
                <Box
                  onClick={() => {
                    navigate(
                      '/enterprise/analytics/enterpriseLevelSentimentsSummary'
                    );
                  }}
                >
                  <EnterpriseLevelSentimentsSummaryChart
                    dashboard={true}
                    team={selectId}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default EnterpriseDashboard;
