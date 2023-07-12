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
import { Box, Grid, useMediaQuery } from '@mui/material';
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
import LeftBar from './components/Elements/leftBar/LeftBar';
import ActionDashboard from './components/Elements/actionDashboard/ActionDashboard';
import FacilitatorDashboard from './components/Elements/facilitatorDashboard/facilitatorDashboard';

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
  const isXsUp = useMediaQuery('(max-width:768px)');

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
                      <Box display="flex" height="calc(var(--app-height))">
                        {!isXsUp && <LeftBar />}
                        <Box display="flex" width="calc(100% - 72px)">
                          <Routes>
                            <Route path="/facilitator/">
                              <Route
                                path="dashboard"
                                element={<FacilitatorDashboard />}
                              />
                              <Route
                                path="actions"
                                element={<ActionDashboard />}
                              />
                              <Route path="analytics/">
                                <Route
                                  path=""
                                  element={<AnalyticsMainContainer />}
                                />

                                <Route
                                  path="teamLevelActionsCount"
                                  element={<TeamLevelActionsCountChart />}
                                />

                                <Route
                                  path="enterpriseLevelActionsCount"
                                  element={
                                    <EnterpriseLevelActionsCountChart
                                      dashboard={false}
                                      team={'0'}
                                    />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelParticipantsCount"
                                  element={
                                    <AverageParticipantChart
                                      dashboard={false}
                                      team={'0'}
                                    />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelRetrosCount"
                                  element={
                                    <AverageRetroChart
                                      dashboard={false}
                                      team={'0'}
                                    />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelSentimentsSummary"
                                  element={
                                    <EnterpriseLevelSentimentsSummaryChart
                                      dashboard={false}
                                      team={'0'}
                                    />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelSentimentsThemes"
                                  element={
                                    <EnterpriseLevelSentimentsThemeChart
                                      dashboard={false}
                                      team={'0'}
                                    />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelSentimentsMoods"
                                  element={
                                    <EnterpriseLevelSentimentsMoodsChart
                                      dashboard={false}
                                      team={'0'}
                                    />
                                  }
                                />
                              </Route>
                            </Route>
                            <Route
                              path="/"
                              element={
                                <LandingPage isDemo={true}></LandingPage>
                              }
                            />
                            <Route
                              path="/join/:id"
                              element={<JoinRetro></JoinRetro>}
                            />
                            <Route
                              path="/create"
                              element={<CreateRetroMain></CreateRetroMain>}
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
                              <Route
                                path=":id/feedback"
                                element={<Feedback />}
                              />
                              <Route
                                path=":id/startRetro"
                                element={<StartRetro></StartRetro>}
                              />
                            </Route>
                            <Route path="/analytics/">
                              <Route
                                path=""
                                element={<AnalyticsMainContainer />}
                              />
                              <Route
                                path="teamLevelActionsCount"
                                element={<TeamLevelActionsCountChart />}
                              />
                              <Route
                                path="enterpriseLevelActionsCount"
                                element={
                                  <EnterpriseLevelActionsCountChart
                                    dashboard={false}
                                    team={'0'}
                                  />
                                }
                              />
                              <Route
                                path="enterpriseLevelParticipantsCount"
                                element={
                                  <AverageParticipantChart
                                    dashboard={false}
                                    team={'0'}
                                  />
                                }
                              />
                              <Route
                                path="enterpriseLevelRetrosCount"
                                element={
                                  <AverageRetroChart
                                    dashboard={false}
                                    team={'0'}
                                  />
                                }
                              />
                              <Route
                                path="enterpriseLevelSentimentsSummary"
                                element={
                                  <EnterpriseLevelSentimentsSummaryChart
                                    dashboard={false}
                                    team={'0'}
                                  />
                                }
                              />
                              <Route
                                path="enterpriseLevelSentimentsThemes"
                                element={
                                  <EnterpriseLevelSentimentsThemeChart
                                    dashboard={false}
                                    team={'0'}
                                  />
                                }
                              />
                              <Route
                                path="enterpriseLevelSentimentsMoods"
                                element={
                                  <EnterpriseLevelSentimentsMoodsChart
                                    dashboard={false}
                                    team={'0'}
                                  />
                                }
                              />
                            </Route>
                            <Route
                              path="/report/:id"
                              element={<SummaryReportMain />}
                            />
                            <Route
                              path="enterpriseLevelActionsCount"
                              element={<DummyChart />}
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
                        </Box>
                      </Box>
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
