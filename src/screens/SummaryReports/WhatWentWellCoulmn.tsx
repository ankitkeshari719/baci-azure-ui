import React from 'react';
import * as Icons from 'heroicons-react';
import { Box, Grid, Typography } from '@mui/material';
import { Row, Col } from 'react-bootstrap';
import './styles.scss';
import '../../global.scss';
import WordCloud from '../../elements/WordCloud';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Word } from '../../elements/WordCloud';

const styles = {
  whatWentWellBox: {
    background: 'rgba(11, 102, 35,0.04)',
    border: '1px solid rgba(11, 102, 35,0.5)',
    borderRadius: '20px',
    height: '392px',
    width: '100% !important',
  },
};

type Props = {
  wentWellColumnName: string;
  wentWellCreatedBy: number | undefined;
  users: any;
  wentWellWords: Word[];
  handleIsWellCloudOpen: () => void;
  isWellCloudOpen: boolean;
  wentWellTopVotedCards: any;
  wentWellTopVotedCardsPrint_1: any;
  wentWellTopVotedCardsPrint_2: any;
};

export default function WhatWentWell({
  wentWellColumnName,
  wentWellCreatedBy,
  users,
  wentWellWords,
  handleIsWellCloudOpen,
  isWellCloudOpen,
  wentWellTopVotedCards,
  wentWellTopVotedCardsPrint_1,
  wentWellTopVotedCardsPrint_2,
}: Props) {
  const windowWidth = React.useRef(window.innerWidth);

  const getCardWidth = () => {
    switch (true) {
      case windowWidth.current >= 1200 && windowWidth.current <= 1500:
        return '400px !important';
      case windowWidth.current >= 1501 && windowWidth.current <= 1549:
        return '340px !important';
      case windowWidth.current >= 1550 && windowWidth.current <= 1579:
        return '350px !important';
      case windowWidth.current >= 1580 && windowWidth.current <= 1619:
        return '360px !important';
      case windowWidth.current >= 1620 && windowWidth.current <= 1719:
        return '365px !important';
      case windowWidth.current >= 1720 && windowWidth.current <= 1820:
        return '380px !important';
      default:
        return '400px !important';
    }
  };

  return (
    <Box>
      {/* What Went Well Section 1*/}
      <Row style={{ marginTop: '36px' }}>
        <Col
          xs="12"
          className="d-flex justify-content-start align-items-center"
        >
          <Typography className="textTypeFour">{wentWellColumnName}</Typography>
        </Col>
      </Row>
      {/* What Went Well Section 2*/}
      <Row style={{ marginTop: '16px' }} id="view-top-voted-card-1">
        <Col
          xs="4"
          lg="4"
          className="d-flex justify-content-start align-items-center"
        >
          <Typography className="participantsResponded">
            Participants Responded
          </Typography>
          <Typography className="participantsResponded" ml={2}>
            {wentWellCreatedBy}/{users.length}
          </Typography>
        </Col>
        {wentWellWords.length === 0 ? (
          <Col
            xs={{ span: 3, offset: 5 }}
            lg={{ span: 4, offset: 4 }}
            className="d-flex justify-content-end align-items-center"
          >
            <Icons.ExclamationCircleOutline
              size={22}
              color="#808080"
              style={{ marginRight: '8px' }}
            ></Icons.ExclamationCircleOutline>
            <Typography className="notEnoughData">
              Not Enough Data to Display Word Cloud
            </Typography>
          </Col>
        ) : (
          <Col
            xs={{ span: 3, offset: 5 }}
            lg={{ span: 2, offset: 6 }}
            className="d-flex justify-content-end align-items-center"
          >
            <Typography
              className="viewWorldCould"
              onClick={handleIsWellCloudOpen}
            >
              {isWellCloudOpen ? 'View Top Voted Cards' : 'View Word Cloud'}
            </Typography>
          </Col>
        )}
      </Row>
      {/* What Went Well Section 2 print*/}
      <Row
        style={{ marginTop: '16px', display: 'none' }}
        id="view-top-voted-card-print-1"
      >
        <Col
          xs="12"
          className="d-flex justify-content-start align-items-center"
        >
          <Typography className="participantsResponded">
            Participants Responded
          </Typography>
          <Typography className="participantsResponded" ml={2}>
            {wentWellCreatedBy}/{users.length}
          </Typography>
        </Col>
      </Row>
      {/* What Went Well Section 3*/}
      {wentWellTopVotedCards.length === 0 ? (
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
        <Row style={{ marginTop: '16px' }}>
          <Col
            xs="12"
            className="d-flex justify-content-start align-items-center"
          >
            {isWellCloudOpen ? (
              <Box sx={styles.whatWentWellBox}>
                {wentWellWords.length !== 0 ? (
                  <Grid
                    item
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="272px"
                  >
                    <WordCloud
                      data={wentWellWords}
                      showOn="whatWentWell"
                    ></WordCloud>
                  </Grid>
                ) : null}
              </Box>
            ) : (
              // Top Voted Label
              <Box sx={{ width: '100%' }}>
                <Row>
                  <Col xs="12">
                    <Typography className="topVoted">Top Voted</Typography>
                  </Col>
                </Row>
                {/* went-well-top-voted-cards */}
                <Row
                  style={{ marginTop: '16px' }}
                  id="went-well-top-voted-cards"
                >
                  {wentWellTopVotedCards.map((card: any, index: number) => {
                    return (
                      <Col
                        xs={windowWidth.current <= 1500 ? '4' : '3'}
                        className="d-flex justify-content-center align-items-center"
                        key={index}
                      >
                        <Box
                          sx={{
                            minWidth: getCardWidth,
                            minHeight: '140px',
                            background: '#FFFFFF',
                            opacity: '0.7',
                            boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
                            borderRadius: '8px',
                            padding: '8px',
                          }}
                        >
                          <Row>
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
                                src={'/avatars/animals/' + card.avatar + '.svg'}
                              ></LazyLoadImage>
                              <Typography>{card.value}</Typography>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              xs="12"
                              className="d-flex justify-content-start align-items-center"
                            >
                              <Icons.Star size={20} color="#CCCCCC" />
                              <Typography sx={{ marginLeft: '8px' }}>
                                {card.reacts.length}
                              </Typography>
                            </Col>
                          </Row>
                        </Box>
                      </Col>
                    );
                  })}
                </Row>
                {/* "went-well-top-voted-cards-react-print */}
                <Box
                  id="went-well-top-voted-cards-react-print"
                  sx={{ display: 'none' }}
                >
                  <Row style={{ marginTop: '16px' }}>
                    {wentWellTopVotedCardsPrint_1.map(
                      (card: any, index: number) => {
                        return (
                          <Col
                            xs="6"
                            className="d-flex justify-content-start align-items-center"
                            key={index}
                          >
                            <Box
                              sx={{
                                minWidth: getCardWidth,
                                minHeight: '140px',
                                background: '#FFFFFF',
                                opacity: '0.7',
                                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
                                borderRadius: '8px',
                                padding: '8px',
                              }}
                            >
                              <Row>
                                <Col
                                  xs="12"
                                  className="d-flex justify-content-start align-items-center"
                                >
                                  <img
                                    className="avatar"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      border: '5px solid #f9fbf8',
                                    }}
                                    src={
                                      '/avatars/animals/' + card.avatar + '.svg'
                                    }
                                  />
                                  <Typography>{card.value}</Typography>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  xs="12"
                                  className="d-flex justify-content-start align-items-center"
                                >
                                  <Icons.Star size={20} color="#CCCCCC" />
                                  <Typography sx={{ marginLeft: '8px' }}>
                                    {card.reacts.length}
                                  </Typography>
                                </Col>
                              </Row>
                            </Box>
                          </Col>
                        );
                      }
                    )}
                  </Row>
                  <Row style={{ marginTop: '16px' }}>
                    {wentWellTopVotedCardsPrint_2.map(
                      (card: any, index: number) => {
                        return (
                          <Col
                            xs="6"
                            className="d-flex justify-content-start align-items-center"
                            key={index}
                          >
                            <Box
                              sx={{
                                minWidth: getCardWidth,
                                minHeight: '140px',
                                background: '#FFFFFF',
                                opacity: '0.7',
                                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.15)',
                                borderRadius: '8px',
                                padding: '8px',
                              }}
                            >
                              <Row>
                                <Col
                                  xs="12"
                                  className="d-flex justify-content-start align-items-center"
                                >
                                  <img
                                    className="avatar"
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      border: '5px solid #f9fbf8',
                                    }}
                                    src={
                                      '/avatars/animals/' + card.avatar + '.svg'
                                    }
                                  />
                                  <Typography>{card.value}</Typography>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  xs="12"
                                  className="d-flex justify-content-start align-items-center"
                                >
                                  <Icons.Star size={20} color="#CCCCCC" />
                                  <Typography sx={{ marginLeft: '8px' }}>
                                    {card.reacts.length}
                                  </Typography>
                                </Col>
                              </Row>
                            </Box>
                          </Col>
                        );
                      }
                    )}
                  </Row>
                </Box>
              </Box>
            )}
          </Col>
        </Row>
      )}
    </Box>
  );
}
