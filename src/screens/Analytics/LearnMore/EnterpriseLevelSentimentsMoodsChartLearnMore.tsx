import commonStyles from '../../../style.module.scss';
import { Box, Grid, List, ListItem, Paper, Typography } from '@mui/material';
import * as Icons from 'heroicons-react';
import { useNavigate } from 'react-router-dom';
import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../../components/CustomizedTypography';
import * as React from 'react';
import {
  BASIC,
  ENTERPRISE_ADMIN,
  ENTERPRISE,
} from '../../../constants/applicationConst';

export default function EnterpriseLevelSentimentsMoodsChartLearnMore() {
  const navigate = useNavigate();
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  // Function to navigate on analytics
  function goToDashboard() {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/analytics');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      navigate('/enterpriseAdmin/analytics');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/analytics');
    }
  }

  return (
    <>
      <Paper
        sx={{
          width: '100%',
          background: 'rgb(249 251 252)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}
        >
          <BodySemiBoldTypography
            label="Analytics "
            style={{
              color: '#00E',
              cursor: 'pointer',
              textDecorationLine: 'underline',
            }}
            onClick={goToDashboard}
          />
          <BodySemiBoldTypography label="\ Sentiments - Mood" style={{}} />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
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
            label="Sentiments - Mood"
            style={{ color: commonStyles.PrimaryDark, marginLeft: '16px' }}
          />
        </Box>
        <Grid container spacing={0} className="retroContainer">
          {/* About Sentiments - Mood */}
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
              About Sentiments - Mood
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
                <Typography
                  className="templateDescription"
                  component="div"
                  sx={{ mt: 2 }}
                >
                  BACI helps to visualise organisational wide dynamics and
                  sentiments to build awareness of how people are feeling.
                  Sentiment trends and patterns allows organisations to
                  accelerate continuous improvement by:
                </Typography>
                <ul>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      optimising people performance & capabilities,
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      be effective in storytelling to motivate and inspire the
                      organisation,
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      allocating resources effectively,
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      planning and prioritising the most important initiatives,
                      and
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      className="templateDescription"
                      component="div"
                      sx={{ mt: 2 }}
                    >
                      shaping strategies/business cases towards growth.
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
                  The chart takes the results from the pulse check and uses AI
                  to capture words used in BACI collaboration sessions to
                  provide a simple chart of how your people are feeling (Happy,
                  Sad, Neutral) from month-to-month.
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
                        Sure the goal may be to have everyone to be happy,
                        however this may not always be a snapshot of reality.
                        Understand if there are any unintended biases in the
                        results through team/human discussions.
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        Neutral and Sad feelings are in0-fact valuable
                        opportunities to uncover and resolve any hidden
                        blockers.
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        Do not just consider monthly results in isolation, it is
                        more important to pay close attention to the overall
                        trend for each mood and to action early to shift
                        negative trends
                      </Typography>
                    </li>
                  </ol>
                </Box>
                <Typography
                  className="templateDescription"
                  component="div"
                  sx={{ mt: 2 }}
                >
                  High performing & continuously improving teams are not only
                  happier, they respect and approach neutral and sad moments as
                  a great learning opportunity to further grow and always has
                  actions to continuously improve moods.
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
                  src="/images/AnalyticsLearnMore_4.png"
                  width={600}
                  height={500}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Paper>
    </>
  );
}
