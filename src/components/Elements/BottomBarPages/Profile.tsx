import * as React from 'react';
import { Paper, Box } from '@mui/material';
import { OutlinedButton } from '../../../components';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';
import EditProfile from './EditProfile';
import UpdateProfile from './UpdateProfile';

export default function Profile() {
  const [isEditEnable, setIsEditEnable] = React.useState<any>(false);

  const handleEdit = () => {
    setIsEditEnable(!isEditEnable);
  };

  return (
    <>
      <Box
        sx={{
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
          label="My Profile"
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
            marginTop: '24px'
          }}
        >
          {isEditEnable ? (
            <EditProfile handleEdit={handleEdit} />
          ) : (
            <UpdateProfile handleEdit={handleEdit} />
          )}
        </Paper>
      </Box>
    </>
  );
}
