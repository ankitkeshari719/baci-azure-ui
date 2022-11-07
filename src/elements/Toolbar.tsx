import { Box } from '@mui/material';
import React from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import Avatar from './Avatar';
import BACILogo from '../assets/img/bacilogo.png';
const Toolbar = () => {
  const [{ avatar }] = React.useContext(GlobalContext);
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px',
        paddingLeft: '56px',
        paddingRight: '56px',
        flexDirection: 'row',
        width: '100%',
      }}
    >
      <img
        src={BACILogo}
        alt="Logo"
        style={{
          width: '82px',
          height: '28px',
        }}
      />
      <Box component="span" sx={{ flex: '1 1 auto' }}></Box>
      <Avatar
        avatar={avatar}
        css={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
        }}
      ></Avatar>
    </Box>
  );
};

export default Toolbar;
