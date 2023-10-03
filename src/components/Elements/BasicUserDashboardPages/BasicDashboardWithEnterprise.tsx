import * as React from 'react';
import { Box, Button, ThemeProvider, createTheme, styled } from '@mui/material';
import { Grid } from '@mui/material';
import BACITemplate from '../../../assets/img/BACI Template.png';
import UploadImage from '../../../assets/img/Upload Image or Photo.png';
import Backdrop from '@mui/material/Backdrop';

import {
  ButtonLabelTypography,
  CaptionRegularTypography,
  CaptionSemiBoldTypography,
  H1RegularTypography,
  H4RegularTypography,
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
  const navigate = useNavigate();
  const [selectId, setSelectedId] = React.useState<string>('0');
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const menuList = [
    {
      id: '0',
      label: 'Mobile Experience Team',
      actions: 'VIEW 15 ACTIONS',
      isSelected: true,
    },
    {
      id: '1',
      label: 'Superannuation Product Team',
      actions: 'VIEW 5 ACTIONS',
      isSelected: false,
    },
    {
      id: '2',
      label: 'Insurance Team',
      actions: 'VIEW 15 ACTIONS',
      isSelected: false,
    },
  ];

  const subMenuList = [
    {
      retroName: 'Mobile App Design BACI Session 3',
      retroCode: '54727',
      retroLink: 'http://app.baci.com/54727',
      retroStartDate: '',
      totalActions: '4',
      isRetroFinished: false,
      users: [
        { name: 'Sean Woon', avatar: 'Animals-avatar_2avatar' },
        { name: 'Manisha', avatar: 'Animals-avatar_7avatar' },
        { name: 'Ankit', avatar: 'Animals-avatar_11avatar' },
        { name: 'Rajesh', avatar: 'Animals-avatar_19avatar' },
        { name: 'Vishal', avatar: 'Animals-avatar_21avatar' },
        { name: 'Tatayana', avatar: 'Animals-avatar_30avatar' },
        { name: 'Benny', avatar: 'Animals-avatar_28avatar' },
        { name: 'Amol', avatar: 'Animals-avatar_31avatar' },
        { name: 'Mayuri', avatar: 'Animals-avatar_12avatar' },
      ],
    },

    {
      retroName: 'Mobile App Design BACI Session 2',
      retroCode: '54149',
      retroLink: 'http://app.baci.com/54149',
      retroStartDate: 'April 19, 2023',
      totalActions: '4',
      isRetroFinished: true,
      users: [
        { name: 'Sean Woon', avatar: 'Animals-avatar_2avatar' },
        { name: 'Manisha', avatar: 'Animals-avatar_7avatar' },
        { name: 'Rajesh', avatar: 'Animals-avatar_19avatar' },
        { name: 'Vishal', avatar: 'Animals-avatar_21avatar' },
        { name: 'Tatayana', avatar: 'Animals-avatar_30avatar' },
        { name: 'Amol', avatar: 'Animals-avatar_31avatar' },
        { name: 'Mayuri', avatar: 'Animals-avatar_12avatar' },
      ],
    },
    {
      retroName: 'Mobile App Design BACI Session 1',
      retroCode: '53122',
      retroLink: 'http://app.baci.com/53122',
      retroStartDate: 'April 19, 2023',
      totalActions: '5',
      isRetroFinished: true,
      users: [
        { name: 'Sean Woon', avatar: 'Animals-avatar_2avatar' },
        { name: 'Manisha', avatar: 'Animals-avatar_7avatar' },
        { name: 'Ankit', avatar: 'Animals-avatar_11avatar' },
        { name: 'Rajesh', avatar: 'Animals-avatar_19avatar' },
        { name: 'Vishal', avatar: 'Animals-avatar_21avatar' },
        { name: 'Tatayana', avatar: 'Animals-avatar_30avatar' },
        { name: 'Benny', avatar: 'Animals-avatar_28avatar' },
        { name: 'Amol', avatar: 'Animals-avatar_31avatar' },
        { name: 'Mayuri', avatar: 'Animals-avatar_12avatar' },
      ],
    },
  ];

  const navigateToJoinSession = () => {
    navigate('/basic/joinRetro/');
  };

  const navigateToCreateSession = () => {
    navigate('/basic/createRetro/');
  };

  const navigateToUploadImage = () => {
    navigate('/basic/scanImage/');
  };

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
          {/* Teams list menu start */}
          <Box display="flex" flexDirection="row" width="100%" mt="10px">
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
          </Box>
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
            }}
          >
            {/* RetroCard Info */}
            {subMenuList.map((subMenu, index) => {
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
                  <H6SemiBoldTypography label={subMenu.retroName} />
                  <CaptionRegularTypography
                    label={
                      subMenu.isRetroFinished
                        ? subMenu.retroStartDate
                        : 'Code : ' + subMenu.retroCode
                    }
                  />
                  {subMenu.isRetroFinished ? (
                    <>
                      <CaptionSemiBoldTypography
                        label={subMenu.totalActions + ' Actions'}
                        style={{ color: commonStyles.PrimaryMain }}
                      />
                      <Box>
                        <CaptionRegularTypography label="Participants " />
                        {subMenu.users.map((user, index) => {
                          {
                            return (
                              index < 4 && (
                                <Avatar
                                  key={user.name}
                                  avatar={user.avatar}
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
                        })}
                        <CaptionRegularTypography
                          style={{ marginLeft: '14px' }}
                          label={'+' + (subMenu.users.length + 1 - 4)}
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <CaptionRegularTypography
                        label={'Link : ' + subMenu.retroLink}
                      />
                      <Button
                        variant="outlined"
                        sx={{ borderRadius: '24px', fontWeight: '500px' }}
                        color="primary"
                      >
                        <ButtonLabelTypography label="START SESSION" />
                      </Button>
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
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mr="20px"
                sx={{
                  border: '1px solid rgba(240, 240, 240, 1)',
                  padding: '10px',
                  cursor: 'pointer',
                }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <CaptionRegularTypography label="Count of actions (Assigned vs Completed)" />
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
                    navigate('/basic/analytics/enterpriseLevelActionsCount');
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
                        '/basic/analytics/enterpriseLevelActionsCountLearnMore'
                      )
                    }
                  />
                </Box> */}
              </Box>
              {/* Average Participant Chart */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mr="20px"
                sx={{
                  border: '1px solid rgba(240, 240, 240, 1)',
                  padding: '10px',
                  cursor: 'pointer',
                }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <CaptionRegularTypography label="Count of all participants over time" />
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
                      '/basic/analytics/enterpriseLevelParticipantsCount'
                    );
                  }}
                >
                  <AverageParticipantChart dashboard={true} team={selectId} />
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
                        '/basic/analytics/enterpriseLevelParticipantsCountLearnMore'
                      )
                    }
                  />
                </Box> */}
              </Box>
              {/* Enterprise Level Sentiments Moods Chart */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mr="20px"
                sx={{
                  border: '1px solid rgba(240, 240, 240, 1)',
                  padding: '10px',
                  cursor: 'pointer',
                }}
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <CaptionRegularTypography label="Sentiments - Moods" />
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
                      '/basic/analytics/enterpriseLevelParticipantsCount'
                    );
                  }}
                >
                  <EnterpriseLevelSentimentsMoodsChart
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
                        '/basic/analytics/enterpriseLevelParticipantsCountLearnMore'
                      )
                    }
                  />
                </Box> */}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default BasicDashboardWithEnterprise;
