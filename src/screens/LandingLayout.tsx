import { Box, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import LandingImage from '../assets/img/landingimage.png';
import BACILogo from '../assets/img/bacilogo.png';
import commomStyles from './../style.module.scss'
import theme from '../theme/theme';

const styles = {
    mainDiv:{
        backgroundImage: `url(${LandingImage})`,
        top: '5.78%',
        bottom: '15.2%',
    },
    mainDivXs:{
      backgroundImage: `url(${LandingImage})`,
      top: '5.78%',
      bottom: '15.2%',
      height: '33vh'
  },
  paperContainer: {
    height: '100vh',
    borderRadius: '0px',
    top: '4.74%',
    bottom: '15.2%',
    background: 'linear-gradient(180deg, rgba(1, 13, 19, 0.87) 0%, rgba(3, 19, 28, 0.740375) 23.15%, rgba(101, 200, 250, 0.13) 100%)'
  },
  paperContainerXs: {
    height:  '33vh',
    borderRadius: '0px',
    top: '4.74%',
    bottom: '15.2%',
    background: 'linear-gradient(180deg, rgba(1, 13, 19, 0.87) 0%, rgba(3, 19, 28, 0.740375) 23.15%, rgba(101, 200, 250, 0.13) 100%)'
  },
  slogan: {
    marginLeft: '58px',
    marginTop: '93px',
    display: 'flex'
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
    color: commomStyles.secondaryMain,
    margin: '2px'
  },
  logoImage:{
    //position: 'absolute' as 'absolute',
    height: "49.5px",
    marginTop: '53px',
    marginLeft: '58px'
  },
  logoImageXs:{
    //position: 'absolute' as 'absolute',
    height: "42px",
    
  },
  fullPoint:{
    margin: '2px',
    color: '#EE7538',
    fontSize: '36px'
  }
};

export function LandingLayout() {
  const isXsUp = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
   return(
    <><>
       {isXsUp ? (<Box >
         <div style={styles.mainDivXs}>
           <Box style={styles.paperContainerXs}>
            <Box  sx={{
              display:'flex' ,
              flexDirection:'column', 
              alignItems:'center',
              height: '100%',
              justifyContent: 'center'
            }}>
            <Box>
               <img
                 src={BACILogo}
                 alt="Logo"
                 style={styles.logoImageXs} />
             </Box>
             <Box display='flex' mt= '32px'>
               <Typography variant='h5' color={commomStyles.grey} mr='6px'>Pause</Typography>
               <Typography color={commomStyles.secondaryMain} mr='6px'>.</Typography>
               <Typography variant='h5' color={commomStyles.grey} mr='6px'>Think</Typography>
               <Typography color={commomStyles.secondaryMain} mr='6px'>.</Typography>
               <Typography variant='h5' color={commomStyles.grey} mr='6px'>Act</Typography>
               <Typography color={commomStyles.secondaryMain} mr='6px'>.</Typography>
               <Typography variant='h5' color={commomStyles.secondaryMain} mr='6px'>Grow</Typography>
             </Box>

            </Box>
             
           </Box>

           {/* <Typography>Pause</Typography><Typography>Think</Typography><Typography>Act</Typography><Typography>Grow</Typography> */}
         </div>
       </Box>): (<Box>
         <div style={styles.mainDiv}>
           <Paper elevation={0} style={styles.paperContainer}>
             <Box>
               <img
                 src={BACILogo}
                 alt="Logo"
                 style={styles.logoImage} />
             </Box>
             <Box style={styles.slogan}>
               <span style={styles.sloganText}>Pause</span>
               <span style={styles.fullPoint}>.</span>
               <span style={styles.sloganText}>Think</span>
               <span style={styles.fullPoint}>.</span>
               <span style={styles.sloganText}>Act</span>
               <span style={styles.fullPoint}>.</span>
               <span style={styles.sloganTextGrow}>Grow</span>
             </Box>

           </Paper>

           {/* <Typography>Pause</Typography><Typography>Think</Typography><Typography>Act</Typography><Typography>Grow</Typography> */}
         </div>
       </Box>) }
     </>
     </>
        
   );
}