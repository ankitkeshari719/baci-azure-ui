import commonStyles from '../../../style.module.scss';
import { Box, Divider, Grid, Paper, Typography } from '@mui/material';
import * as Icons from 'heroicons-react';
import { useNavigate } from 'react-router-dom';
import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import { BASIC, ENTERPRISE } from '../../../constants/applicationConst';

export default function TemplatesLearnMore() {
  const navigate = useNavigate();
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  // Function to navigate on retroListTemplate
  function goToRetroList() {
    if (tempLocalUserData && tempLocalUserData.roleName === BASIC) {
      navigate('/basic/templates/retroListTemplate/');
    } else if (tempLocalUserData && tempLocalUserData.roleName === ENTERPRISE) {
      navigate('/enterprise/templates/retroListTemplate/');
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
            onClick={goToRetroList}
          />
          <BodySemiBoldTypography
            label="\ Session Template "
            style={{
              color: '#00E',
              cursor: 'pointer',
              textDecorationLine: 'underline',
            }}
            onClick={goToRetroList}
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
            onClick={goToRetroList}
          />
          <H2SemiBoldTypography
            label="Simple Template"
            style={{ color: commonStyles.PrimaryDark, marginLeft: '16px' }}
          />
        </Box>

        <Grid container spacing={0} className="retroContainer">
          {/* About Template */}
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
              About Simple Template
            </Box>
          </Grid>
          {/* Text one */}
          <Grid item xs={12} sx={{ mt: 6 }}>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span className="text_one">This is a </span>
              <span className="text_two">&nbsp;classic template</span>
              <span className="text_one">&nbsp;for retros</span>.
            </Box>
          </Grid>
          {/* Text two */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span className="text_one">It’s straight to the point to</span>
              <span className="text_two">&nbsp;reflect</span>
              <span className="text_one">&nbsp;on the team’s</span>
              <span className="text_two">&nbsp;performance</span>.
            </Box>
          </Grid>
          {/* Divider */}
          <Grid item xs={12} sx={{ mt: 6 }}>
            <Divider />
          </Grid>
          {/* One */}
          <Grid container mt={6}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography className="aboutTemplate" component="div">
                About Simple (Default)
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                The simplest template to do your retro. So easy that we have
                made this our default template.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{ mt: 4 }}
                component="img"
                alt="Logo"
                src="/images/LearnMoreTwo.png"
              />
            </Grid>
          </Grid>
          {/* Two */}
          <Grid container mt={6}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{ mt: 4 }}
                component="img"
                alt="Logo"
                src="/images/whatWentWellImage.png"
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography className="aboutTemplate" component="div">
                What Went Well
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Embrace the positives!
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Share thoughts on the ‘wins’ and recognise individual or team
                achievements. Focus on the positives to energise the team and
                share awareness on strengths and capabilities.
              </Typography>
            </Grid>
          </Grid>
          {/* Three */}
          <Grid container mt={6}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography className="aboutTemplate" component="div">
                What Didn’t Go Well
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Team members share aspects of work that could improve. The
                mindset to this section is simply to find quick resolutions to
                any problem areas for the better of the team.
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Sharing and discussing this encourages open and honest
                collaboration and teamwork.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{ mt: 4 }}
                component="img"
                alt="Logo"
                src="/images/LearnMoreOne.png"
              />
            </Grid>
          </Grid>
          {/* Four */}
          <Grid container mt={6}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                sx={{ mt: 4 }}
                component="img"
                alt="Logo"
                src="/images/LearnMoreThree.png"
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography className="aboutTemplate" component="div">
                Manage Actions
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Identifying actions for the team to improve.
              </Typography>
              <Typography
                className="templateDescription"
                component="div"
                sx={{ mt: 2 }}
              >
                Typically, the team focuses on actions to resolve their most
                significant “What Didn’t Go Well”. Actions can however also be
                targeted at further celebrating the “What Did Go Well”, like
                getting Sarah to do another presentation 😉.
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
        </Grid>
      </Paper>
    </>
  );
}
