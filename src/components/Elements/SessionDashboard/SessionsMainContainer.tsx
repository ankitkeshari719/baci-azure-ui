import * as React from 'react';
import SessionEmptyScreen from './SessionEmptyScreen';
import SessionsDashboard from './SessionsDashboard';
import { getAllTeams } from '../../../helpers/msal/services';

export const SessionsMainContainer = () => {
  const [sessions, setSessions] = React.useState<any>([]);

  // API will hit here to get the Sessions list
  React.useEffect(() => {
    callGetAllSessions();
  }, []);

  // Function to get all Sessions data
  const callGetAllSessions = async () => {
    await getAllTeams().then(
      res => {
        setSessions(res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  return (
    <>
      {sessions.length === 0 ? (
        <SessionEmptyScreen />
      ) : (
        <SessionsDashboard  />
      )}
    </>
  );
};
