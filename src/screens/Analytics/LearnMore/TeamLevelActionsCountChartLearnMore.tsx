import commonStyles from '../../../style.module.scss';
import { Box, Grid, List, ListItem, Paper, Typography } from '@mui/material';
import * as Icons from 'heroicons-react';
import { useNavigate } from 'react-router-dom';
import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  H2SemiBoldTypography,
  H6RegularTypography,
} from '../../../components/CustomizedTypography';
import * as React from 'react';
import { BASIC, ENTERPRISE } from '../../../constants/applicationConst';

export default function TeamLevelActionsCountChartLearnMore() {
  const navigate = useNavigate();
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  // Function to navigate on analytics
  function goToDashboard() {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/analytics');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      navigate('/enterprise/analytics');
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgb(249 251 252)',
        padding: '24px 48px',
        overflowY: 'scroll !important',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <BodyRegularTypography
          label="Analytics "
          style={{
            color: '#00E',
            cursor: 'pointer',
            textDecorationLine: 'underline',
          }}
          onClick={goToDashboard}
        />
        <H6RegularTypography
          label="\  Count of Team Actions (Assigned vs Completed)"
          style={{ color: '#4E4E4E' }}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="flex-start"
        sx={{ marginTop: '12px' }}
      >
        <Icons.ArrowCircleLeftOutline
          size={20}
          style={{
            width: '24px',
            height: '24px',
            display: 'block',
            right: '0px',
            color: '#159ADD',
            fontSize: '14px',
            cursor: 'pointer',
          }}
          onClick={goToDashboard}
        />
        <H2SemiBoldTypography
          label=" Count of Team Actions (Assigned vs Completed)"
          style={{ color: commonStyles.PrimaryDark, marginLeft: '16px' }}
        />
      </Box>
      <Paper
        sx={{
          border: ' 1px solid #FAFAFA',
          background: '#FFF',
          boxShadow: '10px 10px 40px 20px rgba(21, 154, 221, 0.08)',
          marginTop: '24px',
        }}
      >
        <Grid container spacing={0} sx={{ padding: '24px' }}>
          {/* About  Count of Team Actions (Assigned vs Completed) */}
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
              About Count of Team Actions (Assigned vs Completed)
            </Box>
          </Grid>
          {/* Data */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '50%',
            }}
          >
            {/* What is Simple  Count of Team Actions (Assigned vs Completed) Template */}
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  className="templateDescription"
                  component="div"
                  sx={{ mt: 2 }}
                >
                  BACI helps to track and report on valuable improvement actions
                  for teams to realise it’s benefits.
                </Typography>
                <ul>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      Track the level of improvement action developed by each
                      team
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      Understand if actions are being completed vs assigned
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      Monitor the completion of improvement actions is
                      fundamental to teams improvement{' '}
                    </Typography>
                  </li>
                </ul>
              </Grid>
            </Grid>
            {/* How to read graph */}
            <Grid container mt={6}>
              <Grid
                item
                xs={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Typography className="aboutTemplate" component="div">
                  How to read graph
                </Typography>

                <Typography
                  className="templateDescription"
                  component="div"
                  sx={{ mt: 2 }}
                >
                  The graph shows the break down of total actions created for
                  each of your team. Total actions are broken into Assigned vs
                  Completed.
                </Typography>
                <Typography
                  className="templateDescription"
                  component="div"
                  sx={{ mt: 2 }}
                >
                  Things to look out for on this graph:
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <ol>
                    <li>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        For each individual team, the aim is to have more
                        actions completed than assigned to ensure that valuable
                        improvement actions are indeed completed & embedded into
                        the team to realise it’s benefits.
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        Comparisons can be made to compare number of total,
                        assigned and completed actions between teams to better
                        understand relative performance between the teams e.g.
                        Team A has less actions then Team B but this is normal
                        as Team A is a much smaller team.
                      </Typography>
                    </li>
                  </ol>
                </Box>
                <Typography
                  className="templateDescription"
                  component="div"
                  sx={{ mt: 2 }}
                >
                  High performing & continuously improving teams often assign &
                  complete more actions than their peers!{' '}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          {/* Image */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '50%',
              paddingLeft: '16px',
            }}
          >
            {/* Image */}
            <Grid container>
              <Grid
                item
                xs={12}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <img
                  src="/images/AnalyticsLearnMore_1.png"
                  width={600}
                  height={500}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Paper>
    </Box>
  );
}
