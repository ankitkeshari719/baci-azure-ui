import {
  Box,
  Button,
  createTheme,
  SelectChangeEvent,
  ThemeProvider,
} from '@mui/material';

import * as React from 'react';

import ReactToPrint from 'react-to-print';

import * as Icons from 'heroicons-react';

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

import './EnterpriseDashboard.scss';

import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';

import Avatar from '../Avatar';

import AverageParticipantChart from '../../../screens/Analytics/AverageParticipantChart';

import EnterpriseLevelActionsCountChart from '../../../screens/Analytics/EnterpriseLevelActionsCountChart';

import { useNavigate } from 'react-router-dom';

import EnterpriseLevelSentimentsMoodsChart from '../../../screens/Analytics/EnterpriseLevelSentimentsMoodsChart';

import TeamLevelActionsCountChart from '../../../screens/Analytics/TeamLevelActionsCountChart';

import { retro } from '../../../helpers/DemoConst';

import EnterpriseLevelSentimentsThemeChart from '../../../screens/Analytics/EnterpriseLevelSentimentsThemeChart';
import DateSelector from './DateSelector';
import { useState } from 'react';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import EnterpriseLevelSentimentsSummaryChart from '../../../screens/Analytics/EnterpriseLevelSentimentsSummaryChart';

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

function EnterpriseDashboard() {
  const navigate = useNavigate();

  const [hoverOnMenu, setHoverOnMenu] = React.useState<Boolean>(false);

  const [hoverIndex, setHoverIndex] = React.useState<number>(0);

  const [selectId, setSelectedId] = React.useState<string>('0');

  const retroList = retro;

  let componentRef = React.useRef(null);

  const [path, setPath] = React.useState(
    location.pathname.includes('facilitator')
      ? 'facilitator'
      : location.pathname.includes('enterprise')
      ? 'enterprise'
      : 'facilitator'
  );

  const [global, dispatch] = React.useContext(GlobalContext);
  const [fromDate, setFromDate] = useState<string>(
    global.chartStartDate ? global.chartStartDate : '10'
  );
  const [toDate, setToDate] = useState<string>(
    global.chartEndDate ? global.chartEndDate : '16'
  );

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

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
        padding="10px"
        ref={componentRef}
        id="scrollableDiv"
      >
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
          id="non_print_box_1"
        >
          {/* Enterprise Dashboard label */}

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
              >
                JOIN SESSION
              </Button>

              {/* <Box component="span" width="20px" /> */}

              <Button
                variant="contained"
                color="secondary"
                sx={{ marginLeft: '20px', borderRadius: '10px' }}
              >
                <span style={{ color: 'white' }}>NEW SESSION</span>
              </Button>
            </ThemeProvider>
          </Box>
        </Box>

        {/* Bottom container */}

        <Box
          display="flex"
          flexDirection="column"
          sx={{ overflow: 'auto' }}
          id="non_print_box_2"
        >
          {/* Teams list menu start */}

          <Box display="flex" flexDirection="row" width="100%" mt="10px">
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
          </Box>

          {/* Retro list starts here after hover */}

          <Box
            width="calc(100% - 100px)"
            height="241px"
            sx={{
              background: 'white',

              display: hoverOnMenu ? 'flex' : 'none',

              flexDirection: 'row',

              alignItems: 'center',

              position: 'absolute',

              top: '140px',

              zIndex: '4',

              cursor: 'pointer',

              overflowX: 'auto',
            }}
          >
            {/* RetroCard Info */}

            {menuList[hoverIndex].retros.map((subMenu, index) => {
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
                      subMenu.retroStatus == 'Done'
                        ? subMenu.retroDate
                        : 'Code : ' + subMenu.retroCode
                    }
                  />

                  {subMenu.retroStatus == 'Done' ? (
                    <>
                      <CaptionSemiBoldTypography
                        label={subMenu.actions + ' Actions'}
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
                        label={
                          'Link : ' + 'http://app.baci.com/' + subMenu.retroCode
                        }
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

              background: 'white',
            }}
            onMouseEnter={() => {
              setHoverOnMenu(false);

              setHoverIndex(+selectId);
            }}
          >
            {/* Analytics label */}

            <Box
              sx={{
                display: 'flex',

                flexDirection: 'row',

                alignItems: 'center',

                marginLeft: '16px',

                marginTop: '16px',

                marginBottom: '32px',
                width: 'calc(100% - 16px)',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <H4RegularTypography label="Analytics" />

                <ReactToPrint
                  trigger={() => (
                    <Icons.DownloadOutline
                      size={20}
                      color="#4E4E4E"
                      style={{
                        cursor: 'pointer',

                        marginLeft: '16px',
                      }}
                    />
                  )}
                  content={() => componentRef.current}
                />
              </Box>
              <DateSelector
                handleFromDate={handleFromDate}
                handleToDate={handleToDate}
                fromDate={fromDate}
                toDate={toDate}
              />
            </Box>

            <Box
              display="flex"
              width="100%"
              paddingLeft="10px"
              flexWrap="wrap"
              rowGap={'10px'}
            >
              {/* Average Participant Chart */}

              <Box
                className="chartCard"
                onClick={() => {
                  navigate(
                    '/enterprise/analytics/enterpriseLevelParticipantsCount'
                  );
                }}
              >
                <AverageParticipantChart dashboard={true} team={selectId} />

                <CaptionRegularTypography label="Count Of All Participants Over Time" />
              </Box>

              {/* Enterprise Level Sentiments Moods Chart */}

              <Box
                className="chartCard"
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

                <CaptionRegularTypography label=" Participants Sentiments - Moods" />
              </Box>

              {/* Enterprise Level Actions Count Chart */}

              <Box
                className="chartCard"
                onClick={() => {
                  navigate('/enterprise/analytics/enterpriseLevelActionsCount');
                }}
              >
                <EnterpriseLevelActionsCountChart
                  dashboard={true}
                  team={selectId}
                />

                <CaptionRegularTypography label="Count Of Actions (Assigned vs Completed)" />
              </Box>

              {/* Team Level Actions Count Chart */}

              <Box
                className="chartCard"
                onClick={() => {
                  navigate('/enterprise/analytics/teamLevelActionsCount');
                }}
              >
                <TeamLevelActionsCountChart dashboard={true} />

                <CaptionRegularTypography label="Team Level Actions (Assigned vs Completed)" />
              </Box>

              {/* Enterprise Level Sentiments Theme Chart */}

              <Box
                className="chartCard"
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

                <CaptionRegularTypography label="Enterprise Level - Sentiments - Key Themes Heatmap" />
              </Box>
              <Box
                className="chartCard"
                id="EnterpriseLevelSentimentsSummaryChart_Print"
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

                <CaptionRegularTypography label="Enterprise Level - Overall Summary" />
              </Box>
            </Box>
          </Box>
        </Box>

        {/************************************* Print Box *******************************/}

        {/* Label Print */}

        <Box component="span" id="label_print" style={{ display: 'none' }}>
          <H1RegularTypography
            label="Enterprise Dashboard - Analytics

"
          />
        </Box>

        {/* Average Participant Chart Print */}

        <Box
          className="chartCard"
          id="AverageParticipantChart_Print"
          style={{ display: 'none', marginTop: '24px' }}
        >
          <AverageParticipantChart dashboard={true} team={selectId} />

          <CaptionRegularTypography label="Count of all participants over time" />
        </Box>

        {/* Enterprise Level Sentiments Moods Chart Print */}

        <Box
          className="chartCard"
          id="EnterpriseLevelSentimentsMoodsChart_Print"
          style={{ display: 'none' }}
        >
          <EnterpriseLevelSentimentsMoodsChart
            dashboard={true}
            team={selectId}
          />

          <CaptionRegularTypography label=" Participants Sentiments - Moods" />
        </Box>

        {/* Enterprise Level Actions Count Chart Print*/}

        <Box
          className="chartCard"
          id="EnterpriseLevelActionsCountChart_Print"
          style={{ display: 'none' }}
        >
          <EnterpriseLevelActionsCountChart dashboard={true} team={selectId} />

          <CaptionRegularTypography label="Count of actions (Assigned vs Completed)" />
        </Box>

        {/* Team Level Actions Count Chart Print */}

        <Box
          className="chartCard"
          id="TeamLevelActionsCountChart_Print"
          style={{ display: 'none' }}
        >
          <TeamLevelActionsCountChart dashboard={true} />

          <CaptionRegularTypography label="Count of actions (Assigned vs Completed)" />
        </Box>

        {/* Enterprise Level Sentiments Theme Chart Print */}

        <Box
          className="chartCard"
          id="EnterpriseLevelSentimentsThemeChart_Print"
          style={{ display: 'none' }}
        >
          <EnterpriseLevelSentimentsThemeChart
            dashboard={true}
            team={selectId}
          />

          <CaptionRegularTypography label="Enterprise Level - Sentiments - Key Themes Heatmap" />
        </Box>
        <Box
          className="chartCard"
          id="EnterpriseLevelSentimentsSummaryChart_Print"
          style={{ display: 'none' }}
        >
          <EnterpriseLevelSentimentsSummaryChart
            dashboard={true}
            team={selectId}
          />

          <CaptionRegularTypography label="Enterprise Level - Overall Summary" />
        </Box>
      </Box>
    </>
  );
}

export default EnterpriseDashboard;
