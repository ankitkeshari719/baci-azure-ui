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
import LeftBar from './components/Elements/leftBar/LeftBar';

import { ActionsMainContainer } from './components/Elements/actionDashboard/ActionsMainContainer';
import { SessionsMainContainer } from './components/Elements/SessionDashboard/SessionsMainContainer';
import { TeamsMainContainer } from './components/Elements/TeamsDashboard/TeamsMainContainer';
import PageNotFound from './screens/Others/PageNotFound';
import TemplatesListContainer from './components/Elements/TemplatesDashboard/TemplatesListContainer';
import TemplatesLearnMore from './components/Elements/TemplatesDashboard/TemplatesLearnMore';
import PulseCheckListContainer from './components/Elements/PulsecheckDashboard/PulseCheckListContainer';
import PulseCheckLearnMore from './components/Elements/PulsecheckDashboard/PulseCheckLearnMore';
import Settings from './components/Elements/BottomBarPages/Settings';
import Help from './components/Elements/BottomBarPages/Help';
import Notifications from './components/Elements/BottomBarPages/Notifications';
import Profile from './components/Elements/BottomBarPages/Profile';
import { EnterpriseMainContainer } from './components/Elements/enterpriseDashboard/EnterpriseMainContainer';
import { FacilitatorMainContainer } from './components/Elements/facilitatorDashboard/FacilitatorMainContainer';
import PrivacyPolicy from './screens/Home/PrivacyPolicy';
import TermsAndConditions from './screens/Home/TermsAndConditions';
import AverageParticipantChartLearnMore from './screens/Analytics/LearnMore/AverageParticipantChartLearnMore';
import AverageRetroChartLearnMore from './screens/Analytics/LearnMore/AverageRetroChartLearnMore';
import EnterpriseLevelActionsCountChartLearnMore from './screens/Analytics/LearnMore/EnterpriseLevelActionsCountChartLearnMore';
import EnterpriseLevelSentimentsMoodsChartLearnMore from './screens/Analytics/LearnMore/EnterpriseLevelSentimentsMoodsChartLearnMore';
import EnterpriseLevelSentimentsSummaryChartLearnMore from './screens/Analytics/LearnMore/EnterpriseLevelSentimentsSummaryChartLearnMore';
import EnterpriseLevelSentimentsThemeChartLearnMore from './screens/Analytics/LearnMore/EnterpriseLevelSentimentsThemeChartLearnMore';
import TeamLevelActionsCountChartLearnMore from './screens/Analytics/LearnMore/TeamLevelActionsCountChartLearnMore';
import { JoinRetroEnterprise } from './components/Elements/enterpriseDashboard/JoinRetroEnterprise';
import EnterpriseRegistration from './components/Elements/enterpriseDashboard/EnterpriseRegistration';
import { JoinRetroFacilitator } from './components/Elements/facilitatorDashboard/JoinRetroFacilitator';
import CreateTeam from './components/Elements/TeamsDashboard/CreateTeam';
import ManageUsers from './components/Elements/ManageUsers/ManageUsers';

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
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

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
                        {!isXsUp && tempLocalUserData != null && <LeftBar />}
                        <Box display="flex" width="calc(100% - 72px)">
                          <Routes>
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
                              path="/termAndCondition"
                              element={
                                <TermsAndConditions></TermsAndConditions>
                              }
                            />
                            <Route
                              path="/privatePolicy"
                              element={<PrivacyPolicy></PrivacyPolicy>}
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
                            {/* Facilitator Routes */}
                            <Route path="/facilitator/">
                              <Route
                                path=""
                                element={<FacilitatorMainContainer />}
                              />
                              <Route
                                path="joinRetro"
                                element={<JoinRetroFacilitator />}
                              />
                              <Route
                                path="createRetro"
                                element={<CreateRetroMain />}
                              />
                              <Route
                                path="termAndCondition"
                                element={
                                  <TermsAndConditions></TermsAndConditions>
                                }
                              />
                              <Route
                                path="privatePolicy"
                                element={<PrivacyPolicy></PrivacyPolicy>}
                              />
                              <Route
                                path="dashboard"
                                element={<FacilitatorMainContainer />}
                              />
                              <Route
                                path="actions"
                                element={<ActionsMainContainer />}
                              />
                              <Route
                                path="sessions"
                                element={<SessionsMainContainer />}
                              />
                              <Route path="templates/">
                                <Route path="retroListTemplate/">
                                  <Route
                                    path=""
                                    element={<TemplatesListContainer />}
                                  />
                                  <Route
                                    path="RetroTemplateDetails"
                                    element={<TemplatesLearnMore />}
                                  />
                                </Route>
                                <Route path="pulseCheckListTemplate">
                                  <Route
                                    path=""
                                    element={<PulseCheckListContainer />}
                                  />
                                  <Route
                                    path="pulseCheckTemplateDetails"
                                    element={<PulseCheckLearnMore />}
                                  />
                                </Route>
                              </Route>
                              <Route path="teams/">
                                <Route
                                  path=""
                                  element={<TeamsMainContainer />}
                                />
                                <Route path="allTeams">
                                  <Route
                                    path=""
                                    element={<TeamsMainContainer />}
                                  />
                                </Route>
                                <Route path="manageUsers">
                                  <Route path="" element={<ManageUsers />} />
                                </Route>
                                <Route path="enterpriseRegistration">
                                  <Route
                                    path=""
                                    element={<EnterpriseRegistration />}
                                  />
                                </Route>
                                <Route path="create">
                                  <Route path="" element={<CreateTeam />} />
                                </Route>
                              </Route>
                              <Route path="settings" element={<Settings />} />
                              <Route path="help" element={<Help />} />
                              <Route
                                path="notifications"
                                element={<Notifications />}
                              />
                              <Route path="profile" element={<Profile />} />
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
                                <Route
                                  path="teamLevelActionsCountLearnMore"
                                  element={
                                    <TeamLevelActionsCountChartLearnMore />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelActionsCountLearnMore"
                                  element={
                                    <EnterpriseLevelActionsCountChartLearnMore />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelParticipantsCountLearnMore"
                                  element={<AverageParticipantChartLearnMore />}
                                />
                                <Route
                                  path="enterpriseLevelRetrosCountLearnMore"
                                  element={<AverageRetroChartLearnMore />}
                                />
                                <Route
                                  path="enterpriseLevelSentimentsSummaryLearnMore"
                                  element={
                                    <EnterpriseLevelSentimentsSummaryChartLearnMore />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelSentimentsThemesLearnMore"
                                  element={
                                    <EnterpriseLevelSentimentsThemeChartLearnMore />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelSentimentsMoodsLearnMore"
                                  element={
                                    <EnterpriseLevelSentimentsMoodsChartLearnMore />
                                  }
                                />
                              </Route>
                              <Route
                                path="*"
                                element={<PageNotFound></PageNotFound>}
                              />
                            </Route>
                            {/* Enterprise Routes */}
                            <Route path="/enterprise/">
                              <Route
                                path=""
                                element={<EnterpriseMainContainer />}
                              />
                              <Route
                                path="joinRetro"
                                element={<JoinRetroEnterprise />}
                              />
                              <Route
                                path="createRetro"
                                element={<CreateRetroMain></CreateRetroMain>}
                              />
                              <Route
                                path="termAndCondition"
                                element={
                                  <TermsAndConditions></TermsAndConditions>
                                }
                              />
                              <Route
                                path="privatePolicy"
                                element={<PrivacyPolicy></PrivacyPolicy>}
                              />
                              <Route
                                path="dashboard"
                                element={<EnterpriseMainContainer />}
                              />
                              <Route
                                path="enterpriseRegistration"
                                element={<EnterpriseRegistration />}
                              />
                              <Route
                                path="actions"
                                element={<ActionsMainContainer />}
                              />
                              <Route
                                path="sessions"
                                element={<SessionsMainContainer />}
                              />
                              <Route path="templates/">
                                <Route path="retroListTemplate">
                                  <Route
                                    path=""
                                    element={<TemplatesListContainer />}
                                  />
                                  <Route
                                    path="RetroTemplateDetails"
                                    element={<TemplatesLearnMore />}
                                  />
                                </Route>
                                <Route path="pulseCheckListTemplate">
                                  <Route
                                    path=""
                                    element={<PulseCheckListContainer />}
                                  />
                                  <Route
                                    path="pulseCheckTemplateDetails"
                                    element={<PulseCheckLearnMore />}
                                  />
                                </Route>
                              </Route>
                              <Route path="teams/">
                                <Route
                                  path=""
                                  element={<TeamsMainContainer />}
                                />
                                <Route path="allTeams">
                                  <Route
                                    path=""
                                    element={<TeamsMainContainer />}
                                  />
                                </Route>
                                <Route path="manageUsers">
                                  <Route path="" element={<ManageUsers />} />
                                </Route>
                                <Route path="enterpriseRegistration">
                                  <Route
                                    path=""
                                    element={<EnterpriseRegistration />}
                                  />
                                </Route>
                                <Route path="createTeam">
                                  <Route path="" element={<CreateTeam />} />
                                </Route>
                              </Route>
                              <Route path="settings" element={<Settings />} />
                              <Route path="help" element={<Help />} />
                              <Route
                                path="notifications"
                                element={<Notifications />}
                              />
                              <Route path="profile" element={<Profile />} />
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
                                <Route
                                  path="teamLevelActionsCountLearnMore"
                                  element={
                                    <TeamLevelActionsCountChartLearnMore />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelActionsCountLearnMore"
                                  element={
                                    <EnterpriseLevelActionsCountChartLearnMore />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelParticipantsCountLearnMore"
                                  element={<AverageParticipantChartLearnMore />}
                                />
                                <Route
                                  path="enterpriseLevelRetrosCountLearnMore"
                                  element={<AverageRetroChartLearnMore />}
                                />
                                <Route
                                  path="enterpriseLevelSentimentsSummaryLearnMore"
                                  element={
                                    <EnterpriseLevelSentimentsSummaryChartLearnMore />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelSentimentsThemesLearnMore"
                                  element={
                                    <EnterpriseLevelSentimentsThemeChartLearnMore />
                                  }
                                />
                                <Route
                                  path="enterpriseLevelSentimentsMoodsLearnMore"
                                  element={
                                    <EnterpriseLevelSentimentsMoodsChartLearnMore />
                                  }
                                />
                              </Route>
                              <Route
                                path="*"
                                element={<PageNotFound></PageNotFound>}
                              />
                            </Route>
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
