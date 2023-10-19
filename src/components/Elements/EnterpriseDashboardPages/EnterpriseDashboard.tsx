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
  getCountOfAllParticipantsOverTime,
  getCountOfAllSessionsOverTime,
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
import { UserActionType, UserContext } from '../../../contexts/UserContext';

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
  const [gUser,userDispatch]= React.useContext(UserContext);

  const [fromDate, setFromDate] = useState<string>(
    gUser.chartStartDate
      ? gUser.chartStartDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          new Date().getMonth().toString().slice(-2)
  );
  const [toDate, setToDate] = useState<string>(
    gUser.chartEndDate
      ? gUser.chartEndDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          (new Date().getMonth() + 1).toString().slice(-2)
  );


  const [totalParticipants, setTotalParticipants] = useState<any>(0);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  function createNewTeam() {
    if (gUser.azureUser?.roleName && gUser.azureUser?.roleName === BASIC) {
      navigate('/basic/teams/create/');
    } else if (
      gUser.azureUser?.roleName &&
      gUser.azureUser?.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/teams/create/');
    }
  }
  // Call function to get Sessions
  React.useEffect(() => {
    handleGetRetroChartData();
  }, [fromDate, toDate, selectId]);

  

  // Function to get Sessions
  const handleGetRetroChartData = async () => {
    if (gUser.azureUser != undefined) {
      const chartInput: chartInputType = {
        userId: gUser.azureUser?.emailId,
        roleName: gUser.azureUser?.roleName,
        enterpriseId: gUser.azureUser?.enterpriseId,
        teamId: gUser.teamId ? gUser.teamId : '0',
        fromDate: formatDateForAPI(fromDate),
        toDate: formatDateForAPI(toDate, true),
      };

      await getCountOfAllSessionsOverTime(chartInput).then(
        res => {
          if (res.data != undefined && res.data?.length != undefined) {
            var totalRetrocount = 0;
            res.data.forEach((element: any) => {
              totalRetrocount = element.retroCount + totalRetrocount;
            });

            setSessionCount(totalRetrocount);
          } else {
            setSessionCount(0);
          }
        },
        err => {}
      );
    }


  };

 

  const handleFromDate = (event: any) => {
    setFromDate(event as string);
    dispatch({
      type: ActionType.CHART_START_DATE,
      payload: { startDate: event },
    });
    userDispatch({
      type: UserActionType.CHART_START_DATE,
      payload: { startDate: event },
    });
  };

  const handleToDate = (event: any) => {
    setToDate(event as string);
    dispatch({
      type: ActionType.CHART_END_DATE,
      payload: { endDate: event },
    });
    userDispatch({
      type: UserActionType.CHART_END_DATE,
      payload: { endDate: event },
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
    // navigate('/enterprise/uploadImage/');
    navigate('/enterprise/createSession/');
  };

  const handleOnClick = (link: string) => {
    navigate(link);
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
          <Box style={{ width: '1000px' }}>
            <Grid container spacing={2} style={{ gridGap: '30px' }}>
              <Grid
                item
                xs={5}
                onClick={navigateToCreateSession}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '10px 10px 20px 10px',
                  alignContent: 'center',
                  maxWidth: '450px',
                  height: '349px',
                }}
              >
                <img
                  src={BACITemplate}
                  alt="Logo"
                  className="logo"
                  height="189px"
                  width="400px"
                />
                <p
                  style={{
                    textAlign: 'center',
                    color: 'black',
                    fontSize: '23px',
                  }}
                >
                  BACI Template
                </p>
                <p style={{ fontSize: '16px', color: 'gray', margin: '10px' }}>
                  Need to run a collaboration session with BACI?
                  <br />
                  Start instantly with preset BACI templates.
                </p>
              </Grid>

              <Grid
                item
                xs={5}
                onClick={navigateToUploadImage}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: '10px 10px 20px 10px',
                  maxWidth: '450px',
                  height: '349px',
                }}
              >
                <img
                  src={UploadImage}
                  alt="Logo"
                  className="logo"
                  height="189px"
                  width="400px"
                />
                <p
                  onClick={handleClose}
                  style={{
                    textAlign: 'center',
                    color: 'black',
                    fontSize: '23px',
                  }}
                >
                  Upload Image or Photo
                </p>
                <p style={{ fontSize: '16px', color: 'gray', margin: '10px' }}>
                  Run a collabration session with Post-Its on a wall?
                  <br />
                  Digitise it here for easy analysis and safe keeping.
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
                    gUser.azureUser?.enterpriseId
                      ? gUser.azureUser?.enterpriseId
                      : '0'
                  }
                  padding="9px"
                  selectedTeam={gUser.teamId ? gUser.teamId : selectId}
                  handleChange={(change: any) => {
                    dispatch({
                      type: ActionType.SET_TEAM_ID,
                      payload: { teamId: change.target.value },
                    });
                    userDispatch({
                      type: UserActionType.SET_TEAM_ID,
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
                  onClick={() => {
                    
                    if(location.pathname.includes('basic')) 
                    {navigate('/basic/actions')}
                    else if(location.pathname.includes('enterprise'))
                    navigate('/enterprise/actions')}}
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
                onClick={() => {
                    
                  if(location.pathname.includes('basic')) 
                  {navigate('/basic/sessions')}
                  else if(location.pathname.includes('enterprise'))
                  navigate('/enterprise/sessions')}}
              
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
                          label={sessionCount + ' Sessions'}
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
                    title={
                      'The graph shows the break down of total actions created over time,Total actions are broken into Assigned vs Completed.'
                    }
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
                  {/* <BodySemiBoldTypography
                    label="Learn More"
                    style={{
                      color: '#159ADD',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                    onClick={() =>
                      handleOnClick('enterpriseLevelActionsCountLearnMore')
                    }
                  /> */}
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
                    title="The graph shows the break down of total actions created for each of your team.
                    Total actions are broken into Assigned vs Completed."
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
                  {/* <BodySemiBoldTypography
                    label="Learn More"
                    style={{
                      color: '#159ADD',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                    onClick={() =>
                      handleOnClick('teamLevelActionsCountLearnMore')
                    }
                  /> */}
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
                    title="The graph shows the total number of participants (unique users) across all your teams over time."
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
                  {/* <BodySemiBoldTypography
                    label="Learn More"
                    style={{
                      color: '#159ADD',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                    onClick={() =>
                      handleOnClick('enterpriseLevelParticipantsCountLearnMore')
                    }
                  /> */}
                </Box>
                <Box
                  onClick={() => {
                    navigate(
                      '/enterprise/analytics/enterpriseLevelParticipantsCount'
                    );
                  }}
                >
                  <AverageParticipantChart dashboard={true} team={selectId} totalParticipantsCount={(count)=>{
                    setTotalParticipants(count)
                  }} />
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
                    title="The graph shows the total number of sessions across all your teams over time."
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
                  {/* <BodySemiBoldTypography
                    label="Learn More"
                    style={{
                      color: '#159ADD',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                    onClick={() =>
                      handleOnClick('enterpriseLevelRetrosCountLearnMore')
                    }
                  /> */}
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
                    title="The chart uses AI to capture words used in BACI collaboration sessions and measures in a heat map of how your people are feeling (Happy, Sad, Neutral) against each BACI key themes for high performing organisations. It is a more detailed view of the Sentiments - Moods chart."
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
                  {/* <BodySemiBoldTypography
                    label="Learn More"
                    style={{
                      color: '#159ADD',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                    onClick={() =>
                      handleOnClick('enterpriseLevelSentimentsThemesLearnMore')
                    }
                  /> */}
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
                    title="The chart takes the results from the pulse check and uses AI to capture words used in BACI collaboration sessions to provide a simple chart of how your people are feeling (Happy, Sad, Neutral) from month-to-month."
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
                  {/* <BodySemiBoldTypography
                    label="Learn More"
                    style={{
                      color: '#159ADD',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                    onClick={() =>
                      handleOnClick('enterpriseLevelSentimentsMoodsLearnMore')
                    }
                  /> */}
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
                    title="The summary uses AI to capture words used in BACI collaboration sessions and produces simple, useful and powerful summary paragraph and word cloud to gain valuable data driven insights on your teams mindset and culture."
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
                  {/* <BodySemiBoldTypography
                    label="Learn More"
                    style={{
                      color: '#159ADD',
                      cursor: 'pointer',
                      marginTop: '8px',
                    }}
                    onClick={() =>
                      handleOnClick('enterpriseLevelSentimentsSummaryLearnMore')
                    }
                  /> */}
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
