import React, { ComponentProps, Dispatch } from 'react';
import { LastRetroName } from '../types';

export enum ActionType {
  SET_LAST_RETRO_NAME = 'setLastRetroName',
}

export class ReducerPayload {
  lastRetroName?: string;
  loadingFlag?: boolean;
}

type ContextType = [
  LastRetroName,
  Dispatch<{ type: ActionType; payload?: ReducerPayload }>
];

const LastNameContext = React.createContext<ContextType>([
  new LastRetroName(),
  {} as Dispatch<{ type: ActionType; payload?: ReducerPayload }>,
]);

function saveState(state: LastRetroName) {
  sessionStorage.setItem('LastNameContext', JSON.stringify(state));
  return state;
}

function initialLastRetroNameState(): LastRetroName {
  return new LastRetroName();
}

function loadState() {
  const savedContext = sessionStorage.getItem('LastNameContext');
  var parsingSavedContext = savedContext
    ? JSON.parse(savedContext)
    : initialLastRetroNameState();
  parsingSavedContext.loadingFlag = false;
  return parsingSavedContext;
}

function LastRetroNameProvider(props: ComponentProps<any>) { 
  function LastRetroNameReducer(
    state: LastRetroName,
    action: { type: ActionType; payload?: ReducerPayload }
  ): LastRetroName {
    switch (action.type) {
      case ActionType.SET_LAST_RETRO_NAME:
        return saveState({
          ...state,
          lastRetroName: action.payload?.lastRetroName,
        });
    }
  }

  const [state, dispatch] = React.useReducer(LastRetroNameReducer, loadState());

  return (
    <LastNameContext.Provider value={[state, dispatch]}>
      {props.children}
    </LastNameContext.Provider>
  );
}

export { LastRetroNameProvider, LastNameContext };
