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

export default function EnterpriseLevelSentimentsSummaryChartLearnMore() {
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
          label="\  Overall Summary - Paragraph and Word Cloud"
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
          label=" Overall Summary - Paragraph and Word Cloud"
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
          {/* About  Overall Summary - Paragraph and Word Cloud */}
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
              About Overall Summary - Paragraph and Word Cloud
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
            {/* How to read the summary */}
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
                  How to read the summary
                </Typography>

                <Typography
                  className="templateDescription"
                  component="div"
                  sx={{ mt: 2 }}
                >
                  The summary uses AI to capture words used in BACI
                  collaboration sessions and produces simple, useful and
                  powerful summary paragraph and word cloud to gain valuable
                  data driven insights on your teams mindset and culture.
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
                        Use the summary paragraph as a basis for storytelling to
                        motivate and inspire the organisation
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        Word clouds are an effective visual tool to quickly
                        understand themes & sentiments for the entire
                        organisation
                      </Typography>
                    </li>
                    <li>
                      <Typography
                        className="templateDescription"
                        component="div"
                        sx={{ mt: 2 }}
                      >
                        Summaries are a great way to effectively communicate key
                        highlights to stakeholders on a regular basis
                      </Typography>
                    </li>
                  </ol>
                </Box>
                <Typography
                  className="templateDescription"
                  component="div"
                  sx={{ mt: 2 }}
                >
                  High performing & continuously improving teams live & consume
                  data to effectively summarise, communicate & understand the
                  current status to better steer the organisation towards
                  growth.
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
                <Typography className="aboutTemplate" component="div">
                  Sample Summary
                </Typography>
                <img
                  src="/images/AnalyticsLearnMore_6.png"
                  width={600}
                  height={650}
                  style={{ marginTop: '16px' }}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Paper>
    </Box>
  );
}
