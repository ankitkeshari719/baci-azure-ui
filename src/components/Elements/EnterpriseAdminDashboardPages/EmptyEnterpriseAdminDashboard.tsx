import { Paper, Box, ThemeProvider, Button, createTheme } from '@mui/material';

import {
  H1RegularTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from './../../../style.module.scss';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import { useNavigate } from 'react-router-dom';

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

export default function EmptyEnterpriseAdminDashboard() {
  const navigate = useNavigate();

  // Function to navigate on create new retro page
  function CreateNewRetro() {
    navigate('/create/');
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
          display="flex"
          flexDirection="row"
          width="100%"
          justifyContent="space-between"
          height="40px"
          alignItems="center"
        >
          {/* Enterprise Dashboard label */}
          <Box component="span">
            <H1RegularTypography label="Dashboard" />
          </Box>
          {/* JOIN SESSION And NEW SESSION Button */}
          <Box component="span">
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: '10px' }}
              >
                JOIN SESSION
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ marginLeft: '20px', borderRadius: '10px' }}
              >
                <span style={{ color: 'white' }}>NEW SESSION</span>
              </Button>
            </ThemeProvider>
          </Box>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <img src="/svgs/emptySessions.svg" width={300} height={350} />
          <H2SemiBoldTypography
            label="Lets get started!"
            style={{ color: '#2C69A1' }}
          />
          <ContainedButtonWithIcon
            id={'create_new__retro_button_desktop'}
            label={'New Session'}
            size={'medium'}
            iconPath="/svgs/plusSmall.svg"
            style={{ width: '260px', marginTop: '40px', textAlign: 'center' }}
            onClick={() => CreateNewRetro()}
          />
        </Box>
      </Paper>
    </>
  );
}
