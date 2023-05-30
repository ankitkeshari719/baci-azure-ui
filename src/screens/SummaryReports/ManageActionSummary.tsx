import React from 'react';
import { Box, Typography } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import Avatar from '../../elements/Avatar';
import { ActionInterface } from '../../types';
import * as Icons from 'heroicons-react';
import './styles.scss';
import '../../global.scss';

type Props = {
  manageActions: ActionInterface[];
  users: any;
  topVotedManageActions: ActionInterface[];
  manageActionsLastVoted: ActionInterface[];
  copyAllManageActions?: () => void;
  handleShowManageActions?: () => void;
  showAllManageAction: boolean;
};

export default function ManageActionSummary({
  manageActions,
  copyAllManageActions,
  handleShowManageActions,
  users,
  showAllManageAction,
  topVotedManageActions,
  manageActionsLastVoted,
}: Props) {
  const windowWidth = React.useRef(window.innerWidth);

  return (
    <Box>
      {/* Actions to be Taken Section 1*/}
      <Row style={{ marginTop: '36px' }}>
        <Col xs="2" className="d-flex justify-content-start align-items-center">
          <Typography className="textTypeFour">Actions Identified</Typography>
        </Col>
        {manageActions.length === 0 ? null : (
          <Col
            xs={{ span: 2, offset: 8 }}
            className="d-flex justify-content-end align-items-center"
            id="copy-to-clipboard"
          >
            <Typography
              className="viewParticipants"
              onClick={copyAllManageActions}
            >
              Copy to Clipboard
            </Typography>
          </Col>
        )}
      </Row>
      {/* Actions to be Taken Section 2*/}
      {manageActions.length === 0 ? (
        // Manage Action when the no. is zero
        <Row style={{ marginTop: '16px' }}>
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
          >
            <Box
              sx={{
                width: '100%',
                height: '240px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                background: '#FAFAFA',
                border: '1px solid #CCCCCC',
              }}
            >
              <Box
                component="div"
                sx={{ textAlign: 'justify', marginTop: '16px' }}
              >
                <Typography className="text1">No data present</Typography>
              </Box>
            </Box>
          </Col>
        </Row>
      ) : (
        <>
          {/* Manage Action when the no. is greater then zero */}
          <Box sx={{ marginTop: '16px' }} id="actions-column">
            {showAllManageAction ? (
              <>
                {manageActions.map((action: ActionInterface, index: number) => {
                  const labelId = `action-label-${action.id}`;
                  return (
                    <Row
                      style={{ marginTop: index > 0 ? '16px' : '0px' }}
                      key={labelId}
                    >
                      <Col
                        xs="12"
                        className="d-flex justify-content-start align-items-center"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                            fill="#FBBC05"
                            stroke="#FBBC05"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <Typography
                          color="black"
                          style={{
                            fontWeight: 400,
                            fontSize: '14px',
                            color: '#FBBC05',
                            marginLeft: '6px',
                          }}
                        >
                          {action.reacts.length === 0
                            ? 0
                            : action.reacts.length}
                        </Typography>
                        {action?.assigneeAvatar === '' ||
                        action.assigneeAvatar === undefined ? (
                          <Icons.UserCircle
                            style={{
                              color: '#CCCCCC',
                              width: '40px',
                              height: '40px',
                            }}
                          />
                        ) : (
                          <Avatar
                            avatar={action?.assigneeAvatar}
                            onClickAvatar={() => {}}
                            css={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              border: 'none',
                            }}
                          ></Avatar>
                        )}

                        <Typography
                          style={{ marginLeft: '12px' }}
                          className="actionValue"
                        >
                          {action.value}
                        </Typography>
                      </Col>
                    </Row>
                  );
                })}
                <Typography
                  className="viewWorldCould"
                  sx={{ marginTop: '8px' }}
                  onClick={handleShowManageActions}
                >
                  Show Less
                </Typography>
              </>
            ) : (
              <>
                {topVotedManageActions.map(
                  (action: ActionInterface, index: number) => {
                    const labelId = `action-label-${action.id}`;
                    return (
                      <Row
                        style={{ marginTop: index > 0 ? '16px' : '0px' }}
                        key={labelId}
                      >
                        <Col
                          xs="12"
                          className="d-flex justify-content-start align-items-center"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                              fill="#FBBC05"
                              stroke="#FBBC05"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <Typography
                            color="black"
                            style={{
                              fontWeight: 400,
                              fontSize: '14px',
                              color: '#FBBC05',
                              marginLeft: '6px',
                            }}
                          >
                            {action.reacts.length === 0
                              ? 0
                              : action.reacts.length}
                          </Typography>
                          {action?.assigneeAvatar === '' ||
                          action.assigneeAvatar === undefined ? (
                            <Icons.UserCircle
                              style={{
                                color: '#CCCCCC',
                                width: '40px',
                                height: '40px',
                              }}
                            />
                          ) : (
                            <Avatar
                              avatar={action?.assigneeAvatar}
                              onClickAvatar={() => {}}
                              css={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: 'none',
                              }}
                            ></Avatar>
                          )}
                          <Typography
                            style={{ marginLeft: '12px' }}
                            className="actionValue"
                          >
                            {action.value}
                          </Typography>
                        </Col>
                      </Row>
                    );
                  }
                )}
                {manageActions.length > 4 && (
                  <Row style={{ marginTop: '16px' }}>
                    <Col
                      xs="12"
                      className="d-flex justify-content-start align-items-center"
                    >
                      {manageActionsLastVoted.map(
                        (action: ActionInterface, index: number) => {
                          return (
                            <>
                              {action.assigneeAvatar === '' ||
                              action.assigneeAvatar === undefined ? (
                                <Icons.UserCircle
                                  style={{
                                    color: '#CCCCCC',
                                    width: '40px',
                                    height: '40px',
                                  }}
                                />
                              ) : (
                                <Avatar
                                  avatar={action?.assigneeAvatar}
                                  onClickAvatar={() => {}}
                                  css={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: 'none',
                                  }}
                                ></Avatar>
                              )}
                            </>
                          );
                        }
                      )}
                      <Typography
                        className="viewWorldCould"
                        sx={{ marginLeft: '8px' }}
                        onClick={handleShowManageActions}
                      >
                        View More Comments from {users.length}&nbsp;
                        Participants
                      </Typography>
                    </Col>
                  </Row>
                )}
              </>
            )}
          </Box>
          {/* Print Manage Action */}
          <Box
            sx={{ marginTop: '16px', display: 'none' }}
            id="actions-column-print"
          >
            {manageActions.map((action: ActionInterface, index: number) => {
              const labelId = `action-label-${action.id}`;

              return (
                <Row
                  style={{ marginTop: index > 0 ? '16px' : '0px' }}
                  key={labelId}
                >
                  <Col
                    xs="12"
                    className="d-flex justify-content-start align-items-center"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                        fill="#FBBC05"
                        stroke="#FBBC05"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <Typography
                      color="black"
                      style={{
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#FBBC05',
                        marginLeft: '6px',
                      }}
                    >
                      {action.reacts.length === 0 ? 0 : action.reacts.length}
                    </Typography>
                    {action.assigneeAvatar === '' ||
                    action.assigneeAvatar === undefined ? (
                      <Icons.UserCircle
                        style={{
                          color: '#CCCCCC',
                          width: '40px',
                          height: '40px',
                        }}
                      />
                    ) : (
                      <Avatar
                        avatar={action?.assigneeAvatar}
                        onClickAvatar={() => {}}
                        css={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: 'none',
                        }}
                      ></Avatar>
                    )}
                    <Typography
                      style={{ marginLeft: '12px' }}
                      className="actionValue"
                    >
                      {action.value}
                    </Typography>
                  </Col>
                </Row>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}
