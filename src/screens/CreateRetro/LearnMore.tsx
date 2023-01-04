import * as React from 'react';
import { AppBar, Box, Button, Divider, Grid, Toolbar } from '@mui/material';
import '../../global.scss';
import './styles.scss';
import { TopBar } from './TopBar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

type Props = {
  handleClose: () => void;
};

export function LearnMore({ handleClose }: Props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <TopBar />
      <Box component="main" className="retroContainer">
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              className="createRetroText"
            >
              About Template
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ mt: 1 }}>
            <AppBar position="static" className="logoContainer">
              <Toolbar variant="dense">
                <IconButton
                  edge="start"
                  color="primary"
                  onClick={handleClose}
                  aria-label="close"
                >
                  <ArrowBackOutlinedIcon />
                </IconButton>
                <Typography
                  sx={{ ml: 1, flex: 1 }}
                  component="div"
                  className="selectedTemplate"
                >
                  Sailboat
                </Typography>
                <Button autoFocus variant="outlined" size="small">
                  Customize
                </Button>
                <Button
                  autoFocus
                  variant="contained"
                  size="small"
                  sx={{ ml: 1 }}
                >
                  Save
                </Button>
              </Toolbar>
            </AppBar>
          </Grid>
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <span className="text_one">This is a for </span>
              <span className="text_two">&nbsp;classic template</span>
              <span className="text_one">&nbsp;retros</span>.
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <span className="text_one">It’s straight to the point to</span>
              <span className="text_two">&nbsp;reflect</span>
              <span className="text_one">&nbsp;on the team’s</span>
              <span className="text_two">&nbsp;performance</span>.
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              mt: 2,
            }}
          >
            <Divider />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <Typography className="aboutTemplate" component="div">
                About Simple (Default)
              </Typography>
              <Typography className="templateDescription" component="div">
                The simplest template to do your retro. So easy that we have
                made this our default template.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="div"
              whiteSpace="normal"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 2,
              }}
            ></Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
