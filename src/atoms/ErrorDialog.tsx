import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

const styles = {
  textOne: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '22px',
    letterSpacing: '0.2px',
    display: 'flex',
    alignItems: 'center',
  },
  textTwo: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
    color: '#343434',
    display: 'flex',
    alignItems: 'center',
  },
  reloadButton: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '22px',
    letterSpacing: '0.2px',
    color: '#343434',
    display: 'flex',
    alignItems: 'center',
    textDecorationLine: 'underline',
    cursor: 'pointer',
  },
};

export default function ErrorDialog(props?: any) {
  React.useEffect(() => {
    console.log('error', props.error);
  }, []);

  return (
    <>
      {props.error == 'error : Socket disconnected' ? (
        <>
          <Dialog
            open={true}
            sx={{
              '& .MuiDialog-container': {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
              },
            }}
            PaperProps={{
              sx: {
                minWidth: window.innerWidth / 2,
                minHeight: '64px',
                background: '#FBBC05 !important',
                borderRadius: '10px',
                border: '1px solid #EDC707',
                m: 0,
                top: 78,
                left: 0,
                padding: '8px 12px',
              },
            }}
          >
            <DialogContent>
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Col
                  xs="1"
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                  }}
                >
                  <Box>
                    <img
                      src="/images/Vector.png"
                      alt="Logo"
                      style={{ width: '21px', height: '21px' }}
                    />
                  </Box>
                </Col>
                <Col
                  xs="8"
                  style={{
                    display: 'flex',
                    justifyContent: 'start',
                  }}
                >
                  <Box>
                    <Typography style={styles.textOne}>
                      System encountered a problem
                    </Typography>
                    <Typography style={styles.textTwo}>
                      Error in connection establishment.
                    </Typography>
                  </Box>
                </Col>
                <Col
                  xs="3"
                  style={{
                    display: 'flex',
                    justifyContent: 'end',
                  }}
                >
                  <Box>
                    <Typography
                      style={styles.reloadButton}
                      onClick={() => location.reload()}
                    >
                      Reload Page
                    </Typography>
                  </Box>
                </Col>
              </Row>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Dialog
          open={true}
          sx={{
            '& .MuiDialog-container': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
            },
          }}
          PaperProps={{
            sx: {
              minWidth: window.innerWidth / 2,
              minHeight: '64px',
              background: '#FBBC05 !important',
              borderRadius: '10px',
              border: '1px solid #EDC707',
              m: 0,
              top: 78,
              left: 0,
              padding: '8px 12px',
            },
          }}
        >
          <DialogContent>
            <Row
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Col
                xs="1"
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <Box>
                  <img
                    src="/images/Vector.png"
                    alt="Logo"
                    style={{ width: '21px', height: '21px' }}
                  />
                </Box>
              </Col>
              <Col
                xs="8"
                style={{
                  display: 'flex',
                  justifyContent: 'start',
                }}
              >
                <Box>
                  <Typography style={styles.textOne}>
                    There has been an error
                  </Typography>
                  <Typography style={styles.textTwo}>
                    Please try again later
                  </Typography>
                </Box>
              </Col>
              <Col
                xs="3"
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                }}
              >
                <Box>
                  <Typography
                    style={styles.reloadButton}
                    onClick={() => location.reload()}
                  >
                    Reload Page
                  </Typography>
                </Box>
              </Col>
            </Row>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
