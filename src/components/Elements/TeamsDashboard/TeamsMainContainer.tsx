import * as React from 'react';
import TeamsDashboard from './TeamsDashboard';
import TeamsEmptyScreen from './TeamsEmptyScreen';
import { getAllTeams } from '../../../helpers/msal/services';
import { GlobalContext, ActionType } from '../../../contexts/GlobalContext';

export const TeamsMainContainer = () => {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [teams, setTeams] = React.useState<any>([]);

  // API will hit here to get the Teams list
  React.useEffect(() => {
    callGetAllTeams();
  }, []);

  // Function to get all teams data
  const callGetAllTeams = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    
    await getAllTeams().then(
      res => {
        setTeams(res);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
    );
  };

  return (
    <>
      {teams.length === 0 ? (
        <TeamsEmptyScreen />
      ) : (
        <TeamsDashboard teams={teams} />
      )}
    </>
  );
};
