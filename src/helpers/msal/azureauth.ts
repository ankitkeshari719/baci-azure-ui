import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
export const azureToUser = (uuid: string): User => {
  return {
    id: uuid,
    name: '',
    avatar: '',
    userType: 0,
   
  };
};
export const useAzureAuth = () => {
  const [global, dispatch] = React.useContext(GlobalContext);



  React.useEffect(() => {
    const uuid = localStorage.getItem('uuid');
    if (uuid != undefined && uuid != null && uuid != '') {
      if (!global.user.id) {
        dispatch({
          type: ActionType.SET_USER,
          payload: { user: azureToUser(uuid) },
        });
      }
    } else {
      const newUuid = uuidv4();
      localStorage.setItem('uuid', newUuid);
      dispatch({
        type: ActionType.SET_USER,
        payload: { user: azureToUser(newUuid) },
      });
    }
  }, []);
};
