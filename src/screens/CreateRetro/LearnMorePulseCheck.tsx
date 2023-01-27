import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  Toolbar,
} from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { TopBar } from './TopBar';
import Typography from '@mui/material/Typography';
import * as Icons from 'heroicons-react';
import { pulseCheckInterface } from './const';

type Props = {
  selectedPulseCheck: pulseCheckInterface | null;
  closeLearnMoreDialog: () => void;
  handlePulseCheckSelectClick: (selectedTemplateId: any) => void;
};

export function LearnMorePulseCheck({
  selectedPulseCheck,
  closeLearnMoreDialog,
  handlePulseCheckSelectClick,
}: Props) {
  // Function to handle the select button click
  const onClickSelectButton = (templateId: string | null) => {
    handlePulseCheckSelectClick(templateId);
    closeLearnMoreDialog();
  };

  return (
    <Box className="mainContainer">
      <TopBar />
      <Grid container spacing={0} className="retroContainer">
        {/* About Template */}
        <Grid item xs={12}>
          <Box component="div" whiteSpace="normal" className="createRetroText">
            About Template
          </Box>
        </Grid>
        {/* App bar */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <AppBar position="static" className="learnMoreAppBar">
            <Toolbar
              variant="dense"
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '0px !important',
              }}
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
                onClick={closeLearnMoreDialog}
              />
              <Typography
                sx={{ ml: 1, flex: 1 }}
                component="div"
                className="selectedTemplate"
              >
                {selectedPulseCheck && selectedPulseCheck.name}
              </Typography>
              <Button
                autoFocus
                variant="contained"
                className="saveButton"
                sx={{ ml: 2 }}
                onClick={() =>
                  onClickSelectButton(
                    selectedPulseCheck && selectedPulseCheck.id
                  )
                }
              >
                <Typography className="saveButtonText" component="span">
                  Select
                </Typography>
              </Button>
            </Toolbar>
          </AppBar>
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
              An oldie but a goodie, also known as the PPT Framework created in
              the 60s, it has long been the benchmark to understanding workforce
              management. Adapting to the framework, we have created these
              simple three questions for an incredibly quick and useful pulse
              check.
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
              Assess whether your team maintains clear roles & decision making,
              adequate funding, efficient team structure, adequate skills &
              capabilities, great career opportunities, and active knowledge
              share.
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
                  compare and contrast to the retro board to identify consistent
                  or common themes to ensure that the team are tackling the most
                  important issues.
                </Typography>
              </ListItem>
            </List>
          </Grid>
        </Grid>
        {/* If you Enjoyed Learning and Reading. */}
        <Grid container mt={6}>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography className="likeAndShare" component="div">
              If you Enjoyed Learning and Reading.
            </Typography>
          </Grid>
        </Grid>
        {/* Do Drop a Like and Share it. */}
        <Grid container mt={1}>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center   ',
              flexDirection: 'column',
            }}
          >
            <Typography className="likeAndShare" component="div">
              Do Drop a Like and Share it.
            </Typography>
          </Grid>
        </Grid>
        {/* Do Drop a Like and Share it. */}
        <Grid container mt={3}>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center   ',
              flexDirection: 'row',
            }}
          >
            <Icons.ThumbUpOutline
              color="#159ADD"
              style={{
                width: '24px !important',
                height: '24px !important',
              }}
            />
            <Icons.ShareOutline
              size={20}
              color="#159ADD"
              style={{
                width: '24px !important',
                height: '24px !important',
                marginLeft: '32px',
              }}
            />
          </Grid>
        </Grid>
        {/* Do Drop a Like and Share it. */}
        <Grid container mt={3}>
          <Grid
            item
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center   ',
              flexDirection: 'row',
            }}
          >
            {' '}
            <Typography
              className="footerDescription"
              component="div"
            >
              #BACI #loveBACI #BACIRETRO
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
