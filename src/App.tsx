import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Board from './screens/Board';
import { BoardProvider } from './contexts/BoardContext';
import Box from '@mui/material/Box';
import { ConfirmProvider } from './contexts/ConfirmContext';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from './contexts/ErrorBoundary';
import { ErrorProvider } from './contexts/ErrorContext';
import Feedback from './screens/Feedback';
import { GlobalProvider } from './contexts/GlobalContext';
import { Offboarding } from './screens/Offboarding';
import { LandingPage } from './screens/LandingPage';
import { Onboarding } from './screens/Onboarding';
import { CreateNewRetro } from './screens/CreateRetroPage';
import PulseCheck from './screens/PulseCheck';
import ReportScreen from './screens/ReportScreen';
import { SnackMessage } from './elements/SnackMessage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import './index.scss'
//import { useFirebase } from './firebase';
//import { useAuth } from './firebase/auth';
import { useAzureAuth } from './msal/azureauth';
import { MsalProvider, useMsal,AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { EventType, InteractionType, IPublicClientApplication } from "@azure/msal-browser";
import { loginRequest, b2cPolicies } from "./authConfig";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Link as RouterLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { SocketProvider } from "./contexts/SocketProvider";

type AppProps = {
  instance: IPublicClientApplication
};

function MainContent() {
  const { instance } = useMsal();
  return (
    <Box sx={{ display: 'flex', minHeight: '100%', maxHeight: '100%' }}>
      <CssBaseline />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box
          component="main"
          sx={{ display: 'flex', flex: 1, py: 0, px: 0, bgcolor: '#eaeff1' }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}


export default function App({ instance } :AppProps) {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <SocketProvider>
        <GlobalProvider>
          <BrowserRouter>
            <BoardProvider>
              <ConfirmProvider>
                <ThemeProvider theme={theme}>
                <MsalProvider instance={instance}>
                  <Routes>
                    <Route path="/" element={<LandingPage></LandingPage>} />
                    <Route path="/createretro" element={<CreateNewRetro></CreateNewRetro>} />
                    <Route path="/join/:id" element={<Onboarding></Onboarding>} />
                    <Route
                      path="/offboarding"
                      element={<Offboarding></Offboarding>}
                    />
                    <Route path="/board" element={<MainContent />}>
                      <Route path=":id/pulsecheck" element={<PulseCheck />} />
                      <Route path=":id/feedback" element={<Feedback />} />
                      <Route path=":id" element={<Board />} />
                    </Route>
                    <Route path="/report/:id" element={<ReportScreen />} />
                  </Routes>
                  </MsalProvider>
                  <SnackMessage />
                </ThemeProvider>
              </ConfirmProvider>
            </BoardProvider>
          </BrowserRouter>
        </GlobalProvider>
        </SocketProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
}
