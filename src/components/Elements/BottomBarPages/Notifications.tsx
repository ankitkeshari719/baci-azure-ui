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
} from '../../../constants/applicationConst';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

export default function Notifications() {
  const navigate = useNavigate();
  const [global, dispatch] = React.useContext(GlobalContext);
  const localUserData = localStorage.getItem('userData');
  const tempLocalUserData = localUserData && JSON.parse(localUserData);
  const [allValidNotifications, setAllValidNotifications] = React.useState([]);

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

  // Update Notification
  const callUpdateNotification = async (notificationId: string) => {
    const requestBody = {
      type: 'requestForAdmin',
      organisationId: 'gmail0.987721652970178',
      fromId: 'ankitkeshari718@gmail.com',
      toId: ['ankitkeshari719@gmail.com', 'ujalakashyap05@gmail.com'],
      isRead: false,
    };
    await updateNotification(notificationId, requestBody).then(
      res => {
        console.log('callUpdateUser response', res);
      },
      err => {
        console.log('err', err);
      }
    );
  };

  const goToViewAllRequest = () => {
    if (global.azureUser?.roleName && global.azureUser?.roleName === BASIC) {
      navigate('/basic/teams/manageUsers/');
    } else if (
      global.azureUser?.roleName &&
      global.azureUser?.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/teams/manageUsers/');
    }
  };

  const goToViewAllTeams = () => {
    if (global.azureUser?.roleName && global.azureUser?.roleName === BASIC) {
      navigate('/basic/teams/allTeams/');
    } else if (
      global.azureUser?.roleName &&
      global.azureUser?.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/teams/allTeams/');
    }
  };

  const goToViewAllSessions = () => {
    if (global.azureUser?.roleName && global.azureUser?.roleName === BASIC) {
      navigate('/basic/sessions/');
    } else if (
      global.azureUser?.roleName &&
      global.azureUser?.roleName === ENTERPRISE
    ) {
      navigate('/enterprise/sessions/');
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
              onClick={() => console.log('callUpdateNotification')}
            />
          </Box>
          {allValidNotifications.map(
            (allValidNotification: any, index: any) => {
              return (
                <Box key={index}>
                  {/* APPROVED_ENTERPRISE_REQUEST */}
                  {allValidNotification.type ===
                    APPROVED_ENTERPRISE_REQUEST && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        borderBottom:
                          index === allValidNotifications.length - 1
                            ? ''
                            : '1px solid #E3E3E3',
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
                              allValidNotification.fromUserDetails[0].lastName
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
                  )}

                  {/* DECLINE_ENTERPRISE_REQUEST */}
                  {allValidNotification.type === DECLINE_ENTERPRISE_REQUEST && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        borderBottom:
                          index === allValidNotifications.length - 1
                            ? ''
                            : '1px solid #E3E3E3',
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
                              allValidNotification.fromUserDetails[0].lastName
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
                                allValidNotification.fromUserDetails[0].lastName
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
                          onClick={goToViewAllRequest}
                          size={'small'}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* ADDED_IN_TEAM */}
                  {allValidNotification.type === ADDED_IN_TEAM && (
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
                                allValidNotification.fromUserDetails[0].lastName
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
                          onClick={goToViewAllTeams}
                          size={'small'}
                        />
                      </Box>
                    </Box>
                  )}

                  {/* ADDED_IN_NEW_SESSION */}
                  {allValidNotification.type === ADDED_IN_NEW_SESSION && (
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
                                allValidNotification.fromUserDetails[0].lastName
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
                          onClick={goToViewAllSessions}
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
      </Box>
    </>
  );
}
