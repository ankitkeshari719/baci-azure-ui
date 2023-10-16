import { Paper, Box } from '@mui/material';
import * as React from 'react';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import {
  getAllValidNotification,
  updateNotification,
} from '../../../helpers/msal/services';

export default function Notifications() {
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);

  React.useEffect(() => {
    callGetAllValidNotification();
  }, []);

  // Get all notifications
  const callGetAllValidNotification = async () => {
    const requestBody = {
      organisationId: tempLocalUserData && tempLocalUserData.enterpriseId,
      userId: tempLocalUserData && tempLocalUserData.emailId,
    };
    await getAllValidNotification(requestBody).then(
      res => {
        console.log('callGetAllValidNotification response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  // Update Notification
  const callUpdateNotification= async (notificationId: string) => {
    const requestBody = {
      type: 'requestForAdmin',
      organisationId: 'gmail0.987721652970178',
      fromId: 'ankitkeshari718@gmail.com',
      toId: ['ankitkeshari719@gmail.com', 'ujalakashyap05@gmail.com'],
      isRead: false,
    };
    await updateNotification(notificationId, requestBody).then(
      res => {
        console.log('callUpdateUser response', res);
      },
      err => {
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
          label="Coming Soon"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="Coming Soons"
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
        ></Paper>
      </Box>
    </>
  );
}
