import { Paper, Box } from '@mui/material';

import {
  BodySemiBoldTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';

export default function Notifications() {
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
          label="Notification"
          style={{ marginBottom: '10px' }}
        />
        <H2SemiBoldTypography
          label="Notifications"
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
