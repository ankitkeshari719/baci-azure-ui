import React, { ComponentProps, Dispatch } from 'react';
import {
  AzureUser,
  GlobalUser,

} from '../helpers/types';

export enum UserActionType{
    SET_JIRA_CODE = 'setJiraCode',
    CHART_START_DATE = 'chartStartDate',
    CHART_END_DATE = 'chartEndDate',
    SET_AZURE_USER = 'setAzureUser',
    SET_TEAM_ID="setTeamId",
    SET_USER_LIST_BY_ENT="setUserListByEnt"
}


export class ReducerPayload {
    jiraCode?: string;
    startDate?: string;
    endDate?: string;
    azureUser?: AzureUser;
    teamId?:string;
    users?:any[];
  }

  type ContextType = [
    GlobalUser,
    Dispatch<{ type: UserActionType; payload?: ReducerPayload }>
  ];

  const UserContext = React.createContext<ContextType>([
    new GlobalUser(),
    {} as Dispatch<{ type: UserActionType; payload?: ReducerPayload }>,
  ]);

  function saveUserState(state: GlobalUser) {
    sessionStorage.setItem('UserContext', JSON.stringify(state));
    return state;
  }

  function loadState() {
    const savedContext = sessionStorage.getItem('UserContext');
    var parsingSavedContext = savedContext
      ? JSON.parse(savedContext)
      : intialUserState();
    parsingSavedContext.loadingFlag = false;
  
    return parsingSavedContext;
  }
  function intialUserState(): GlobalUser {
    return new GlobalUser();
  }

  function UserProvider(props: ComponentProps<any>) {
    function UserReducer(
      state: GlobalUser,
      action: { type: UserActionType; payload?: ReducerPayload }
    ): GlobalUser {
      let noMatch = false;
      switch (action.type) {

        case UserActionType.SET_JIRA_CODE:
            return saveUserState({
              ...state,
              jiraCode: action.payload?.jiraCode,
            });
          case UserActionType.CHART_START_DATE:
            return saveUserState({
              ...state,
              chartStartDate: action.payload?.startDate,
            });
    
            case UserActionType.SET_AZURE_USER:
              return saveUserState({...state,
                azureUser: action.payload?.azureUser})
          case UserActionType.CHART_END_DATE:
            return saveUserState({
              ...state,
              chartEndDate: action.payload?.endDate,
            });
            case UserActionType.SET_USER_LIST_BY_ENT:
              return saveUserState({
                ...state,
                users:action.payload?.users
              })
            case UserActionType.SET_TEAM_ID:
              return saveUserState({
                ...state,teamId:action.payload?.teamId 
              })
          default:
            noMatch = true;
            break;
        }
        if (!noMatch) {
          return saveUserState({
            ...state
          });
        } else {
          return saveUserState({ ...state });
        }
    }
    const [state, dispatch] = React.useReducer(UserReducer, loadState());

    return (
        <UserContext.Provider value={[state, dispatch]}>
          {props.children}
        </UserContext.Provider>
      );
    }
    
    export { UserProvider, UserContext };