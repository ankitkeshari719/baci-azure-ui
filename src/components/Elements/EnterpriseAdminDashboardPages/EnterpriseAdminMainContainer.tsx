import * as React from 'react';
import { getAllTeams } from '../../../helpers/msal/services';
import EmptyEnterpriseAdminDashboard from './EmptyEnterpriseAdminDashboard';
import EnterpriseAdminDashboard from './EnterpriseAdminDashboard';

export const EnterpriseAdminMainContainer = () => {
  const [sessions, setSessions] = React.useState<any>([]);
  const [enterprise, setEnterprise] = React.useState<any>(1);

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
      {enterprise === 0 ? (
        <EmptyEnterpriseAdminDashboard />
      ) : (
        <EnterpriseAdminDashboard />
      )}
    </>
  );
};
