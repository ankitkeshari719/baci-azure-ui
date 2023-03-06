import * as React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Typography } from '@mui/material';
import * as Icons from 'heroicons-react';
import './styles.scss';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const styles = {
  signInMargin: {
    marginTop: '32px',
    height: '44px',
  },
  accessCodeTextField: {
    width: '100%',
    height: '60px',
    maxHeight: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0px',
    borderRadius: '0px',
    boxShadow: 'none',
    background: 'rgba(66, 133, 244, 0.1)',
    paddingLeft: '24px',
    paddingRight: '24px',
    '& .MuiAlert-message': {
      width: '95% !important',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
};

type Props = {
  handleAlertClose: () => void;
};

export function InfoAlert({ handleAlertClose }: Props) {
  return (
    <Alert
      severity="info"
      icon={false}
      sx={{
        ...styles.accessCodeTextField,
      }}
      onClose={handleAlertClose}
    >
      <Icons.InformationCircle
        style={{
          color: '#4285F4',
          width: '32px',
          height: '32px',
          cursor: 'pointer',
        }}
      />
      <Typography component="span" className="scheduledMaintenanceText" ml={2}>
        Scheduled Maintenance !
      </Typography>
      <Typography component="span" className="noteText" ml={2}>
        Please Note: BACI would be temporarily not accessible on 8th March 2023
        at 11:30 pm ACT.
      </Typography>
    </Alert>
  );
}
