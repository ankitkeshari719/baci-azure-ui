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
  H5SemiBoldTypography,
  H6RegularTypography,
  H6SemiBoldTypography,
  TinyTextSemiBoldTypography,
  TinyTextTypography,
} from '../../CustomizedTypography';

import commonStyles from './../../../style.module.scss';

import './EnterpriseDashboard.scss';

import AverageParticipantChart from '../../../screens/Analytics/AverageParticipantChart';

import EnterpriseLevelActionsCountChart from '../../../screens/Analytics/EnterpriseLevelActionsCountChart';

import { useNavigate } from 'react-router-dom';

import EnterpriseLevelSentimentsMoodsChart from '../../../screens/Analytics/EnterpriseLevelSentimentsMoodsChart';

import TeamLevelActionsCountChart from '../../../screens/Analytics/TeamLevelActionsCountChart';

import EnterpriseLevelSentimentsThemeChart from '../../../screens/Analytics/EnterpriseLevelSentimentsThemeChart';
import { useState } from 'react';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import EnterpriseLevelSentimentsSummaryChart from '../../../screens/Analytics/EnterpriseLevelSentimentsSummaryChart';
import moment from 'moment';
import {
  chartInputType,
  formatDateForAPI,
  formatDateToMonthYear,
  getParticipantsCount,
  getRetrosCount,
  getSessionsData,
} from '../../../helpers/msal/services';
import { OutlinedButton } from '../../CustomizedButton/OutlinedButton';
import AverageRetroChart from '../../../screens/Analytics/AverageRetroChart';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import DateSelector from './DateSelector';
import TeamSelector from '../TeamSelector';
import { BASIC, ENTERPRISE } from '../../../constants/applicationConst';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import { TextButtonWithIcon } from '../../CustomizedButton/TextButtonWithIcon';
import { OutlinedButtonWithIcon } from '../../CustomizedButton/OutlinedButtonWithIcon';
import RetroCount from '../../../assets/img/RetroCount.png';
import UploadImage from '../../../assets/img/Upload Image or Photo.png';
import Backdrop from '@mui/material/Backdrop';
import BACITemplate from '../../../assets/img/BACI Template.png';

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

  const [sessionCount, setSessionCount] = React.useState<number>(0);

  const [selectId, setSelectedId] = React.useState<string>('0');

  const [actionCount, setActionCount] = React.useState<number>(0);

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

  const [totalSessions, setTotalSessions] = useState<Number>();
  const [totalParticipants, setTotalParticipants] = useState<Number>();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

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
    if (global.azureUser != undefined) {
      const chartInput: chartInputType = {
        userId: global.azureUser?.emailId,
        roleName: global.azureUser?.roleName,
        enterpriseId: global.azureUser?.enterpriseId,
        teamId: global.teamId ? global.teamId : '0',
        fromDate: formatDateForAPI(fromDate),
        toDate: formatDateForAPI(toDate, true),
      };

      await getSessionsData(chartInput).then(
        res => {
          if (res.result != undefined && res.result?.length != undefined) {
            console.log(res.result?.length);
            setSessionCount(res.result?.length);
          } else {
            setSessionCount(0);
          }
        },
        err => {}
      );
    }

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

  const goToAnalyticsLearnMorePage = (url: string) => {
    navigate(url);
  };

  const navigateToJoinSession = () => {
    navigate('/enterprise/joinRetro/');
  };

  const navigateToCreateSession = () => {
    navigate('/enterprise/createRetro/');
  };

  const navigateToUploadImage = () => {
    navigate('/enterprise/uploadImage/');
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
          <Box
            component="span"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <H1RegularTypography label="Dashboard" />

            <ReactToPrint
              trigger={() => (
                <Button style={{ marginLeft: '10px' }}>
                  <Icons.Printer color={'#2C69A1'} fontSize={'32px'} />
                </Button>
              )}
              content={() => componentRef.current}
            />
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
                onClick={handleOpen}
              >
                <span style={{ color: 'white' }}>NEW SESSION</span>
              </Button>
            </ThemeProvider>
          </Box>
        </Box>

 {/* select session flow */}
 <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <Box style={{ width: '700px' }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={5}
                onClick={navigateToCreateSession}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  padding: '7px',
                  alignContent: 'center',
                  maxWidth: '250px',
                }}
              >
                <img
                  src={BACITemplate}
                  alt="Logo"
                  className="logo"
                  height="90px"
                  width="230px"
                />
                <p style={{ textAlign: 'center', color: 'black' }}>
                  BACI Template
                </p>
                <p style={{ fontSize: '12px', color: 'gray' }}>
                  Need run a collabration session with BACI?
                  <br />
                  Start instatly with preset BACI Template.
                </p>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid
                item
                xs={5}
                onClick={navigateToUploadImage}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  padding: '7px',
                  maxWidth: '250px',
                }}
              >
                <img
                  src={UploadImage}
                  alt="Logo"
                  className="logo"
                  height="90px"
                  width="230"
                />
                <p
                  onClick={handleClose}
                  style={{ textAlign: 'center', color: 'black' }}
                >
                  Upload Image or Photo
                </p>
                <p style={{ fontSize: '12px', color: 'gray' }}>
                  Run a collabration session with Post-Its on a wall?
                  <br/>Digitise it here for easy analysis and safe keeping.
                </p>
              </Grid>
            </Grid>
          </Box>
        </Backdrop>


        {/* Bottom container */}
        <Box display="flex" flexDirection="column" sx={{ overflow: 'auto' }}>
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
                {/* <ReactToPrint
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
                  padding="9px"
                  selectedTeam={global.teamId ? global.teamId : selectId}
                  handleChange={(change: any) => {
                    dispatch({
                      type: ActionType.SET_TEAM_ID,
                      payload: { teamId: change.target.value },
                    });

                    setSelectedId(change.target.value);
                  }}
                  showAllTeamOption={true}
                />

                <ContainedButtonWithIcon
                  id={'create_new_Team'}
                  label={'New Team'}
                  size={'medium'}
                  iconPath="/svgs/plusSmall.svg"
                  style={{ width: '200px', textAlign: 'center' }}
                  onClick={() => createNewTeam()}
                />
                <TextButtonWithIcon
                  id="actions"
                  icon={
                    <Icons.ChevronRight
                      fontSize={'16px'}
                      style={{ marginLeft: '-16px' }}
                    />
                  }
                  style={{ marginLeft: '20px' }}
                  label={
                    actionCount > 1
                      ? actionCount + '  Actions'
                      : actionCount + '  Actions'
                  }
                  size={'medium'}
                  onClick={() => console.log('')}
                />
              </Box>

              <Box
                padding={'12px'}
                paddingRight={'18px'}
                paddingLeft={'18px'}
                display={'flex'}
                marginRight={'20px'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                width={'200px'}
                border="1px solid #CEEFFF"
                borderRadius={'5px'}
                sx={{ background: 'white', cursor: 'pointer' }}
              >
                <H5SemiBoldTypography
                  label={
                    sessionCount > 1
                      ? sessionCount + '  Sessions'
                      : sessionCount + '  Session'
                  }
                />

                <Box>
                  <img
                    src={RetroCount}
                    style={{ width: '20px', height: '18px' }}
                  />
                </Box>
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
                      {/* <H4SemiBoldTypography
                        label={getTeamNameOnSelect(selectId)}
                        style={{ color: '#2C69A1' }}
                      /> */}
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
                          label={
                            formatDateToMonthYear(fromDate) +
                            ' - ' +
                            formatDateToMonthYear(toDate)
                          }
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
                    count={e => {
                      setActionCount(e);
                    }}
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
                  <TeamLevelActionsCountChart
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
