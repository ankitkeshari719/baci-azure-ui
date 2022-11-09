import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';


export const useAzureAuth = () => {
    const [global, dispatch] = React.useContext(GlobalContext);

    

    const azureToUser = (): User => {
        return {
            id: uuidv4(),     
            name: '',
            avatar:''
        };
    }

    React.useEffect(() => {
        console.log("in Azure Auth",global.user)
            if (!global.user.id) {
                dispatch({
                    type: ActionType.SET_USER,
                    payload: { user: azureToUser() }
                });
            } 
    }, []);

};