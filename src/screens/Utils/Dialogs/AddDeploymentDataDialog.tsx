import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import * as React from 'react';
import '../../../global.scss';
import './styles.scss';

import { Row, Col } from 'react-bootstrap';
import { OutlinedButton, ContainedButton } from '../../../components';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import * as Icons from 'heroicons-react';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      <Row>
        <Col xs="6" className="d-flex justify-content-start align-items-center">
          {children}
        </Col>
        <Col
          xs={{ span: 1, offset: 5 }}
          className="d-flex justify-content-end align-items-center"
        >
          {onClose ? (
            <Icons.X
              size={20}
              style={{
                cursor: 'pointer',
              }}
              onClick={onClose}
            />
          ) : null}
        </Col>
      </Row>
    </DialogTitle>
  );
}

type Props = {
  handleAddDeploymentDataClose: () => void;
  handleAddDeploymentData: (
    deploymentDate: Dayjs | null,
    notificationDate: Dayjs | null
  ) => void;
};

export function AddDeploymentDataDialog({
  handleAddDeploymentDataClose,
  handleAddDeploymentData,
}: Props) {
  const [deploymentDate, setDeploymentDate] = React.useState<Dayjs | null>(
    dayjs()
  );
  const [notificationDate, setNotificationDate] = React.useState<Dayjs | null>(
    dayjs()
  );

  const handleDeploymentDateChange = (newValue: Dayjs | null) => {
    setDeploymentDate(newValue);
  };

  const handleNotificationDateChange = (newValue: Dayjs | null) => {
    setNotificationDate(newValue);
  };

  const saveDeploymentData = () => {
    if (deploymentDate != null && notificationDate != null) {
      handleAddDeploymentData(deploymentDate, notificationDate);
      handleAddDeploymentDataClose();
    }
  };
  return (
    <Box sx={{ minWidth: '450px', maxHeight: '450px', overflowY: 'auto' }}>
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleAddDeploymentDataClose}
      >
        <Typography className="dialogTitle">Deployment Data</Typography>
      </BootstrapDialogTitle>
      <DialogContent
        dividers
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box mt={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Notification Date"
              inputFormat="MM/DD/YYYY"
              value={notificationDate}
              onChange={handleNotificationDateChange}
              renderInput={params => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Box mt={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
              label="Deployment Date"
              inputFormat="MM/DD/YYYY"
              value={deploymentDate}
              onChange={handleDeploymentDateChange}
              renderInput={params => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '40px',
        }}
      >
        <OutlinedButton
          label="Cancel"
          size={'medium'}
          onClick={handleAddDeploymentDataClose}
          style={{
            minWidth: '225px !important',
            height: '44px !important',
            textTransform: 'uppercase !important',
            marginTop: '0px !important',
          }}
        />
        <ContainedButton
          name="Save"
          onClick={saveDeploymentData}
          style={{
            minWidth: '225px !important',
            height: '44px !important',
            textTransform: 'uppercase !important',
            marginLeft: '50px !important',
          }}
          size={'medium'}
        />
      </DialogActions>
    </Box>
  );
}
