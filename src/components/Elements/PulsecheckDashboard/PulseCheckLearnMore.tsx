import commonStyles from '../../../style.module.scss';
import { Box, Grid, List, ListItem, Paper, Typography } from '@mui/material';
import * as Icons from 'heroicons-react';
import { useNavigate } from 'react-router-dom';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import {
  REGULAR_USER,
  ENTERPRISE_ADMIN,
  REGULAR_ENTERPRISE,
} from '../../../constants/applicationConst';

export default function PulseCheckLearnMore() {
  const navigate = useNavigate();
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  // Function to navigate on pulseCheckListTemplate
  function goToPulseCheckList() {
    if (tempLocalUserData && tempLocalUserData.roleName === REGULAR_USER) {
      navigate('/facilitator/templates/pulseCheckListTemplate/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === ENTERPRISE_ADMIN
    ) {
      navigate('/enterprise/templates/pulseCheckListTemplate/');
    } else if (
      tempLocalUserData &&
      tempLocalUserData.roleName === REGULAR_ENTERPRISE
    ) {
      navigate('/enterprise/templates/pulseCheckListTemplate/');
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
            label="Template "
            style={{
              color: '#00E',
              cursor: 'pointer',
              textDecorationLine: 'underline',
            }}
            onClick={goToPulseCheckList}
          />
          <BodySemiBoldTypography
            label="\ Pulse Check Template "
            style={{
              color: '#00E',
              cursor: 'pointer',
              textDecorationLine: 'underline',
            }}
            onClick={goToPulseCheckList}
          />
          <BodySemiBoldTypography label="\ Simple" style={{}} />
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
            onClick={goToPulseCheckList}
          />
          <H2SemiBoldTypography
            label="Simple (3 Questions)"
            style={{ color: commonStyles.PrimaryDark, marginLeft: '16px' }}
          />
        </Box>

        <Grid container spacing={0} className="retroContainer">
          {/* About Pulse Check */}
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
              About Pulse Check
            </Box>
          </Grid>
          {/* What is Simple Pulse Check Template */}
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
                What is Simple Pulse Check Template
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                An oldie but a goodie, also known as the PPT Framework created
                in the 60s, it has long been the benchmark to understanding
                workforce management. Adapting to the framework, we have created
                these simple three questions for an incredibly quick and useful
                pulse check.
              </Typography>
            </Grid>
          </Grid>
          {/* Question 1 */}
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
                Question 1
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Let the team know how you feel about the team’s People and
                Resources.
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Assess whether your team maintains clear roles & decision
                making, adequate funding, efficient team structure, adequate
                skills & capabilities, great career opportunities, and active
                knowledge share.
              </Typography>
            </Grid>
          </Grid>
          {/* Question 2 */}
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
                Question 2
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Let the team know how you feel about the team’s Work Processes.
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Assess whether your team maintains clear goal setting, frequent
                planning and prioritisation, regular feedback loops, quick test
                and learn, and consistent cadence & transparency of work.
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Don’t forget to assign the action for a team member to complete.
              </Typography>
            </Grid>
          </Grid>
          {/* Question 3 */}
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
                Question 3
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Let the team know how you feel about the team’s Technical Tools.
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Assess whether your team has the necessary tools to collaborate
                and work efficiently, and a modular architecture that minimise
                dependency and maximise delivery.
              </Typography>
            </Grid>
          </Grid>
          {/* Bullet Points */}
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
                A pulse check is a quick and easy opportunity for teams to:
              </Typography>
              <List
                sx={{
                  listStyleType: 'disc',
                  pl: 2,
                  '& .MuiListItem-root': {
                    display: 'list-item',
                  },
                }}
              >
                <ListItem>
                  <Typography className="templateDescription" component="div">
                    provide feedback when at times, we are poor in time to do a
                    full retro;
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className="templateDescription" component="div">
                    track capability trends (improving or declining) across each
                    of the questions and categories when it is done regularly;
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className="templateDescription" component="div">
                    identify and discuss any hotspots or areas of concern; and
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography className="templateDescription" component="div">
                    compare and contrast to the retro board to identify
                    consistent or common themes to ensure that the team are
                    tackling the most important issues.
                  </Typography>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}
