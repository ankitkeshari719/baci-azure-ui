import { Paper, Box } from '@mui/material';
import * as React from 'react';
import moment from 'moment';

import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  CaptionRegularTypography,
  H2SemiBoldTypography,
} from '../../CustomizedTypography';
import { ContainedButton } from '../../CustomizedButton/ContainedButton';
import commonStyles from '../../../style.module.scss';
import {
  getAllValidNotification,
  getByNotificationId,
  markAllNotificationById,
  updateNotification,
} from '../../../helpers/msal/services';
import { ActionType, GlobalContext } from '../../../contexts/GlobalContext';
import {
  APPROVED_ENTERPRISE_REQUEST,
  DECLINE_ENTERPRISE_REQUEST,
  REQUEST_FOR_ENTERPRISE,
  ADDED_IN_TEAM,
  ADDED_IN_NEW_SESSION,
  BASIC,
  ENTERPRISE,
  ADDED_IN_NEW_ACTION,
} from '../../../constants/applicationConst';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';

export default function Notifications() {
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  
  const [gUser] = React.useContext(UserContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [allValidNotifications, setAllValidNotifications] = React.useState([]);
  const [allTodayValidNotifications, setAllTodayValidNotifications] =
    React.useState<any>([]);
  const [allPreviousValidNotifications, setAllPreviousValidNotifications] =
    React.useState<any>([]);

  React.useEffect(() => {
    callGetAllValidNotification();
  }, []);

  // Get all notifications
  const callGetAllValidNotification = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    const requestBody = {
      organisationId: tempLocalUserData && tempLocalUserData.enterpriseId,
      userId: tempLocalUserData && tempLocalUserData.emailId,
    };
    await getAllValidNotification(requestBody).then(
      res => {
        setAllValidNotifications(res);
        const sub = moment(new Date())
          .subtract(24, 'hours')
          .format('Do MMM YYYY hh:mm:ss');
        let todayNotifications: any = [];
        let previousNotifications: any = [];
        res.map((notification: any) => {
          if (
            moment(notification.createdAt).format('Do MMM YYYY hh:mm:ss') > sub
          ) {
            todayNotifications.push(notification);
          } else {
            previousNotifications.push(notification);
          }
        });
        setAllPreviousValidNotifications(previousNotifications);
        setAllTodayValidNotifications(todayNotifications);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
    );
  };

  // Get BY Notification Id
  const callGetTeamByIdForUpdate = async (notificationId: string) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await getByNotificationId(notificationId).then(
      res => {
        callUpdateNotification(notificationId, res);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        console.log('err', err);
      }
    );
  };

  // Update Notification
  const callUpdateNotification = async (
    notificationId: string,
    notificationData: any
  ) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    const requestBody = {
      ...notificationData,
      isRead: true,
    };
    await updateNotification(notificationId, requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllValidNotification();
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllValidNotification();
      }
    );
  };

  // Mark all as read
  const callMarkAllAsRead = async () => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    const requestBody = {
      userId: tempLocalUserData && tempLocalUserData.emailId,
    };
    await markAllNotificationById(requestBody).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllValidNotification();
      },
      err => {
        console.log('err', err);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
        callGetAllValidNotification();
      }
    );
  };

  const goToViewAllRequest = () => {
    if (gUser.azureUser?.roleName && gUser.azureUser?.roleName === BASIC) {
      navigate('/basic/teams/manageUsers/');
    } else if (
      gUser.azureUser?.roleName &&
      gUser.azureUser?.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/teams/manageUsers/');
    }
  };

  const goToViewAllTeams = () => {
    if (gUser.azureUser?.roleName && gUser.azureUser?.roleName === BASIC) {
      navigate('/basic/teams/allTeams/');
    } else if (
      gUser.azureUser?.roleName &&
      gUser.azureUser?.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/teams/allTeams/');
    }
  };

  const goToViewAllSessions = () => {
    if (gUser.azureUser?.roleName && gUser.azureUser?.roleName === BASIC) {
      navigate('/basic/sessions/');
    } else if (
      gUser.azureUser?.roleName &&
      gUser.azureUser?.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/sessions/');
    }
  };

  const goToViewAllActions = () => {
    if (gUser.azureUser?.roleName && gUser.azureUser?.roleName === BASIC) {
      navigate('/basic/actions/');
    } else if (
      gUser.azureUser?.roleName &&
      gUser.azureUser?.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/actions/');
    }
  };

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
          label="Notification"
          style={{ color: commonStyles.PrimaryDark }}
        />
        {/* If Notification is > 0 */}
        {allValidNotifications.length > 0 ? (
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
          >
            {/* Mark all as read */}
            {allValidNotifications.length > 0 && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  marginBottom: '4px',
                }}
              >
                <BodyRegularTypography
                  label="Mark all as read"
                  style={{ color: '#159ADD', cursor: 'pointer' }}
                  onClick={callMarkAllAsRead}
                />
              </Box>
            )}
            {/* Today Notification label */}
            {allTodayValidNotifications.length > 0 && (
              <BodySemiBoldTypography
                label="Today"
                style={{ marginBottom: '16px' }}
              />
            )}
            {/* Today Notifications */}
            {allTodayValidNotifications.map(
              (allValidNotification: any, index: any) => {
                return (
                  <Box key={index}>
                    {/* APPROVED_ENTERPRISE_REQUEST */}
                    {allValidNotification.type ===
                      APPROVED_ENTERPRISE_REQUEST && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom:
                            index === allValidNotifications.length - 1
                              ? 'none'
                              : '1px solid #E3E3E3',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                          }}
                        >
                          {/* Avatar */}
                          <Box sx={{ padding: '16px' }}>
                            {allValidNotification.fromUserDetails[0]
                              .selectedAvatar != '' ? (
                              <LazyLoadImage
                                className="avatar"
                                style={{
                                  height: '64px',
                                  width: '64px',
                                  borderRadius: '50%',
                                  border: '5px solid #f9fbf8',
                                  cursor: 'pointer',
                                }}
                                src={
                                  '/avatars/animals/' +
                                  allValidNotification.fromUserDetails[0]
                                    .selectedAvatar +
                                  '.svg'
                                }
                              ></LazyLoadImage>
                            ) : (
                              <LazyLoadImage
                                width="64px !important"
                                height="48px !important"
                                style={{
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  border: 'none',
                                }}
                                src={'/svgs/DefaultUser.svg'}
                              ></LazyLoadImage>
                            )}
                          </Box>
                          {/* Text */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'column',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                              }}
                            >
                              <BodySemiBoldTypography
                                label={
                                  allValidNotification.fromUserDetails[0]
                                    .firstName +
                                  ' ' +
                                  allValidNotification.fromUserDetails[0]
                                    .lastName
                                }
                              />
                              &nbsp;
                              <BodyRegularTypography label="has approved your request for Enterprise Role" />
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: '24px',
                              }}
                            >
                              <CaptionRegularTypography
                                label={moment(
                                  allValidNotification.createdAt
                                ).format('Do MMM YYYY')}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="row">
                          <ContainedButton
                            id="mark_as_read"
                            name="Mark as Read"
                            onClick={() =>
                              callGetTeamByIdForUpdate(
                                allValidNotification.notificationId
                              )
                            }
                            size={'small'}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* DECLINE_ENTERPRISE_REQUEST */}
                    {allValidNotification.type ===
                      DECLINE_ENTERPRISE_REQUEST && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom:
                            index === allValidNotifications.length - 1
                              ? 'none'
                              : '1px solid #E3E3E3',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                          }}
                        >
                          {/* Avatar */}
                          <Box sx={{ padding: '16px' }}>
                            {allValidNotification.fromUserDetails[0]
                              .selectedAvatar != '' ? (
                              <LazyLoadImage
                                className="avatar"
                                style={{
                                  height: '64px',
                                  width: '64px',
                                  borderRadius: '50%',
                                  border: '5px solid #f9fbf8',
                                  cursor: 'pointer',
                                }}
                                src={
                                  '/avatars/animals/' +
                                  allValidNotification.fromUserDetails[0]
                                    .selectedAvatar +
                                  '.svg'
                                }
                              ></LazyLoadImage>
                            ) : (
                              <LazyLoadImage
                                width="64px !important"
                                height="48px !important"
                                style={{
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  border: 'none',
                                }}
                                src={'/svgs/DefaultUser.svg'}
                              ></LazyLoadImage>
                            )}
                          </Box>
                          {/* Text */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'column',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                              }}
                            >
                              <BodySemiBoldTypography
                                label={
                                  allValidNotification.fromUserDetails[0]
                                    .firstName +
                                  ' ' +
                                  allValidNotification.fromUserDetails[0]
                                    .lastName
                                }
                              />
                              &nbsp;
                              <BodyRegularTypography label="has declined your request for Enterprise Role" />
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: '24px',
                              }}
                            >
                              <CaptionRegularTypography
                                label={moment(
                                  allValidNotification.createdAt
                                ).format('Do MMM YYYY')}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="row">
                          <ContainedButton
                            id="mark_as_read"
                            name="Mark as Read"
                            onClick={() =>
                              callGetTeamByIdForUpdate(
                                allValidNotification.notificationId
                              )
                            }
                            size={'small'}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* REQUEST_FOR_ENTERPRISE */}
                    {allValidNotification.type === REQUEST_FOR_ENTERPRISE && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom:
                            index === allValidNotifications.length - 1
                              ? 'none'
                              : '1px solid #E3E3E3',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                          }}
                        >
                          {/* Avatar */}
                          <Box sx={{ padding: '16px' }}>
                            {allValidNotification.fromUserDetails[0]
                              .selectedAvatar != '' ? (
                              <LazyLoadImage
                                className="avatar"
                                style={{
                                  height: '64px',
                                  width: '64px',
                                  borderRadius: '50%',
                                  border: '5px solid #f9fbf8',
                                  cursor: 'pointer',
                                }}
                                src={
                                  '/avatars/animals/' +
                                  allValidNotification.fromUserDetails[0]
                                    .selectedAvatar +
                                  '.svg'
                                }
                              ></LazyLoadImage>
                            ) : (
                              <LazyLoadImage
                                width="64px !important"
                                height="48px !important"
                                style={{
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  border: 'none',
                                }}
                                src={'/svgs/DefaultUser.svg'}
                              ></LazyLoadImage>
                            )}
                          </Box>
                          {/* Text */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'column',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                              }}
                            >
                              <BodySemiBoldTypography
                                label={
                                  allValidNotification.fromUserDetails[0]
                                    .firstName +
                                  ' ' +
                                  allValidNotification.fromUserDetails[0]
                                    .lastName
                                }
                              />
                              &nbsp;
                              <BodyRegularTypography label="has requested you for Enterprise Role" />
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: '24px',
                              }}
                            >
                              <CaptionRegularTypography
                                label={moment(
                                  allValidNotification.createdAt
                                ).format('Do MMM YYYY')}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="row">
                          <ContainedButton
                            id="View_All_Request"
                            name="View All Request"
                            onClick={() => {
                              goToViewAllRequest();
                              callGetTeamByIdForUpdate(
                                allValidNotification.notificationId
                              );
                            }}
                            size={'small'}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* ADDED_IN_TEAM */}
                    {allValidNotification.type === ADDED_IN_TEAM &&
                      tempLocalUserData &&
                      tempLocalUserData.isTeamNotificationChecked && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom:
                              index === allValidNotifications.length - 1
                                ? ''
                                : '1px solid #E3E3E3',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'row',
                            }}
                          >
                            {/* Avatar */}
                            <Box sx={{ padding: '16px' }}>
                              {allValidNotification.fromUserDetails[0]
                                .selectedAvatar != '' ? (
                                <LazyLoadImage
                                  className="avatar"
                                  style={{
                                    height: '64px',
                                    width: '64px',
                                    borderRadius: '50%',
                                    border: '5px solid #f9fbf8',
                                    cursor: 'pointer',
                                  }}
                                  src={
                                    '/avatars/animals/' +
                                    allValidNotification.fromUserDetails[0]
                                      .selectedAvatar +
                                    '.svg'
                                  }
                                ></LazyLoadImage>
                              ) : (
                                <LazyLoadImage
                                  width="64px !important"
                                  height="48px !important"
                                  style={{
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: 'none',
                                  }}
                                  src={'/svgs/DefaultUser.svg'}
                                ></LazyLoadImage>
                              )}
                            </Box>
                            {/* Text */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                }}
                              >
                                <BodySemiBoldTypography
                                  label={
                                    allValidNotification.fromUserDetails[0]
                                      .firstName +
                                    ' ' +
                                    allValidNotification.fromUserDetails[0]
                                      .lastName
                                  }
                                />
                                &nbsp;
                                <BodyRegularTypography label="has added you in new Team" />
                              </Box>
                              <Box
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                  marginTop: '24px',
                                }}
                              >
                                <CaptionRegularTypography
                                  label={moment(
                                    allValidNotification.createdAt
                                  ).format('Do MMM YYYY')}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="row">
                            <ContainedButton
                              id="View_All_Teams"
                              name="View All Teams"
                              onClick={() => {
                                goToViewAllTeams();
                                callGetTeamByIdForUpdate(
                                  allValidNotification.notificationId
                                );
                              }}
                              size={'small'}
                            />
                          </Box>
                        </Box>
                      )}

                    {/* ADDED_IN_NEW_SESSION */}
                    {allValidNotification.type === ADDED_IN_NEW_SESSION &&
                      tempLocalUserData &&
                      tempLocalUserData.isSessionNotificationChecked && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom:
                              index === allValidNotifications.length - 1
                                ? ''
                                : '1px solid #E3E3E3',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'row',
                            }}
                          >
                            {/* Avatar */}
                            <Box sx={{ padding: '16px' }}>
                              {allValidNotification.fromUserDetails[0]
                                .selectedAvatar != '' ? (
                                <LazyLoadImage
                                  className="avatar"
                                  style={{
                                    height: '64px',
                                    width: '64px',
                                    borderRadius: '50%',
                                    border: '5px solid #f9fbf8',
                                    cursor: 'pointer',
                                  }}
                                  src={
                                    '/avatars/animals/' +
                                    allValidNotification.fromUserDetails[0]
                                      .selectedAvatar +
                                    '.svg'
                                  }
                                ></LazyLoadImage>
                              ) : (
                                <LazyLoadImage
                                  width="64px !important"
                                  height="48px !important"
                                  style={{
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: 'none',
                                  }}
                                  src={'/svgs/DefaultUser.svg'}
                                ></LazyLoadImage>
                              )}
                            </Box>
                            {/* Text */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                }}
                              >
                                <BodySemiBoldTypography
                                  label={
                                    allValidNotification.fromUserDetails[0]
                                      .firstName +
                                    ' ' +
                                    allValidNotification.fromUserDetails[0]
                                      .lastName
                                  }
                                />
                                &nbsp;
                                <BodyRegularTypography label="has added you in new Session" />
                              </Box>
                              <Box
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                  marginTop: '24px',
                                }}
                              >
                                <CaptionRegularTypography
                                  label={moment(
                                    allValidNotification.createdAt
                                  ).format('Do MMM YYYY')}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="row">
                            <ContainedButton
                              id="View_All_Session"
                              name="View All Sessions"
                              onClick={() => {
                                goToViewAllSessions();
                                callGetTeamByIdForUpdate(
                                  allValidNotification.notificationId
                                );
                              }}
                              size={'small'}
                            />
                          </Box>
                        </Box>
                      )}
                    {/* ADDED_IN_NEW_ACTION */}
                    {allValidNotification.type === ADDED_IN_NEW_ACTION &&
                      tempLocalUserData &&
                      tempLocalUserData.isActionNotificationChecked && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom:
                              index === allValidNotifications.length - 1
                                ? ''
                                : '1px solid #E3E3E3',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'row',
                            }}
                          >
                            {/* Avatar */}
                            <Box sx={{ padding: '16px' }}>
                              {allValidNotification.fromUserDetails[0]
                                .selectedAvatar != '' ? (
                                <LazyLoadImage
                                  className="avatar"
                                  style={{
                                    height: '64px',
                                    width: '64px',
                                    borderRadius: '50%',
                                    border: '5px solid #f9fbf8',
                                    cursor: 'pointer',
                                  }}
                                  src={
                                    '/avatars/animals/' +
                                    allValidNotification.fromUserDetails[0]
                                      .selectedAvatar +
                                    '.svg'
                                  }
                                ></LazyLoadImage>
                              ) : (
                                <LazyLoadImage
                                  width="64px !important"
                                  height="48px !important"
                                  style={{
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: 'none',
                                  }}
                                  src={'/svgs/DefaultUser.svg'}
                                ></LazyLoadImage>
                              )}
                            </Box>
                            {/* Text */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                }}
                              >
                                <BodySemiBoldTypography
                                  label={
                                    allValidNotification.fromUserDetails[0]
                                      .firstName +
                                    ' ' +
                                    allValidNotification.fromUserDetails[0]
                                      .lastName
                                  }
                                />
                                &nbsp;
                                <BodyRegularTypography label="has assign you in new Action" />
                              </Box>
                              <Box
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                  marginTop: '24px',
                                }}
                              >
                                <CaptionRegularTypography
                                  label={moment(
                                    allValidNotification.createdAt
                                  ).format('Do MMM YYYY')}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="row">
                            <ContainedButton
                              id="View_All_Session"
                              name="View All Sessions"
                              onClick={() => {
                                goToViewAllActions();
                                callGetTeamByIdForUpdate(
                                  allValidNotification.notificationId
                                );
                              }}
                              size={'small'}
                            />
                          </Box>
                        </Box>
                      )}
                  </Box>
                );
              }
            )}
            {/* Previous Notification label */}
            {allPreviousValidNotifications.length > 0 && (
              <BodySemiBoldTypography
                label="Previous"
                style={{ marginTop: '16px' }}
              />
            )}
            {/* Previous Notification label */}
            {allPreviousValidNotifications.map(
              (allValidNotification: any, index: any) => {
                return (
                  <Box key={index}>
                    {/* APPROVED_ENTERPRISE_REQUEST */}
                    {allValidNotification.type ===
                      APPROVED_ENTERPRISE_REQUEST && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom:
                            index === allValidNotifications.length - 1
                              ? 'none'
                              : '1px solid #E3E3E3',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                          }}
                        >
                          {/* Avatar */}
                          <Box sx={{ padding: '16px' }}>
                            {allValidNotification.fromUserDetails[0]
                              .selectedAvatar != '' ? (
                              <LazyLoadImage
                                className="avatar"
                                style={{
                                  height: '64px',
                                  width: '64px',
                                  borderRadius: '50%',
                                  border: '5px solid #f9fbf8',
                                  cursor: 'pointer',
                                }}
                                src={
                                  '/avatars/animals/' +
                                  allValidNotification.fromUserDetails[0]
                                    .selectedAvatar +
                                  '.svg'
                                }
                              ></LazyLoadImage>
                            ) : (
                              <LazyLoadImage
                                width="64px !important"
                                height="48px !important"
                                style={{
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  border: 'none',
                                }}
                                src={'/svgs/DefaultUser.svg'}
                              ></LazyLoadImage>
                            )}
                          </Box>
                          {/* Text */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'column',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                              }}
                            >
                              <BodySemiBoldTypography
                                label={
                                  allValidNotification.fromUserDetails[0]
                                    .firstName +
                                  ' ' +
                                  allValidNotification.fromUserDetails[0]
                                    .lastName
                                }
                              />
                              &nbsp;
                              <BodyRegularTypography label="has approved your request for Enterprise Role" />
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: '24px',
                              }}
                            >
                              <CaptionRegularTypography
                                label={moment(
                                  allValidNotification.createdAt
                                ).format('Do MMM YYYY')}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="row">
                          <ContainedButton
                            id="mark_as_read"
                            name="Mark as Read"
                            onClick={() =>
                              callGetTeamByIdForUpdate(
                                allValidNotification.notificationId
                              )
                            }
                            size={'small'}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* DECLINE_ENTERPRISE_REQUEST */}
                    {allValidNotification.type ===
                      DECLINE_ENTERPRISE_REQUEST && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom:
                            index === allValidNotifications.length - 1
                              ? 'none'
                              : '1px solid #E3E3E3',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                          }}
                        >
                          {/* Avatar */}
                          <Box sx={{ padding: '16px' }}>
                            {allValidNotification.fromUserDetails[0]
                              .selectedAvatar != '' ? (
                              <LazyLoadImage
                                className="avatar"
                                style={{
                                  height: '64px',
                                  width: '64px',
                                  borderRadius: '50%',
                                  border: '5px solid #f9fbf8',
                                  cursor: 'pointer',
                                }}
                                src={
                                  '/avatars/animals/' +
                                  allValidNotification.fromUserDetails[0]
                                    .selectedAvatar +
                                  '.svg'
                                }
                              ></LazyLoadImage>
                            ) : (
                              <LazyLoadImage
                                width="64px !important"
                                height="48px !important"
                                style={{
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  border: 'none',
                                }}
                                src={'/svgs/DefaultUser.svg'}
                              ></LazyLoadImage>
                            )}
                          </Box>
                          {/* Text */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'column',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                              }}
                            >
                              <BodySemiBoldTypography
                                label={
                                  allValidNotification.fromUserDetails[0]
                                    .firstName +
                                  ' ' +
                                  allValidNotification.fromUserDetails[0]
                                    .lastName
                                }
                              />
                              &nbsp;
                              <BodyRegularTypography label="has declined your request for Enterprise Role" />
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: '24px',
                              }}
                            >
                              <CaptionRegularTypography
                                label={moment(
                                  allValidNotification.createdAt
                                ).format('Do MMM YYYY')}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="row">
                          <ContainedButton
                            id="mark_as_read"
                            name="Mark as Read"
                            onClick={() =>
                              callGetTeamByIdForUpdate(
                                allValidNotification.notificationId
                              )
                            }
                            size={'small'}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* REQUEST_FOR_ENTERPRISE */}
                    {allValidNotification.type === REQUEST_FOR_ENTERPRISE && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom:
                            index === allValidNotifications.length - 1
                              ? 'none'
                              : '1px solid #E3E3E3',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexDirection: 'row',
                          }}
                        >
                          {/* Avatar */}
                          <Box sx={{ padding: '16px' }}>
                            {allValidNotification.fromUserDetails[0]
                              .selectedAvatar != '' ? (
                              <LazyLoadImage
                                className="avatar"
                                style={{
                                  height: '64px',
                                  width: '64px',
                                  borderRadius: '50%',
                                  border: '5px solid #f9fbf8',
                                  cursor: 'pointer',
                                }}
                                src={
                                  '/avatars/animals/' +
                                  allValidNotification.fromUserDetails[0]
                                    .selectedAvatar +
                                  '.svg'
                                }
                              ></LazyLoadImage>
                            ) : (
                              <LazyLoadImage
                                width="64px !important"
                                height="48px !important"
                                style={{
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  border: 'none',
                                }}
                                src={'/svgs/DefaultUser.svg'}
                              ></LazyLoadImage>
                            )}
                          </Box>
                          {/* Text */}
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'column',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                              }}
                            >
                              <BodySemiBoldTypography
                                label={
                                  allValidNotification.fromUserDetails[0]
                                    .firstName +
                                  ' ' +
                                  allValidNotification.fromUserDetails[0]
                                    .lastName
                                }
                              />
                              &nbsp;
                              <BodyRegularTypography label="has requested you for Enterprise Role" />
                            </Box>
                            <Box
                              sx={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'row',
                                marginTop: '24px',
                              }}
                            >
                              <CaptionRegularTypography
                                label={moment(
                                  allValidNotification.createdAt
                                ).format('Do MMM YYYY')}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="row">
                          <ContainedButton
                            id="View_All_Request"
                            name="View All Request"
                            onClick={() => {
                              goToViewAllRequest();
                              callGetTeamByIdForUpdate(
                                allValidNotification.notificationId
                              );
                            }}
                            size={'small'}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* ADDED_IN_TEAM */}
                    {allValidNotification.type === ADDED_IN_TEAM &&
                      tempLocalUserData &&
                      tempLocalUserData.isTeamNotificationChecked && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom:
                              index === allValidNotifications.length - 1
                                ? ''
                                : '1px solid #E3E3E3',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'row',
                            }}
                          >
                            {/* Avatar */}
                            <Box sx={{ padding: '16px' }}>
                              {allValidNotification.fromUserDetails[0]
                                .selectedAvatar != '' ? (
                                <LazyLoadImage
                                  className="avatar"
                                  style={{
                                    height: '64px',
                                    width: '64px',
                                    borderRadius: '50%',
                                    border: '5px solid #f9fbf8',
                                    cursor: 'pointer',
                                  }}
                                  src={
                                    '/avatars/animals/' +
                                    allValidNotification.fromUserDetails[0]
                                      .selectedAvatar +
                                    '.svg'
                                  }
                                ></LazyLoadImage>
                              ) : (
                                <LazyLoadImage
                                  width="64px !important"
                                  height="48px !important"
                                  style={{
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: 'none',
                                  }}
                                  src={'/svgs/DefaultUser.svg'}
                                ></LazyLoadImage>
                              )}
                            </Box>
                            {/* Text */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                }}
                              >
                                <BodySemiBoldTypography
                                  label={
                                    allValidNotification.fromUserDetails[0]
                                      .firstName +
                                    ' ' +
                                    allValidNotification.fromUserDetails[0]
                                      .lastName
                                  }
                                />
                                &nbsp;
                                <BodyRegularTypography label="has added you in new Team" />
                              </Box>
                              <Box
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                  marginTop: '24px',
                                }}
                              >
                                <CaptionRegularTypography
                                  label={moment(
                                    allValidNotification.createdAt
                                  ).format('Do MMM YYYY')}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="row">
                            <ContainedButton
                              id="View_All_Teams"
                              name="View All Teams"
                              onClick={() => {
                                goToViewAllTeams();
                                callGetTeamByIdForUpdate(
                                  allValidNotification.notificationId
                                );
                              }}
                              size={'small'}
                            />
                          </Box>
                        </Box>
                      )}

                    {/* ADDED_IN_NEW_SESSION */}
                    {allValidNotification.type === ADDED_IN_NEW_SESSION &&
                      tempLocalUserData &&
                      tempLocalUserData.isSessionNotificationChecked && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom:
                              index === allValidNotifications.length - 1
                                ? ''
                                : '1px solid #E3E3E3',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'row',
                            }}
                          >
                            {/* Avatar */}
                            <Box sx={{ padding: '16px' }}>
                              {allValidNotification.fromUserDetails[0]
                                .selectedAvatar != '' ? (
                                <LazyLoadImage
                                  className="avatar"
                                  style={{
                                    height: '64px',
                                    width: '64px',
                                    borderRadius: '50%',
                                    border: '5px solid #f9fbf8',
                                    cursor: 'pointer',
                                  }}
                                  src={
                                    '/avatars/animals/' +
                                    allValidNotification.fromUserDetails[0]
                                      .selectedAvatar +
                                    '.svg'
                                  }
                                ></LazyLoadImage>
                              ) : (
                                <LazyLoadImage
                                  width="64px !important"
                                  height="48px !important"
                                  style={{
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: 'none',
                                  }}
                                  src={'/svgs/DefaultUser.svg'}
                                ></LazyLoadImage>
                              )}
                            </Box>
                            {/* Text */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                }}
                              >
                                <BodySemiBoldTypography
                                  label={
                                    allValidNotification.fromUserDetails[0]
                                      .firstName +
                                    ' ' +
                                    allValidNotification.fromUserDetails[0]
                                      .lastName
                                  }
                                />
                                &nbsp;
                                <BodyRegularTypography label="has added you in new Session" />
                              </Box>
                              <Box
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                  marginTop: '24px',
                                }}
                              >
                                <CaptionRegularTypography
                                  label={moment(
                                    allValidNotification.createdAt
                                  ).format('Do MMM YYYY')}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="row">
                            <ContainedButton
                              id="View_All_Session"
                              name="View All Sessions"
                              onClick={() => {
                                goToViewAllSessions();
                                callGetTeamByIdForUpdate(
                                  allValidNotification.notificationId
                                );
                              }}
                              size={'small'}
                            />
                          </Box>
                        </Box>
                      )}
                    {/* ADDED_IN_NEW_ACTION */}
                    {allValidNotification.type === ADDED_IN_NEW_ACTION &&
                      tempLocalUserData &&
                      tempLocalUserData.isActionNotificationChecked && (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom:
                              index === allValidNotifications.length - 1
                                ? ''
                                : '1px solid #E3E3E3',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              flexDirection: 'row',
                            }}
                          >
                            {/* Avatar */}
                            <Box sx={{ padding: '16px' }}>
                              {allValidNotification.fromUserDetails[0]
                                .selectedAvatar != '' ? (
                                <LazyLoadImage
                                  className="avatar"
                                  style={{
                                    height: '64px',
                                    width: '64px',
                                    borderRadius: '50%',
                                    border: '5px solid #f9fbf8',
                                    cursor: 'pointer',
                                  }}
                                  src={
                                    '/avatars/animals/' +
                                    allValidNotification.fromUserDetails[0]
                                      .selectedAvatar +
                                    '.svg'
                                  }
                                ></LazyLoadImage>
                              ) : (
                                <LazyLoadImage
                                  width="64px !important"
                                  height="48px !important"
                                  style={{
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    border: 'none',
                                  }}
                                  src={'/svgs/DefaultUser.svg'}
                                ></LazyLoadImage>
                              )}
                            </Box>
                            {/* Text */}
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                flexDirection: 'column',
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                }}
                              >
                                <BodySemiBoldTypography
                                  label={
                                    allValidNotification.fromUserDetails[0]
                                      .firstName +
                                    ' ' +
                                    allValidNotification.fromUserDetails[0]
                                      .lastName
                                  }
                                />
                                &nbsp;
                                <BodyRegularTypography label="has assign you in new Action" />
                              </Box>
                              <Box
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  flexDirection: 'row',
                                  marginTop: '24px',
                                }}
                              >
                                <CaptionRegularTypography
                                  label={moment(
                                    allValidNotification.createdAt
                                  ).format('Do MMM YYYY')}
                                />
                              </Box>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="row">
                            <ContainedButton
                              id="View_All_Session"
                              name="View All Sessions"
                              onClick={() => {
                                goToViewAllActions();
                                callGetTeamByIdForUpdate(
                                  allValidNotification.notificationId
                                );
                              }}
                              size={'small'}
                            />
                          </Box>
                        </Box>
                      )}
                  </Box>
                );
              }
            )}
          </Paper>
        ) : (
          // If Notification is < 0
          <Paper
            sx={{
              width: '100%',
              background: 'rgb(249 251 252)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              marginTop: '24px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <H2SemiBoldTypography
                label="Notifications not found!"
                style={{ color: '#2C69A1' }}
              />
            </Box>
          </Paper>
        )}
      </Box>
    </>
  );
}
