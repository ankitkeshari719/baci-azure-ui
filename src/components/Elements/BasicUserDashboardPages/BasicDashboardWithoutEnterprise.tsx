import { Paper, Box, ThemeProvider, Button, createTheme } from '@mui/material';

import {
  BodyRegularTypography,
  H1RegularTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from './../../../style.module.scss';
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

export default function BasicDashboardWithoutEnterprise() {
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
            <H1RegularTypography label="BACI Dashboard" />
          </Box>
          {/* JOIN SESSION And NEW SESSION Button */}
          <Box component="span">
            <ThemeProvider theme={theme}>
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
          <img src="/svgs/Basic_Account_default.svg" width={300} height={350} />
          <H2SemiBoldTypography
            label="Coming Soon!"
            style={{ color: '#2C69A1', marginTop: '24px' }}
          />
          <Box display="flex" flexDirection="row" sx={{ marginTop: '24px' }}>
            <BodyRegularTypography
              label="Feel Free to drop us a mail on "
              style={{ color: '#4E4E4E' }}
            />
            <BodyRegularTypography
              label="&nbsp;help@baciapp.com"
              style={{ color: '#159ADD', cursor: 'pointer' }}
            />
          </Box>
        </Box>
      </Paper>
    </>
  );
}
