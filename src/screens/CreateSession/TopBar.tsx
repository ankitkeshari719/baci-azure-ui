import * as React from 'react';
import { AppBar, Box, Toolbar, useMediaQuery } from '@mui/material';
import theme from '../../helpers/theme/theme';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
export function TopBar() {
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  return (
    <AppBar
      position="static"
      className='logoContainer'
    >
      <Toolbar variant="dense" sx={{paddingLeft: '30px !important'}}>
        
      
         <div style={{fontSize:"29px", color:"#2C69A1", lineHeight:"34.8px", paddingTop:"24px"}}>
         <ArrowCircleLeftOutlinedIcon style={{marginRight:"10px", color:"#159ADD"}}/>
          Upload Image or Photo</div>
       
      </Toolbar>
    </AppBar>
  );
}
