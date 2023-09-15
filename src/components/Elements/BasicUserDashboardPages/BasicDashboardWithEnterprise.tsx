import * as React from 'react';
import { Box, Button, ThemeProvider, createTheme, styled } from '@mui/material';
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

function BasicDashboardWithEnterprise() {
  const navigate = useNavigate();
  const [selectId, setSelectedId] = React.useState<string>('0');

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
    navigate('/enterprise/joinRetro/');
  };

  const navigateToCreateSession = () => {
    navigate('/enterprise/createRetro/');
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
                      '/enterprise/analytics/enterpriseLevelParticipantsCount'
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
                        '/enterprise/analytics/enterpriseLevelParticipantsCountLearnMore'
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
                      '/enterprise/analytics/enterpriseLevelParticipantsCount'
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
                        '/enterprise/analytics/enterpriseLevelParticipantsCountLearnMore'
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
