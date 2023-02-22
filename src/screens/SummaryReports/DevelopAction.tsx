import React from 'react';
import { Box, Typography } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import './styles.scss';
import '../../global.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Avatar from '../../elements/Avatar';
import { Word } from '../../elements/WordCloud';

const styles = {
  whatWentWellBox: {
    background: 'rgba(11, 102, 35,0.04)',
    border: '1px solid rgba(11, 102, 35,0.5)',
    borderRadius: '20px',
    height: '392px',
    width: '100% !important',
  },
  whatDidNotWellBox: {
    background: 'rgba(247, 151, 34, 0.04)',
    border: '1px solid rgba(247, 151, 34, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    height: '392px',
    width: '100% !important',
  },
  actionBox: {
    background: 'rgba(138, 56, 245, 0.04)',
    border: '1px solid rgba(138, 56, 245, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    minHeight: '392px',
    width: '100% !important',
  },
  pulseCheckBox: {
    background: 'rgba(52, 52, 52, 0.04)',
    border: '1px solid rgba(52, 52, 52, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    height: '392px',
  },
  facilitatorFeedbackBox: {
    background: 'rgba(52, 52, 52, 0.04)',
    border: '1px solid rgba(52, 52, 52, 0.5)',
    borderRadius: '20px',
    boxSizing: 'border-box',
    height: '392px',
  },
  textOpacity: {
    opacity: 0.9,
  },
};

type Props = {
  actionCardData: any;
  copyAllActions: () => void;
  handleIsActionCloudOpen: () => void;
  users: any;
  isAllActionOpen: boolean;
  actionTopVotedCards: any;
  actionLastVotedCards: any;
};

export default function DevelopAction({
  actionCardData,
  copyAllActions,
  handleIsActionCloudOpen,
  users,
  isAllActionOpen,
  actionTopVotedCards,
  actionLastVotedCards,
}: Props) {
  const windowWidth = React.useRef(window.innerWidth);

  return (
    <Box>
      {/* Actions to be Taken Section 1*/}
      <Row style={{ marginTop: '36px' }}>
        <Col xs="2" className="d-flex justify-content-start align-items-center">
          <Typography className="textTypeFour">Actions to be Taken</Typography>
        </Col>
        {actionCardData.length === 0 ? null : (
          <Col
            xs={{ span: 2, offset: 8 }}
            className="d-flex justify-content-end align-items-center"
            id="copy-to-clipboard"
          >
            <Typography className="viewParticipants" onClick={copyAllActions}>
              Copy to Clipboard
            </Typography>
          </Col>
        )}
      </Row>
      {/* Actions to be Taken Section 2*/}
      {actionCardData.length === 0 ? (
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
          <Box sx={{ marginTop: '16px' }} id="actions-column">
            {isAllActionOpen ? (
              <>
                {actionCardData.map((action: any, index: number) => {
                  return (
                    <Row
                      style={{ marginTop: index > 0 ? '16px' : '0px' }}
                      key={index}
                    >
                      <Col
                        xs="12"
                        className="d-flex justify-content-start align-items-center"
                      >
                        <LazyLoadImage
                          className="avatar"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '5px solid #f9fbf8',
                          }}
                          src={'/avatars/animals/' + action.avatar + '.svg'}
                        ></LazyLoadImage>
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
                  onClick={handleIsActionCloudOpen}
                >
                  Show Less
                </Typography>
              </>
            ) : (
              <>
                {actionTopVotedCards.map((action: any, index: number) => {
                  return (
                    <Row
                      style={{ marginTop: index > 0 ? '16px' : '0px' }}
                      key={index}
                    >
                      <Col
                        xs="12"
                        className="d-flex justify-content-start align-items-center"
                      >
                        <LazyLoadImage
                          className="avatar"
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: '5px solid #f9fbf8',
                          }}
                          src={'/avatars/animals/' + action.avatar + '.svg'}
                        ></LazyLoadImage>
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
                {actionCardData.length > 4 && (
                  <Row style={{ marginTop: '16px' }}>
                    <Col
                      xs="12"
                      className="d-flex justify-content-start align-items-center"
                    >
                      {actionLastVotedCards.map((card: any, index: number) => {
                        return (
                          <Avatar
                            key={card.id}
                            avatar={card.avatar}
                            // onClickAvatar={() => {
                            //   console.log('click');
                            // }}
                            css={{
                              width: '40px',
                              height: '40px',
                              marginLeft: '0',
                              marginRight: '-8px',
                              border: '3px solid transparent',
                            }}
                          />
                        );
                      })}
                      <Typography
                        className="viewWorldCould"
                        sx={{ marginLeft: '8px' }}
                        onClick={handleIsActionCloudOpen}
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
          <Box
            sx={{ marginTop: '16px', display: 'none' }}
            id="actions-column-print"
          >
            {actionCardData.map((action: any, index: number) => {
              return (
                <Row
                  style={{ marginTop: index > 0 ? '16px' : '0px' }}
                  key={index}
                >
                  <Col
                    xs="12"
                    className="d-flex justify-content-start align-items-center"
                  >
                    <LazyLoadImage
                      className="avatar"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '5px solid #f9fbf8',
                      }}
                      src={'/avatars/animals/' + action.avatar + '.svg'}
                    ></LazyLoadImage>
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
