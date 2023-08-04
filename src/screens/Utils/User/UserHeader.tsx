import * as React from 'react';
import { Box, Typography } from '@mui/material';
import './../../../global.scss';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { H2RegularTypography } from '../../../components/CustomizedTypography';
import { ContainedButton } from '../../../components';
export function UserHeader() {
  const { instance, inProgress } = useMsal();
  const { accounts } = useMsal();
  console.log(accounts);
  const name = accounts[0]?.name;

  const handleLogoutRedirect = () => {
    instance.logoutRedirect();
  };

  return (
    <>
      <AuthenticatedTemplate>
        <Box sx={{ width: '100%' }}>
          <H2RegularTypography
            label={'Hello, ' + name}
            style={{
              color: '#2C69A1',
            }}
          />
          <ContainedButton
            id={'signin_button_desktop'}
            name={'Sign Out'}
            onClick={() => handleLogoutRedirect()}
            style={{
              marginTop: '42px',
              textDecorationLine: 'underline',
            }}
            size={'medium'}
          />
        </Box>
      </AuthenticatedTemplate>
    </>
  );
}
