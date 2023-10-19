import * as React from 'react';
import TeamsDashboard from './TeamsDashboard';
import TeamsEmptyScreen from './TeamsEmptyScreen';
import { getTeamDataForTable } from '../../../helpers/msal/services';
import { GlobalContext, ActionType } from '../../../contexts/GlobalContext';

export const TeamsMainContainer = () => {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [teams, setTeams] = React.useState<any>([]);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  // API will hit here to get the Teams list
  React.useEffect(() => {
    callGetTeamDataForTable();
  }, []);

  // Function to get all teams data
  const callGetTeamDataForTable = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    const requestBody = {
      userId: tempLocalUserData && tempLocalUserData.emailId,
      roleName: tempLocalUserData && tempLocalUserData.roleName,
      enterpriseId: tempLocalUserData && tempLocalUserData.enterpriseId,
    };

    await getTeamDataForTable(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        setTeams(res);
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        console.log('err', err);
      }
    );
  };

  return <>{teams.length === 0 ? <TeamsEmptyScreen /> : <TeamsDashboard />}</>;
};
