import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import LandingImage from '../assets/img/landingimage.png';
import BACILogo from '../assets/img/bacilogo.png';
import commomStyles from './../style.module.scss'

const styles = {
    mainDiv:{
        backgroundImage: `url(${LandingImage})`,
        top: '5.78%',
        bottom: '15.2%'
    },
  paperContainer: {
    height: '100vh',
    borderRadius: '0px',
    top: '4.74%',
    bottom: '15.2%',
    background: 'linear-gradient(180deg, rgba(1, 13, 19, 0.87) 0%, rgba(3, 19, 28, 0.740375) 23.15%, rgba(101, 200, 250, 0.13) 100%)'
  },
  slogan: {
    margin:'19.27% 40.21% 77.17% 6.04%'
  },
  sloganText:{
    fontFamily: 'Poppins',
    fontSize: '36px',
    fontWeight: '500',
    lineHeight: '48px',
    letterSpacing: ' 0.5px',
    color: commomStyles.grey,
    margin: '2px'
  },
  sloganTextGrow:{
    fontFamily: 'Poppins',
    fontSize: '36px',
    fontWeight: '500',
    lineHeight: '48px',
    letterSpacing: ' 0.5px',
    color: commomStyles.secondaryMain 
  },
  logoImage:{
    //position: 'absolute' as 'absolute',
    height: "49.5px",
    //width: "144px",
    margin:'6.04% 78.96% 8.67% 7.66%'
  },
  fullPoint:{
    margin: '2px',
    color: '#EE7538',
    fontSize: '36px'
  }
};

export function LandingLayout() {
   return(
    
          <Box>
            <div style={styles.mainDiv}>
              <Paper elevation={0} style={styles.paperContainer}>
                <Box>
                    <img
                        src={BACILogo}
                        alt="Logo"
                        style={styles.logoImage}
                        />
                    <Box component="span" style={styles.slogan}>
                        <span style={styles.sloganText}>Pause</span>
                        <span style={styles.fullPoint}> . </span>
                        <span  style={styles.sloganText}>Think</span>
                        <span style={styles.fullPoint}> . </span>
                        <span  style={styles.sloganText}>Act</span>
                        <span style={styles.fullPoint}> . </span>
                        <span style={styles.sloganTextGrow}>Grow</span>
                    </Box>
                </Box>
              </Paper>

              {/* <Typography>Pause</Typography><Typography>Think</Typography><Typography>Act</Typography><Typography>Grow</Typography> */}
            </div>
          </Box>
        
   );
}