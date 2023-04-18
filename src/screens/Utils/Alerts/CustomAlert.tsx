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

  dayjs.extend(customParseFormat);
  dayjs.extend(tz);
  dayjs.extend(utc);
  dayjs.extend(advanced);

  const timeZoneDiff = dayjs(deploymentDate).format('Z');
  const checkSymbol = timeZoneDiff.substring(0, 1);
  const checkDigit = timeZoneDiff.substring(1, 3);

  let date;
  if (checkSymbol === '+') {
    date = dayjs(deploymentDate)
      .subtract(+checkDigit, 'hours')
      .tz('Australia/Queensland')
      .format('Do MMMM YYYY [at] hh:mm A Z');
  } else if (checkSymbol === '-') {
    date = dayjs(deploymentDate)
      .add(+checkDigit, 'hours')
      .tz('Australia/Queensland')
      .format('Do MMMM YYYY [at] hh:mm A Z');
  }

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
          Please Note: BACI will be temporarily unavailable (Australian Eastern
          Standard Time) on&nbsp;
        </Typography>
        <Typography className="noteText" component="span">
          {date}
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
          Please Note: BACI will be temporarily unavailable (Australian Eastern
          Standard Time) on&nbsp;
        </Typography>
        <Typography className="noteText" component="span">
          {date}
        </Typography>
      </Box>
    </Alert>
  );
}
