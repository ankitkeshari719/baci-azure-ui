import * as React from 'react';
import { getAllTeams } from '../../../helpers/msal/services';
import EmptyEnterpriseDashboard from './EmptyEnterpriseDashboard';
import EnterpriseDashboard from './EnterpriseDashboard';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import { UserContext } from '../../../contexts/UserContext';

export const EnterpriseMainContainer = () => {
  const [sessions, setSessions] = React.useState<any>([]);
  const [facilitator, setFacilitator] = React.useState<any>(1);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [gUser] = React.useContext(UserContext);

  React.useEffect(() => {
    localStorage.setItem(
      'uuid',
      gUser?.azureUser ? gUser?.azureUser.emailId : ''
    );
    dispatch({
      type: ActionType.SET_USER,
      payload: {
        user: {
          id:
            gUser.azureUser?.emailId != undefined
              ? gUser.azureUser?.emailId
              : '',
          name:
            gUser.azureUser?.emailId != undefined
              ? gUser.azureUser?.firstName + ' ' + gUser.azureUser?.lastName
              : '',
          avatar:
            gUser.azureUser?.emailId != undefined
              ? gUser.azureUser?.selectedAvatar
              : '',
          userType: 1,
        },
      },
    });
  },[]);

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
        <EmptyEnterpriseDashboard />
      ) : (
        <EnterpriseDashboard />
      )}
    </>
  );
};
