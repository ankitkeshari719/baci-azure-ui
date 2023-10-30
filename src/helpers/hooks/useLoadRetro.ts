import { useNavigate, useParams } from 'react-router-dom';
import { BoardContext } from '../../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import log from 'loglevel';
import React from 'react';
import { FEATURE_FLAGS } from '../../constants';
import { ErrorContext } from '../../contexts/ErrorContext';
import { getRetro } from '../msal/services';
import { useMediaQuery } from '@mui/material';
import theme from '../theme/theme';
import { UserContext } from '../../contexts/UserContext';

export default function useLoadRetro() {
  const { id } = useParams();

  const { error, setError } = React.useContext(ErrorContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [gUser] = React.useContext(UserContext);
  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const {
    state: { retroId, users, ended, loading, retroStarted },
    commitAction,
  } = React.useContext(BoardContext);

  const navigate = useNavigate();

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };

  React.useEffect(() => {
    console.log('waiting', retroId);
    if (!global?.user?.name && id) {
      if (location.pathname.includes('basic')) {
        navigate('/basic/join/' + id);
      } else if (location.pathname.includes('enterprise'))
        navigate('/enterprise/sessions/join/' + id);
      else navigate('/join/' + id);
      return;
    }
    if ((!id || id === '') && global.currentRetro?.id) {
      if (location.pathname.includes('basic')) {
        navigate('/basic/sessions/');
      } else if (location.pathname.includes('enterprise'))
        navigate('/enterprise/sessions/');
      else navigate('/');
      return;
    }
    if ((!id || id === '') && !global.currentRetro?.id) {
      if (location.pathname.includes('basic')) {
        navigate('/basic/sessions/');
      } else if (location.pathname.includes('enterprise'))
        navigate('/enterprise/sessions/');
      else navigate('/');
      return;
    }
    if (id !== retroId) {
      getRetro(id as string)
        .then(retro => {
          if (retro && retro.id) {
            dispatch({
              type: ActionType.SET_CURRENT_RETRO,
              payload: { retro },
            });
          } else {
            if (location.pathname.includes('basic')) {
              navigate('/basic/sessions/');
            } else if (location.pathname.includes('enterprise'))
              navigate('/enterprise/sessions/');
            else navigate('/');
            return;
          }
        })
        .catch(e => {
          log.error(e);
          setError('Error: ' + e.message);
        });
    }
  }, []);

  // On load of new retro
  React.useEffect(() => {
    if (!!retroId) {
      const userJoined = users.find(u => u.userId === global.user.id);
      if (!userJoined) {
        saveAndProcessAction(BoardActionType.JOIN_RETRO, {
          userNickname: global.user.name,
          avatar: global.avatar,
          isMobile: window.innerWidth < 700,
        }).then(() => {
          if (global.currentRetro && retroStarted) {
            if (FEATURE_FLAGS.pulseCheck) {
              // navigate(
              //   `/board/${retroId || global.currentRetro?.id}/pulsecheck`
              // );
              return;
            }
          } else {
            console.log(gUser.azureUser?.emailId, 'email');
            if (
              global.currentRetro?.creatorId !== global.user.id &&
              global.currentRetro?.creatorId !== gUser.azureUser?.emailId
            ) {
              if (location.pathname.includes('basic')) {
                navigate('/basic/sessions' + `/board/${retroId}/waiting`);
              } else if (location.pathname.includes('enterprise'))
                navigate('/enterprise/sessions' + `/board/${retroId}/waiting`);
              else navigate(`/board/${retroId}/waiting`);
            }

            // if (gUser.azureUser?.emailId) {

            //   navigate(`/enterprise/sessions/board/${retroId}/waiting`);
            // } else navigate(`/board/${retroId}/waiting`);
            else {
              if (location.pathname.includes('basic')) {
                navigate('/basic/sessions' + `/board/${retroId}/startRetro`);
              } else if (location.pathname.includes('enterprise'))
                navigate(
                  '/enterprise/sessions' + `/board/${retroId}/startRetro`
                );
              else navigate(`/board/${retroId}/startRetro`);
            }
            return;
          }
        });
        return;
      }
    }
  }, [retroId, loading]);
}
