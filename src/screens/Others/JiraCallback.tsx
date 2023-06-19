import * as React from 'react';
import { Box, Grid, Typography, useMediaQuery, Link } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import animation from '../../assets/img/Retro_Finished_SVG.png';
import './../../global.scss';
import './styles.scss';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { getJiraToken } from '../../helpers/msal/services';

export function JiraCallback() {
  const [searchParams] = useSearchParams();
  const [global, dispatch] = React.useContext(GlobalContext);
  let code = "";
  let state = "";
  code = searchParams.get("code") as string;
  state = searchParams.get("state") as string;
  const navigate = useNavigate();


  React.useEffect(() => {
    const getToken = async (code: string) => {
      await getJiraToken(code).then((res: any) => {
  
        console.log(res.response)
        dispatch({
          type: ActionType.SET_JIRA_CODE,
          payload: { jiraCode: res.response },
        });
        navigate(`/report/`+state);
      }, error => {
        console.log("error", error);
      })

    }
    console.log("Got code from Jira", code);
    getToken(code);
    
  }, []);

  


  return (
    <>
    </>
  );
}
function async(arg0: string) {
  throw new Error('Function not implemented.');
}

