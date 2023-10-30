import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import {
  createRetro,
  getRetro,
  addRetroAction,
  getRetroByHumanId,
} from './msal/services';
import { Action, Retro } from './types';

import React from 'react';
import shortid from 'shortid';
import {
  BoardActionType,
  BOARD_STATE_MACHINE_VERSION,
} from './statemachine/BoardStateMachine';
import { pulseCheckInterface } from '../screens/CreateRetro/const';
import { SocketContext } from '../contexts/SocketProvider';
import { useNavigate } from 'react-router-dom';

export const useRetro = () => {
  const [state, dispatch] = React.useContext(GlobalContext);
  const socket = React.useContext(SocketContext);
  const navigate = useNavigate();
  return {
    create: async (
      retro: Partial<Omit<Retro, 'id'>>,
      retroTimeframe: string,
      retroGoal: string
    ): Promise<Retro> => {
      var url = '';
      if (location.pathname.includes('basic')) {
        url = '/basic/sessions';
      } else if (location.pathname.includes('enterprise'))
        url = '/enterprise/sessions';
      else url = '';
      const humanId = (
        '' +
        (Math.random() * 1000000000 + 1000000000)
      ).substring(0, 6);

      const currentRetro = {
        name: 'Retro',
        ...(retro ? retro : {}),
        humanId,
        joinUrl: `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? ':' + window.location.port : ''
        }${url}/join/${humanId}`,
      } as Retro;

      const id = await createRetro(currentRetro, state.user);
      const retrievedRetro = await getRetro(id);

      dispatch({
        type: ActionType.SET_CURRENT_RETRO,
        payload: { retro: retrievedRetro },
      });

      const action: Action = {
        id: shortid.generate(),
        actionName: BoardActionType.UPDATE_RETRO_DETAILS,
        parameters: {
          retroName: retro?.name,
          retroTimeframe,
          retroGoal,
          creatorId: state.currentRetro?.creatorId,
          userId: state.user.id,
        },
        userId: state.user.id,
        timestamp: 0,
        sourceActionId: '',
        sourceActionTimestamp: 0,
        version: BOARD_STATE_MACHINE_VERSION,
      };

      await addRetroAction(id, action);

      return retrievedRetro;
    },

    createTemplate: async (
      retro: Partial<Omit<Retro, 'id'>>,
      retroTimeframe: string,
      retroGoal: string,
      userName: string,
      selectedAvatar: string,
      userType: number,
      selectedPulseCheck: pulseCheckInterface | null,
      selectedTemplate: any,
      selectedTeam?: any,
      selectedFacilitator?: any,
      scheduleRetroType?: any,
      scheduleRetroTime?: any,
      scheduleDescription?: any,
      isLoginUser?: any,
      retroSummary?: any,
      enterpriseId?: any,
      actions?: any
    ): Promise<Retro> => {
      const humanId = (
        '' +
        (Math.random() * 1000000000 + 1000000000)
      ).substring(0, 6);

      var url = '';
      if (location.pathname.includes('basic')) {
        url = '/basic/sessions';
      } else if (location.pathname.includes('enterprise'))
        url = '/enterprise/sessions';
      else url = '';

      const currentRetro = {
        name: 'Retro',
        ...(retro ? retro : {}),humanId,
        joinUrl: `${window.location.protocol}//${window.location.hostname}${
          window.location.port ? ':' + window.location.port : ''}${url}/join/${humanId}`,
        retroGoal: retroGoal,
        retroTimeframe: retroTimeframe,
        selectedTemplate: selectedTemplate,
        selectedPulseCheck: selectedPulseCheck,
        userName: userName,
        selectedAvatar: selectedAvatar,
        userType: userType,
        selectedTeam: selectedTeam,
        selectedFacilitator: selectedFacilitator,
        scheduleRetroType: scheduleRetroType,
        scheduleRetroTime: scheduleRetroTime,
        scheduleDescription: scheduleDescription,
        isLoginUser: isLoginUser,
        retroSummary: retroSummary,
        enterpriseId: enterpriseId,
        action: actions,
      } as Retro;

      const id = await createRetro(currentRetro, state.user);
      const retrievedRetro = await getRetro(id);

      sessionStorage.setItem(
        'lastRetroName',
        JSON.stringify(retrievedRetro.name)
      );
      sessionStorage.setItem(
        'retroNameForPrivacyDialog',
        JSON.stringify(retrievedRetro.name)
      );

      console.log(
        '------------- setting retro details in index -------------',
        retro
      );

      socket.connect().on('connect', () => {
        dispatch({
          type: ActionType.SET_CURRENT_RETRO,
          payload: { retro: retrievedRetro },
        });
      });
      var url = '';
      if (location.pathname.includes('basic')) {
        url = '/basic/sessions';
      } else if (location.pathname.includes('enterprise'))
        url = '/enterprise/sessions';

      else url = '';
      const action: Action = {
        id: shortid.generate(),
        actionName: BoardActionType.UPDATE_RETRO_DETAILS,
        parameters: {
          retroName: retro?.name,
          humanId: humanId,
          joinUrl: `${window.location.protocol}//${window.location.hostname}${
            window.location.port ? ':' + window.location.port : ''
          }${url}/join/${humanId}`,
          retroGoal,
          retroTimeframe,
          pulseCheck: selectedPulseCheck,
          template: selectedTemplate,
          creatorId: state.currentRetro?.creatorId,
          preferredNickname: userName,
          avatar: selectedAvatar,
          userType: userType,
          userId: state.user.id,
          selectedTeam: selectedTeam,
          selectedFacilitator: selectedFacilitator,
          scheduleRetroType: scheduleRetroType,
          scheduleRetroTime: scheduleRetroTime,
          scheduleDescription: scheduleDescription,
          isLoginUser: isLoginUser,
          retroSummary: retroSummary,
          enterpriseId: enterpriseId,
          action: actions,
        },
        userId: state.user.id,
        timestamp: 0,
        sourceActionId: '',
        sourceActionTimestamp: 0,
        version: BOARD_STATE_MACHINE_VERSION,
      };
      await addRetroAction(id, action);
      return retrievedRetro;
    },

    getById: async (id: string): Promise<Retro | undefined> => {
      const retro = await getRetro(id);
      return retro;
    },

    getByHumanId: async (id: string): Promise<Retro | undefined> => {
      const retro = await getRetroByHumanId(id);
      return retro;
    },
  };
};
