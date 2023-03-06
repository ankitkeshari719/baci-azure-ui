import * as React from 'react';
import { Grid } from '@mui/material';
import './../../global.scss';
import './styles.scss';
import dayjs, { Dayjs } from 'dayjs';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { getDeploymentData } from '../../msal/services';
import { InfoAlert } from '../Utils/Alerts/CustomAlert';

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
