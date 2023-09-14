import * as React from 'react';
import { getAllTeams } from '../../../helpers/msal/services';
import EmptyFacilitatorDashboard from './EmptyFacilitatorDashboard';
import FacilitatorDashboard from './facilitatorDashboard';

export const FacilitatorMainContainer = () => {
  const [sessions, setSessions] = React.useState<any>([]);
  const [facilitator, setFacilitator] = React.useState<any>(1);

  // API will hit here to get the Teams list
  React.useEffect(() => {
    callGetAllTeams();
  }, []);

  // Function to get all teams data
  const callGetAllTeams = async () => {
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
      {facilitator === 0 ? (
        <EmptyFacilitatorDashboard />
      ) : (
        <FacilitatorDashboard />
      )}
    </>
  );
};
