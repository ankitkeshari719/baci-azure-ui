import * as React from 'react';
import { Box, Button, ThemeProvider, createTheme, styled } from '@mui/material';
import { Grid } from '@mui/material';
import BACITemplate from '../../assets/img/BACI Template.png';
import UploadImage from '../../assets/img/Upload Image or Photo.png';
import Backdrop from '@mui/material/Backdrop';
import commonStyles from '../../style.module.scss';
import Paper from '@mui/material/Paper';

import { useNavigate } from 'react-router-dom';
import { BASIC, ENTERPRISE } from '../../constants/applicationConst';
import { UserContext } from '../../contexts/UserContext';
const theme = createTheme({
  palette: {
    primary: {
      main: commonStyles.PrimaryMain,
    },
    secondary: {
      // This is green.A700 as hex.
      main: commonStyles.secondaryMain,
    },
  },
});
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function BackdropButtons() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [gUser,userDispatch]= React.useContext(UserContext);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const navigateToJoinSession = () => {
    if (gUser?.azureUser?.roleName === ENTERPRISE)
    navigate(
      'enterprise/sessions/joinRetro/' 
    );
    else if (gUser?.azureUser?.roleName === BASIC){
      navigate(
        'basic/sessions/joinRetro/' 
      );
    }
    navigate('/basic/joinRetro/');
  };

  const navigateToCreateSession = () => {
    if (gUser?.azureUser?.roleName === ENTERPRISE)
    navigate(
      'enterprise/sessions/createRetro/' 
    );
    else if (gUser?.azureUser?.roleName === BASIC){
      navigate(
        'basic/sessions/createRetro/' 
      );
    }
    else
    navigate('/basic/createRetro/');
  };

  const navigateToUploadImage = () => {


    if (gUser?.azureUser?.roleName === ENTERPRISE)
    navigate(
      'enterprise/sessions/createSession/' 
    );
    else if (gUser?.azureUser?.roleName === BASIC){
      navigate(
        'basic/sessions/createSession/' 
      );
    }
    else
    navigate('/basic/createSession/');
  };
    
  


  return (
    <>

    {/* select session flow */}
    <Backdrop
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <Box style={{ width: '1000px' }}>
            <Grid container spacing={2}>
              <Grid
                item
                xs={5}
                onClick={navigateToCreateSession}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: "10px 10px 20px 10px",
                  alignContent: 'center',
                  maxWidth: '450px',
                }}
              >
                <img
                  src={BACITemplate}
                  alt="Logo"
                  className="logo"
                  height="189px"
                  width="400px"
                />
                <p style={{ textAlign: 'center', color: 'black', fontSize: '23px' }}>
                  BACI Template
                </p>
                <p style={{ fontSize: '16px', color: 'gray', margin:"10px" }}>
                 Need to run a collaboration session with BACI? 
                  <br />
                  Start instantly with preset BACI templates.
                </p>
              </Grid>
           
              <Grid
                item
                xs={5}
                onClick={navigateToUploadImage}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  padding: "10px 10px 20px 10px",
                  maxWidth: '450px',
                }}
              >
                <img
                  src={UploadImage}
                  alt="Logo"
                  className="logo"
                  height="189px"
                  width="400px"

                />
                <p
                  onClick={handleClose}
                  style={{ textAlign: 'center', color: 'black',fontSize: '23px' }}
                >
                  Upload Image or Photo
                </p>
                <p style={{ fontSize: '16px', color: 'gray', margin:"10px" }}>
                  Run a collabration session with Post-Its on a wall?
                  <br/>Digitise it here for easy analysis and safe keeping.
                </p>
              </Grid>
            </Grid>
          </Box>
        </Backdrop>
     
    </>
  );
}

export default BackdropButtons;
