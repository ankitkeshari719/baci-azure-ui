import * as React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Box, Typography } from '@mui/material';
import * as Icons from 'heroicons-react';
import './styles.scss';
import dayjs, { Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';
import moment from 'moment-timezone';

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
  maintenanceScheduledPopUP: {
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
  maintenanceScheduledMobileView: {
    width: '100%',
    padding: '0px',
    borderRadius: '0px',
    boxShadow: 'none',
    background: 'rgba(66, 133, 244, 0.1)',
    '& .MuiAlert-message': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '8px',
    },
    '& .MuiAlert-action': {
      display: 'flex',
      justifyContent: 'center',
      margin: '0',
      padding: '0',
    },
  },
};

type Props = {
  handleAlertClose: () => void;
  deploymentDate: Dayjs | null | undefined;
};

export function CustomAlert({ handleAlertClose, deploymentDate }: Props) {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    window.innerWidth < 700
  );

  dayjs.extend(utc);
  dayjs.extend(tz);
  dayjs.extend(customParseFormat);
  dayjs.extend(advanced);

  const timeZone = dayjs.tz.guess();
  dayjs.utc(deploymentDate).tz(timeZone);
  const myTimezoneDay = moment
    .tz(deploymentDate, timeZone)
    .format('D MMMM YYYY');
  const myTimezoneTime = moment
    .tz(deploymentDate, timeZone)
    .format('HH:mm A z');

  const day = dayjs(deploymentDate).format('D MMMM YYYY');
  const time = dayjs(deploymentDate).format('HH:mm A');
  const timezone = dayjs(deploymentDate).format('z');

  return isMobile ? (
    <Alert
      severity="info"
      icon={false}
      sx={{
        ...styles.maintenanceScheduledMobileView,
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
      <Typography className="scheduledMaintenanceText" mt={1}>
        Scheduled Maintenance !
      </Typography>
      <Box
        mt={1}
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography className="noteText" component="span">
          Please Note: BACI will be temporarily unavailable on&nbsp;
        </Typography>
        <Typography className="noteText" component="span">
          {day + ' at ' + time + ' ' + timezone}
        </Typography>
      </Box>
    </Alert>
  ) : (
    <Alert
      severity="info"
      icon={false}
      sx={{
        ...styles.maintenanceScheduledPopUP,
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
      <Box ml={2}>
        <Typography className="noteText" component="span">
          Please Note: BACI will be temporarily unavailable on&nbsp;
        </Typography>
        <Typography className="noteText" component="span">
          {day + ' at ' + time + ' ' + timezone}
        </Typography>
      </Box>
    </Alert>
  );
}
