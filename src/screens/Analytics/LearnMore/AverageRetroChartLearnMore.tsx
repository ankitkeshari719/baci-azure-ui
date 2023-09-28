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

export default function AverageRetroChartLearnMore() {
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
          label="\  Count of All Sessions"
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
          label=" Count of All Sessions"
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
          {/* About  Count of All Sessions */}
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
              About Count of All Sessions
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
                  BACI helps to measure level of regular employee collaboration
                  to inform mindset change towards continuous improvement
                </Typography>
                <ul>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      Track the number of BACI sessions
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      Number of sessions informs the level of repeated team
                      cohesion and progress{' '}
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
                  The graph shows the total number of sessions across all your
                  teams over time.
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
                        Consistent or increasing number of session from
                        month-to-month is key to ensure that levels of
                        collaboration is not a one-off exercise and signs that
                        mindset shifts are taking place.
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        This is different to just the level of participation as
                        it is also a positive sign if a small number of people
                        are doing many sessions
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        Don’t read this graph in isolation. E.g. completing
                        sessions are sub-optimal to continuous improvement if
                        the improvement actions are not completed.
                      </Typography>
                    </li>
                  </ol>
                </Box>
                <Typography
                  className="templateDescription"
                  component="div"
                  sx={{ mt: 2 }}
                >
                  High performing & continuously improving teams no matter how
                  big or small collaborate often and consistently.
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
                  src="/images/AnalyticsLearnMore_3.png"
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
