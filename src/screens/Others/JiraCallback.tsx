import * as React from 'react';
import { Box, Grid, Typography, useMediaQuery, Link } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import animation from '../../assets/img/Retro_Finished_SVG.png';
import './../../global.scss';
import './styles.scss';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { getJiraToken } from '../../helpers/msal/services';
import { UserActionType, UserContext } from '../../contexts/UserContext';

export function JiraCallback() {
  const [searchParams] = useSearchParams();
  const [global, dispatch] = React.useContext(GlobalContext);
  const [gUser,userDispatch]= React.useContext(UserContext);
  let code = '';
  let state = '';
  code = searchParams.get('code') as string;
  state = searchParams.get('state') as string;
  const navigate = useNavigate();

  React.useEffect(() => {
    
    getToken(code);
   
  }, []);

  const getToken = async (code: string) => {
    await getJiraToken(code).then(
      (res: any) => {
        dispatch({
          type: ActionType.SET_JIRA_CODE,
          payload: { jiraCode: res.response },
        });
        userDispatch({
          type: UserActionType.SET_JIRA_CODE,
          payload: { jiraCode: res.response },
        });
        if(gUser.azureUser?.emailId!=undefined&&!!state){
          if(!!state){
            navigate(`/enterprise/settings/` );
          }
          else
          navigate(`/enterprise/sessions/board/` + state);
        }else
        navigate(`/board/` + state);
      },
      error => {
        console.log('error', error);
      }
    );
  };

  return <></>;
}
function async(arg0: string) {
  throw new Error('Function not implemented.');
}
