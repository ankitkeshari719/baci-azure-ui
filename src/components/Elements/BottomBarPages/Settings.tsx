import { Paper, Box, Divider, Grid } from '@mui/material';
import * as React from 'react';
import Switch from '@mui/material/Switch';

import {
  BodySemiBoldTypography,
  CaptionRegularTypography,
  H2SemiBoldTypography,
  H4SemiBoldTypography,
  H6SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import { ContainedButtonWithIcon } from '../../CustomizedButton/ContainedButtonWithIcon';
import { connectJira, getUserByEmailId, updateUser } from '../../../helpers/msal/services';
import { GlobalContext, ActionType } from '../../../contexts/GlobalContext';
import { UserActionType, UserContext } from '../../../contexts/UserContext';

export default function Settings() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [gUser, userDispatch] = React.useContext(UserContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  const [isSessionNotificationChecked, setIsSessionNotificationChecked] =
    React.useState(
      tempLocalUserData && tempLocalUserData.isSessionNotificationChecked
    );
  const [isActionNotificationChecked, setIsActionNotificationChecked] =
    React.useState(
      tempLocalUserData && tempLocalUserData.isActionNotificationChecked
    );
  const [isTeamNotificationChecked, setIsTeamNotificationChecked] =
    React.useState(
      tempLocalUserData && tempLocalUserData.isTeamNotificationChecked
    );

  const handleSessionNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsSessionNotificationChecked(event.target.checked);
    callGetUserByEmailId(
      event.target.checked,
      isActionNotificationChecked,
      isTeamNotificationChecked
    );
  };

  const handleActionNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsActionNotificationChecked(event.target.checked);
    callGetUserByEmailId(
      isSessionNotificationChecked,
      event.target.checked,
      isTeamNotificationChecked
    );
  };

  const handleTeamNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsTeamNotificationChecked(event.target.checked);
    callGetUserByEmailId(
      isSessionNotificationChecked,
      isActionNotificationChecked,
      event.target.checked
    );
  };

  const callGetUserByEmailId = async (s: boolean, a: boolean, t: boolean) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    const emailId = tempLocalUserData && tempLocalUserData.emailId;
    await getUserByEmailId(emailId).then(
      res => {
        callUpdateUser(s, a, t, res);
      },
      err => {
        console.log('err', err);
      }
    );
  };
  const connect = async () => {
    await connectJira("" as string).then(
      (res: any) => {
        window.location.href = res.response;
      },
      error => {
        console.log('error', error);
      }
    );
  };

  const callUpdateUser = async (
    s: boolean,
    a: boolean,
    t: boolean,
    userData: any
  ) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });

    const requestBody = {
      ...userData,
      isSessionNotificationChecked: s,
      isActionNotificationChecked: a,
      isTeamNotificationChecked: t,
    };
    const emailId = tempLocalUserData && tempLocalUserData.emailId;
    await updateUser(emailId, requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        localStorage.setItem('userData', JSON.stringify(res));
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        console.log('err', err);
      }
    );
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          background: '#F9FBFC',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <BodySemiBoldTypography
          label="Profile"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="My Setting"
          style={{ color: commonStyles.PrimaryDark }}
        />
        <Paper
          sx={{
            width: '100%',
            background: 'rgb(249 251 252)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            marginTop: '24px',
          }}
        >
          <H4SemiBoldTypography label="Notification" />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              marginTop: '24px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }}
            >
              <H6SemiBoldTypography
                label="New Session Created"
                style={{ marginTop: '24px' }}
              />
              <H6SemiBoldTypography
                label="Actions Assigned"
                style={{ marginTop: '24px' }}
              />
              <H6SemiBoldTypography
                label="Team Added"
                style={{ marginTop: '24px' }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: '160px',
              }}
            >
              <Switch
                checked={isSessionNotificationChecked}
                onChange={handleSessionNotificationChange}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ marginTop: '12px' }}
              />
              <Switch
                checked={isActionNotificationChecked}
                onChange={handleActionNotificationChange}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ marginTop: '12px' }}
              />
              <Switch
                checked={isTeamNotificationChecked}
                onChange={handleTeamNotificationChange}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{ marginTop: '12px' }}
              />
            </Box>
          </Box>
          <Grid item xs={12} sx={{ mt: 6 }}>
            <Divider />
          </Grid>
          <H4SemiBoldTypography
            label="Integrations"
            style={{ marginTop: '24px !important' }}
          />
          <CaptionRegularTypography
            label="Improve productivity by utilising productivty apps"
            style={{ marginTop: '12px !important' }}
          />
          <ContainedButtonWithIcon
            id={'connect_jira_button_desktop'}
            label={gUser.jiraCode==""?'Connect Jira Account':"Disconnect"}
            size={'medium'}
            iconPath="/svgs/jira_icon.svg"
            style={{
              width: '460px',
              marginTop: '40px !important',
              textAlign: 'center',
            }}
            onClick={() => gUser.jiraCode==""? connect():userDispatch({
              type: UserActionType.SET_JIRA_CODE,
              payload: { jiraCode: "" },
            })}
          />
        </Paper>
      </Box>
    </>
  );
}
