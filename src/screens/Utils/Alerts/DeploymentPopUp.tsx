import * as React from 'react';
import { Grid } from '@mui/material';
import './../../../global.scss';
import './styles.scss';
import dayjs, { Dayjs } from 'dayjs';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import { getDeploymentData } from '../../../msal/services';
import { InfoAlert } from './CustomAlert';

export function DeploymentPopUp() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [currentDate, setCurrentDate] = React.useState<Dayjs | null>(dayjs());
  const [notificationDate, setNotificationDate] =
    React.useState<Dayjs | null>();
  const [deploymentDate, setDeploymentDate] = React.useState<Dayjs | null>();
  const [isActive, setIsActive] = React.useState<number>();
  const [isDeployed, setIsDeployed] = React.useState<number>();
  const [isCurrentDateBefore, setIsCurrentDateBefore] =
    React.useState<boolean>();
  const [isCurrentDateAfter, setIsCurrentDateAfter] = React.useState<boolean>();

  const [openAlert, setOpenAlert] = React.useState<boolean>(true);

  React.useEffect(() => {
    const maintenanceScheduled_1 = sessionStorage.getItem(
      'isMaintenanceScheduled'
    );
    const lastRetroName_1 = sessionStorage.getItem('lastRetroName');
    const maintenanceScheduled_2 =
      maintenanceScheduled_1 && JSON.parse(maintenanceScheduled_1);
    const lastRetroName_2 = lastRetroName_1 && JSON.parse(lastRetroName_1);
    if (lastRetroName_2 === undefined || lastRetroName_2 === null) {
      setOpenAlert(true);
      sessionStorage.setItem('isMaintenanceScheduled', JSON.stringify(true));
    } else {
      if (maintenanceScheduled_2) {
        setOpenAlert(true);
      } else {
        setOpenAlert(false);
      }
    }
    handleGetDeploymentData();
  }, []);

  React.useEffect(() => {
    currentDate && setIsCurrentDateBefore(currentDate.isBefore(deploymentDate));
    currentDate && setIsCurrentDateAfter(currentDate.isAfter(notificationDate));
  }, [currentDate, deploymentDate, notificationDate, isActive, isDeployed]);

  // Function to get deployment data
  const handleGetDeploymentData = async () => {
    await getDeploymentData().then(
      res => {
        if (res && res.result && res.result[0]) {
          console.log('res::', res);
          setDeploymentDate(dayjs(res.result[0].deploymentDate));
          setNotificationDate(dayjs(res.result[0].notificationDate));
          setIsActive(res.result[0].isActive);
          setIsDeployed(res.result[0].isDeployed);
        }
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_SNACK_MESSAGE,
          payload: {
            snackMessage: {
              snackMessageType: 'error',
              message: 'Error while getting the deployment data!',
            },
          },
        });
      }
    );
  };

  const handleAlertClose = () => {
    sessionStorage.setItem('isMaintenanceScheduled', JSON.stringify(false));
    sessionStorage.setItem('lastRetroName', JSON.stringify(''));
    setOpenAlert(false);
  };

  return (
    <>
      {openAlert &&
        isActive &&
        !isDeployed &&
        isCurrentDateBefore &&
        isCurrentDateAfter && (
          <Grid item xs={12}>
            <InfoAlert handleAlertClose={handleAlertClose} />
          </Grid>
        )}
    </>
  );
}
