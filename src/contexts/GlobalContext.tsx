import React, { ComponentProps, Dispatch } from 'react';
import {
  Global,
  PulseCheckSubmitStatus,
  Retro,
  SnackMessageClass,
  User,
} from '../types';

export enum ActionType {
  SET_CURRENT_RETRO = 'setCurrentRetro',
  CLOSE_CURRENT_RETRO = 'closeCurrentRetro',
  SET_USER = 'setUser',
  SET_PREFERRED_NICKNAME = 'setPreferredNickname',
  SET_SNACK_MESSAGE = 'setSnackMessage',
  SET_RETRO_CREATE = 'setRetroCreate',
  SET_PULSE_CHECK = 'setPulseCheck',
}

export class ReducerPayload {
  retro?: Partial<Retro>;
  user?: User;
  preferredNickname?: string;
  snackMessage?: SnackMessageClass;
  retroCreateState?:boolean;
  pulseCheckState?: PulseCheckSubmitStatus;
}

type ContextType = [
  Global,
  Dispatch<{ type: ActionType; payload?: ReducerPayload }>
];
const GlobalContext = React.createContext<ContextType>([
  new Global(),
  {} as Dispatch<{ type: ActionType; payload?: ReducerPayload }>,
]);

function saveState(state: Global) {
  sessionStorage.setItem('GlobalContext', JSON.stringify(state));
  return state;
}

function loadState() {
  const savedContext = sessionStorage.getItem('GlobalContext');
  return savedContext ? JSON.parse(savedContext) : initialGlobalState();
}

function initialGlobalState(): Global {
  return new Global();
}

function GlobalProvider(props: ComponentProps<any>) {
  function GlobalReducer(
    state: Global,
    action: { type: ActionType; payload?: ReducerPayload }
  ): Global {
    switch (action.type) {
      case ActionType.SET_USER:
        if (action.payload?.user && action.payload?.user.id) {
          return saveState({ ...state, user: action.payload?.user as User });
        }
        break;
      case ActionType.SET_CURRENT_RETRO:
        if (action.payload?.retro && action.payload?.retro.id) {
          return saveState({
            ...state,
            currentRetro: action.payload?.retro as Retro,
          });
        }
        break;
      case ActionType.CLOSE_CURRENT_RETRO:
        if (state.currentRetro) {
          return saveState({ ...state, currentRetro: undefined });
        }
        break;
      case ActionType.SET_PREFERRED_NICKNAME:
        return saveState({
          ...state,
          preferredNickname: action.payload?.preferredNickname,
        });
      case ActionType.SET_SNACK_MESSAGE:
        return saveState({
          ...state,
          snackMessage: action.payload?.snackMessage as SnackMessageClass,
        });
      case ActionType.SET_RETRO_CREATE:
        return saveState({
          ...state,
          retroCreateState: action.payload?.retroCreateState,
        });
        case ActionType.SET_PULSE_CHECK:
          return saveState({
            ...state,
            pulseCheckState: action.payload?.pulseCheckState,
          });
    }
    return saveState({ ...state });
  }

  const [state, dispatch] = React.useReducer(GlobalReducer, loadState());

  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export { GlobalProvider, GlobalContext };
