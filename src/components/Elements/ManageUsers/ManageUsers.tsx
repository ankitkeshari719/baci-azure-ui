import { Box } from '@mui/material';
import * as React from 'react';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
  H5RegularTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import AllUsers from './AllUsers';
import EnterpriseRequests from './EnterpriseRequests';
import Notifications from '../BottomBarPages/Notifications';

export default function ManageUsers() {
  const [isManageUserPage, setIsManageUserPage] = React.useState(false);

  const handlePageView = (num: any) => {
    if (num == 1) {
      setIsManageUserPage(true);
    } else {
      setIsManageUserPage(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: 'calc(var(--app-height))',
          background: '#F9FBFC',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/*Titles */}
        <BodySemiBoldTypography label="Manage User" />
        <H2SemiBoldTypography
          label="Manage Users"
          style={{
            color: commonStyles.PrimaryDark,
            marginTop: '16px !important',
          }}
        />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            marginTop: '16px !important',
          }}
        >
          {/* Left Side */}
          <Box
            sx={{
              width: '25%',
              display: 'flex',
              flexDirection: 'column',
              marginRight: '10px',
              borderRight: '1px solid #E3E3E3',
            }}
          >
            <H5RegularTypography
              label="Enterprise Dashboard Requests"
              onClick={() => handlePageView(0)}
              style={{
                color: !isManageUserPage ? '#159ADD' : '#676767',
                cursor: 'pointer',
              }}
            />
            <H5RegularTypography
              label="All Users"
              style={{
                marginTop: '24px !important',
                color: isManageUserPage ? '#159ADD' : '#676767',
                cursor: 'pointer',
              }}
              onClick={() => handlePageView(1)}
            />
          </Box>
          {/* Right Side */}
          <Box sx={{ width: '75%' }}>
            {/* Table and Search Box For Manage users*/}
            {isManageUserPage ? <Notifications/>: <EnterpriseRequests />}
          </Box>
        </Box>
      </Box>
    </>
  );
}
