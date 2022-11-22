import { Typography, Box, Button } from '@mui/material';
import React from 'react';

const SessionEndingMessage = (props: any) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        right: '140px',
        background: '#EE7538',
        borderRadius: '0px 0px 20px 20px',
        boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
        color: 'white',
        fontWeight: '400',
        fontSize: '16px',
        display: 'flex',
        flexDirection: 'column',
        width: '280px',
        padding: '18px',
        paddingTop: '10px',
        alignItems: 'end',
      }}
    >
      <Button
        variant="contained"
        sx={{
          // background: '#159ADD',
          // color: 'white',
          borderRadius: '24px',
          width: '148px',
          height: '44px',
          // padding: '10px 20px',
          // marginRight: '40px',
          fontWeight: 500,
          filter: 'blur(3px)',
        }}
      >
        LEAVE RETRO
      </Button>
      {/* </Box> */}
      <Typography
        sx={{
          fontWeight: '600',
          fontSize: '18px',
          marginBottom: '16px',
          marginTop: '24px',
        }}
      >
        The session is ending soon!
      </Typography>
      <Typography align="right">
        Consider finalising actions and hitting "LEAVE RETRO" button.
      </Typography>
      <Typography
        onClick={props.hideSessionEndingMessage}
        sx={{
          textDecorationLine: 'underline',
          marginTop: '18px',
          cursor: 'pointer',
        }}
      >
        Got It
      </Typography>
    </div>
  );
};

export default SessionEndingMessage;
