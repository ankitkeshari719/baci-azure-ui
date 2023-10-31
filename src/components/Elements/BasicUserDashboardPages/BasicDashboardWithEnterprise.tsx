import * as React from 'react';
import { Box, Button, ThemeProvider, createTheme, styled } from '@mui/material';
import { Grid } from '@mui/material';
import BACITemplate from '../../../assets/img/BACI Template.png';
import UploadImage from '../../../assets/img/Upload Image or Photo.png';
import Backdrop from '@mui/material/Backdrop';

import {
  BodySemiBoldTypography,
  ButtonLabelTypography,
  CaptionRegularTypography,
  CaptionSemiBoldTypography,
  H1RegularTypography,
  H4RegularTypography,
  H5SemiBoldTypography,
  H6RegularTypography,
  H6SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from './../../../style.module.scss';
import {
  EllipsisVerticalIcon,
  ArrowRightCircleIcon,
} from '@heroicons/react/24/outline';
import * as Icons from 'heroicons-react';
import Avatar from '../Avatar';
import AverageParticipantChart from '../../../screens/Analytics/AverageParticipantChart';
import EnterpriseLevelActionsCountChart from '../../../screens/Analytics/EnterpriseLevelActionsCountChart';
import { useNavigate } from 'react-router-dom';
import EnterpriseLevelSentimentsMoodsChart from '../../../screens/Analytics/EnterpriseLevelSentimentsMoodsChart';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { TextButton } from '../../CustomizedButton/TextButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Paper from '@mui/material/Paper';
import { TransitionProps } from '@mui/material/transitions';
import { UserActionType, UserContext } from '../../../contexts/UserContext';
import { BASIC, ENTERPRISE } from '../../../constants/applicationConst';
import DateSelector from '../EnterpriseDashboardPages/DateSelector';
import TeamSelector from '../TeamSelector';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import {
  chartInputType,
  formatDateForAPI,
  getCountOfAllSessionsOverTime,
  getSessionsDataForTable,
} from '../../../helpers/msal/services';
import { TextButtonWithIcon } from '../../CustomizedButton/TextButtonWithIcon';
import RetroCount from '../../../assets/img/RetroCount.png';
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
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
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
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function BasicDashboardWithEnterprise() {
  const [gUser, userDispatch] = React.useContext(UserContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [displayJiraRows, setDisplayJiraRows] = React.useState<any>([]);
  const [actionCount, setActionCount] = React.useState<number>(0);
  const [totalParticipants, setTotalParticipants] = React.useState<any>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [sessionCount, setSessionCount] = React.useState<number>(0);
  const [fromDate, setFromDate] = React.useState<string>(
    gUser.chartStartDate
      ? gUser.chartStartDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          new Date().getMonth().toString().slice(-2)
  );
  const [toDate, setToDate] = React.useState<string>(
    gUser.chartEndDate
      ? gUser.chartEndDate
      : new Date().getFullYear().toString() +
          '-' +
          '0' +
          (new Date().getMonth() + 1).toString().slice(-2)
  );
  const [users, setUsers] = React.useState<any[]>(
    global?.users ? global?.users : []
  );
  const navigate = useNavigate();
  const [selectId, setSelectedId] = React.useState<string>('0');
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    localStorage.setItem(
      'uuid',
      gUser?.azureUser ? gUser?.azureUser.emailId : ''
    );
    dispatch({
      type: ActionType.SET_USER,
      payload: {
        user: {
          id:
            gUser.azureUser?.emailId != undefined
              ? gUser.azureUser?.emailId
              : '',
          name:
            gUser.azureUser?.emailId != undefined
              ? gUser.azureUser?.firstName + ' ' + gUser.azureUser?.lastName
              : '',
          avatar:
            gUser.azureUser?.emailId != undefined
              ? gUser.azureUser?.selectedAvatar
              : '',
          userType: 1,
        },
      },
    });
  },[]);

  const navigateToJoinSession = () => {
    if (gUser?.azureUser?.roleName == ENTERPRISE)
      navigate('/enterprise/sessions/');
    else if (gUser?.azureUser?.roleName == BASIC) navigate('/basic/sessions/');
    else navigate('/basic/sessions/');
  };

  const navigateToCreateSession = () => {
    if (gUser?.azureUser?.roleName == ENTERPRISE)
      navigate('/enterprise/sessions/createRetro/');
    else if (gUser?.azureUser?.roleName == BASIC)
      navigate('/basic/sessions/createRetro/');
    else navigate('/basic/createRetro/');
  };

  const navigateToUploadImage = () => {
    // navigate('/basic/uploadImage/');
    if (gUser?.azureUser?.roleName == ENTERPRISE)
      navigate('/enterprise/sessions/createSession/');
    else if (gUser?.azureUser?.roleName == BASIC)
      navigate('/basic/sessions/createSession/');
    else navigate('/basic/createSession/');
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

  // Call function to get Sessions
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

  const getSessionForTable = async () => {
    setLoading(true);
    if (gUser.azureUser != undefined) {
      const chartInput: chartInputType = {
        userId: gUser.azureUser?.emailId,
        roleName: gUser.azureUser?.roleName,
        enterpriseId: gUser.azureUser?.enterpriseId,
        teamId: gUser.teamId ? gUser.teamId : '0',
        fromDate: formatDateForAPI(fromDate),
        toDate: formatDateForAPI(toDate, true),
      };

      setLoading(true);
      await getSessionsDataForTable(chartInput).then(
        res => {
          if (res.data.length > 0) {
            let actionsArray: any[] = [];
            res.data.forEach((action: any) => {
              var actionObj = action;

              actionObj.timestamp = new Date(action.timestamp)
                .toLocaleString()
                .split(',')[0];
              actionsArray.push(actionObj);
            });

            setDisplayJiraRows([...actionsArray]);
          } else setDisplayJiraRows([]);
          setLoading(false);
        },
        error => {
          setLoading(false);
        }
      );
    }
  };

  React.useEffect(() => {
    handleGetRetroChartData();
    getSessionForTable();
  }, [fromDate, toDate, selectId]);

  const goToAnalyticsLearnMorePage = (url: string) => {
    navigate(url);
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
        {/* Label And Button*/}
        <Box
          display="flex"
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
          height="40px"
          alignItems="center"
        >
          {/* BACI Dashboard Label */}
          <Box component="span">
            <H1RegularTypography label="BACI Dashboard" />
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
              {/* <Box component="span" width="20px" /> */}

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
                if (location.pathname.includes('basic')) {
                  navigate('/basic/actions');
                } else if (location.pathname.includes('enterprise'))
                  navigate('/enterprise/actions');
              }}
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
              if (location.pathname.includes('basic')) {
                navigate('/basic/sessions');
              } else if (location.pathname.includes('enterprise'))
                navigate('/enterprise/sessions');
            }}
          >
            <H5SemiBoldTypography
              label={
                sessionCount > 1
                  ? sessionCount + '  Sessions'
                  : sessionCount + '  Session'
              }
            />

            <Box>
              <img src={RetroCount} style={{ width: '20px', height: '18px' }} />
            </Box>
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
          {/* Teams list menu start */}
          {/* <Box display="flex" flexDirection="row" width="100%" mt="10px">
            {menuList.map((menu, index) => {
              return (
                <Box
                  onClick={() => {
                    setSelectedId(menu.id);
                  }}
                  width="330px"
                  height={menu.isSelected ? '170px' : '156px'}
                  border="1px solid rgba(250, 250, 250, 1)"
                  boxShadow="6px 10px 20px 4px rgba(21, 154, 221, 0.08)"
                  padding="16px"
                  paddingBottom={menu.isSelected ? '30px' : '16px'}
                  marginRight="24px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  sx={{
                    background: menu.isSelected
                      ? 'rgba(0, 0, 0, 0.04)'
                      : 'white',
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
                        color: menu.isSelected
                          ? commonStyles.primaryDark
                          : 'black',
                      }}
                      label={menu.label}
                    />
                    <EllipsisVerticalIcon width="24px" height="24px" />
                  </Box>
                  <Button
                    sx={{
                      width: '188px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'left',
                    }}
                    endIcon={<ArrowRightCircleIcon width="18px" />}
                  >
                    <ButtonLabelTypography label={menu.actions} />
                  </Button>
                </Box>
              );
            })}
          </Box> */}
          {/* Retro list starts here */}
          <Box
            width="100%"
            height="241px"
            sx={{
              background: 'rgba(0, 0, 0, 0.04)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              overflow: 'auto',
            }}
          >
            {/* RetroCard Info */}
            {displayJiraRows.map((subMenu: any, index: number) => {
              return (
                <Box
                  width="297px"
                  minWidth="297px"
                  height="185px"
                  borderRadius="10px"
                  key={'submenu' + index}
                  sx={{
                    border: '1px solid rgba(227, 227, 227, 1)',
                    background: 'white',
                    padding: '16px 16px 0px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    mr: '10px',
                    ml: '10px',
                  }}
                >
                  <H6SemiBoldTypography label={subMenu.name} />
                  <CaptionRegularTypography
                    label={
                      subMenu.retroStatus == 'ended'
                        ? subMenu.timestamp
                        : 'Code : ' + subMenu.humanId
                    }
                  />
                  {subMenu.retroStatus == 'ended' ? (
                    <>
                      {/* <CaptionSemiBoldTypography
                        label={subMenu.totalActions + ' Actions'}
                        style={{ color: commonStyles.PrimaryMain }}
                      /> */}
                      <Box>
                        <CaptionRegularTypography label="Participants " />
                        {subMenu.userEmailIds.map(
                          (emailId: any, index: number) => {
                            {
                              const user = users.find(
                                user => user.emailId == emailId
                              );
                              return (
                                index < 4 &&user?.selectedAvatar && (
                                  <Avatar
                                    key={user.emailId}
                                    avatar={user.selectedAvatar}
                                    css={{
                                      width: '40px',
                                      height: '40px',
                                      marginLeft: '0',
                                      marginRight: '-8px',
                                      border: '0px',
                                    }}
                                  />
                                )
                              );
                            }
                          }
                        )}
                        <CaptionRegularTypography
                          style={{ marginLeft: '14px' }}
                          label={'+' + (subMenu.userEmailIds.length + 1 - 4)}
                        />
                      </Box>
                      <Button
                        variant="outlined"
                        sx={{ borderRadius: '24px', fontWeight: '500px' }}
                        color="primary"
                        disabled={
                          gUser.azureUser?.emailId !== subMenu.creatorId &&
                          gUser.azureUser?.emailId !==
                            subMenu.selectedFacilitator
                        }
                        onClick={() =>
                          navigate(`/basic/sessions/report/${subMenu.humanId}`)
                        }
                      >
                        <ButtonLabelTypography label="VIEW SUMMARY" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <CaptionRegularTypography
                        style={{ wordBreak: 'break-word' }}
                        label={'Link : ' + subMenu.joinUrl}
                      />
                      {subMenu.retroStatus === 'started' ? (
                        <Button
                          variant="outlined"
                          sx={{ borderRadius: '24px', fontWeight: '500px' }}
                          color="primary"
                          onClick={() =>
                            navigate(`/basic/sessions/join/${subMenu.humanId}`)
                          }
                        >
                          <ButtonLabelTypography label="JOIN SESSION" />
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          sx={{ borderRadius: '24px', fontWeight: '500px' }}
                          color="primary"
                          disabled={
                            gUser.azureUser?.emailId !== subMenu.creatorId &&
                            gUser.azureUser?.emailId !==
                              subMenu.selectedFacilitator
                          }
                          onClick={() =>
                            navigate(`/basic/sessions/join/${subMenu.humanId}`)
                          }
                        >
                          <ButtonLabelTypography label="START SESSION" />
                        </Button>
                      )}
                    </>
                  )}
                </Box>
              );
            })}
          </Box>
          {/* Analytics start here */}
          <Box
            minHeight="540px"
            sx={{
              boxShadow: '10px 10px 40px 20px rgba(21, 154, 221, 0.08)',
              border: '1px solid rgba(250, 250, 250, 1)',
              marginTop: '10px',
              overflowX: 'auto',
            }}
          >
            {/* Analytics label */}
            <Box
              style={{
                marginLeft: '16px',
                marginTop: '16px',
                marginBottom: '30px',
              }}
            >
              <H4RegularTypography label="Analytics" />
            </Box>
            {/* Analytics Chart */}
            <Box display="flex" width="100%" paddingLeft="10px">
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
                    if (
                      gUser.azureUser?.roleName &&
                      gUser.azureUser?.roleName === BASIC
                    ) {
                      navigate('/basic/analytics/enterpriseLevelActionsCount');
                    } else if (
                      gUser.azureUser?.roleName &&
                      gUser.azureUser?.roleName === ENTERPRISE
                    ) {
                      navigate(
                        '/enterprise/analytics/enterpriseLevelActionsCount'
                      );
                    }
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
              </Box>
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
                </Box>
                <Box
                  onClick={() => {
                    if (
                      gUser.azureUser?.roleName &&
                      gUser.azureUser?.roleName === BASIC
                    ) {
                      navigate(
                        '/basic/analytics/enterpriseLevelParticipantsCount'
                      );
                    } else if (
                      gUser.azureUser?.roleName &&
                      gUser.azureUser?.roleName === ENTERPRISE
                    ) {
                      navigate(
                        '/enterprise/analytics/enterpriseLevelParticipantsCount'
                      );
                    }
                  }}
                >
                  <AverageParticipantChart
                    dashboard={true}
                    team={selectId}
                    totalParticipantsCount={count => {
                      setTotalParticipants(count);
                    }}
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
                    if (
                      gUser.azureUser?.roleName &&
                      gUser.azureUser?.roleName === BASIC
                    ) {
                      navigate(
                        '/basic/analytics/enterpriseLevelSentimentsMoods'
                      );
                    } else if (
                      gUser.azureUser?.roleName &&
                      gUser.azureUser?.roleName === ENTERPRISE
                    ) {
                      navigate(
                        '/enterprise/analytics/enterpriseLevelSentimentsMoods'
                      );
                    }
                  }}
                >
                  <EnterpriseLevelSentimentsMoodsChart
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

export default BasicDashboardWithEnterprise;
