import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { SnackMessage } from './components/Elements/SnackMessage';
import { ThemeProvider } from '@mui/material/styles';
import theme from './helpers/theme/theme';
import { MsalProvider, useMsal } from '@azure/msal-react';
import { IPublicClientApplication } from '@azure/msal-browser';

import { BoardProvider } from './contexts/BoardContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { ErrorBoundary } from './contexts/ErrorBoundary';
import { ErrorProvider } from './contexts/ErrorContext';
import { GlobalProvider } from './contexts/GlobalContext';
import { SocketProvider } from './contexts/SocketProvider';

import { Offboarding } from './screens/Others/Offboarding';
import { RetroDetails } from './screens/Board/RetroDetails';
import { ParticipantWaitingPage } from './screens/Board/ParticipantWaitingPage';
import { CreateRetroMain } from './screens/CreateRetro/CreateRetroMain';
import { StartRetro } from './screens/Home/StartRetro';
import { Grid } from '@mui/material';
import { PageNotFound } from './screens/Others/PageNotFound';
import Feedback from './screens/Others/Feedback';
import Board from './screens/Board/Board';
import PulseCheckMain from './screens/PulseChecks/PulseCheckMain';
import SummaryReportMain from './screens/SummaryReports/SummaryReportMain';
import { LandingPage } from './screens/Home/LandingPage';
import { JoinRetro } from './screens/Home/JoinRetro';
import { RetroIsFinished } from './screens/Others/RetroIsFinished';
import { JiraCallback } from './screens/Others/JiraCallback';
import AnalyticsMainContainer from './screens/Analytics/AnalyticsMainContainer';
import AverageParticipantChart from './screens/Analytics/AverageParticipantChart';
import AverageRetroChart from './screens/Analytics/AverageRetroChart';
import EnterpriseLevelSentimentsMoodsChart from './screens/Analytics/EnterpriseLevelSentimentsMoodsChart';
import EnterpriseLevelSentimentsSummaryChart from './screens/Analytics/EnterpriseLevelSentimentsSummaryChart';
import EnterpriseLevelSentimentsThemeChart from './screens/Analytics/EnterpriseLevelSentimentsThemeChart';
import TeamLevelActionsCountChart from './screens/Analytics/TeamLevelActionsCountChart';
import EnterpriseLevelActionsCountChart from './screens/Analytics/EnterpriseLevelActionsCountChart';
import DummyChart from './screens/Analytics/DummyChart';

type AppProps = {
  instance: IPublicClientApplication;
};

function MainContent() {
  const { instance } = useMsal();
  return (
    <Grid container spacing={0}>
      <Outlet />
    </Grid>
  );
}

export default function App({ instance }: AppProps) {
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
                        <Route
                          path="/create"
                          element={<CreateRetroMain></CreateRetroMain>}
                        />
                        <Route
                          path="/join/:id"
                          element={<JoinRetro></JoinRetro>}
                        />
                        <Route
                          path="/retrodetails"
                          element={<RetroDetails></RetroDetails>}
                        />
                        <Route
                          path="/offboarding"
                          element={<Offboarding></Offboarding>}
                        />
                        <Route path="/board" element={<MainContent />}>
                          <Route
                            path=":id/waiting"
                            element={
                              <ParticipantWaitingPage></ParticipantWaitingPage>
                            }
                          />
                          <Route
                            path=":id/pulsecheck"
                            element={<PulseCheckMain />}
                          />
                          <Route path=":id" element={<Board />} />
                          <Route path=":id/feedback" element={<Feedback />} />
                          <Route
                            path=":id/startRetro"
                            element={<StartRetro></StartRetro>}
                          />
                        </Route>
                        <Route path="/analytics/">
                          <Route path="" element={<AnalyticsMainContainer />} />
                          <Route
                            path="teamLevelActionsCount"
                            element={<TeamLevelActionsCountChart />}
                          />
                          <Route
                            path="enterpriseLevelActionsCount"
                            element={<EnterpriseLevelActionsCountChart />}
                          />
                          <Route
                            path="enterpriseLevelParticipantsCount"
                            element={<AverageParticipantChart />}
                          />
                          <Route
                            path="enterpriseLevelRetrosCount"
                            element={<AverageRetroChart />}
                          />
                          <Route
                            path="enterpriseLevelSentimentsSummary"
                            element={<EnterpriseLevelSentimentsSummaryChart />}
                          />
                          <Route
                            path="enterpriseLevelSentimentsThemes"
                            element={<EnterpriseLevelSentimentsThemeChart />}
                          />
                          <Route
                            path="enterpriseLevelSentimentsMoods"
                            element={<EnterpriseLevelSentimentsMoodsChart />}
                          />
                        </Route>
                        <Route
                          path="/report/:id"
                          element={<SummaryReportMain />}
                        />
                        <Route
                          path="/retroisfinished"
                          element={<RetroIsFinished></RetroIsFinished>}
                        />
                        <Route
                          path="/jiraCallback/"
                          element={<JiraCallback />}
                        />
                        <Route
                          path="*"
                          element={<PageNotFound></PageNotFound>}
                        />
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
