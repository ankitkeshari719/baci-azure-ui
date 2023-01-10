import * as React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { GlobalContext } from '../../contexts/GlobalContext';
import { EmailShareButton } from 'react-share';
import * as Icons from 'heroicons-react';

export function ShareParticipants() {
  const [global, dispatch] = React.useContext(GlobalContext);
  
  return (
    <Box className="participantContainer">
      <Box component="div" whiteSpace="normal" className="createRetroText">
        Share with participants
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="firstDesignSprint"
      >
        First Design Sprint
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="joinUrl"
      >
        https://baciapp.com
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="withCode"
      >
        with code
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="codeId"
      >
        {global?.currentRetro?.humanId}
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="img"
        alt="Logo"
        src="/images/barcode.png"
      />
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="productUrl"
      >
        <Link href="global?.currentRetro?.joinUrl" color="#676767;">
          {global?.currentRetro?.joinUrl}
        </Link>
      </Box>
      <Box sx={{ mt: 4 }}>
        <EmailShareButton
          url={global.currentRetro?.joinUrl + ''}
          style={{
            background: '#ffffff',
            color: '#159ADD',
            fontSize: '16px',
            fontWeight: '500',
            borderRadius: '24px',
            letterSpacing: '0.4',
            border: '1px solid rgba(21, 154, 221, 0.5)',
            height: '36px',
            paddingLeft: '15px',
            paddingRight: '15px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Typography component="span" className="inviteText">
            <Icons.Link size={20} style={{ marginRight: '8px' }} /> invite via
            email
          </Typography>
        </EmailShareButton>
      </Box>
    </Box>
  );
}
