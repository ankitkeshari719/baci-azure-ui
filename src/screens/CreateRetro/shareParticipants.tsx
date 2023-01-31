import * as React from 'react';
import { Box, Link, Tooltip, Typography } from '@mui/material';
import { GlobalContext } from '../../contexts/GlobalContext';
import { EmailShareButton } from 'react-share';
import * as Icons from 'heroicons-react';
import QRCode from 'qrcode.react';
import './styles.scss';

export function ShareParticipants() {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [iscopied, setIsCopied] = React.useState(false);

  const handleTooltipClose = () => {
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const onLinkCopied = () => {
    navigator.clipboard.writeText(global?.currentRetro?.joinUrl!);
    setIsCopied(true);
  };

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
        <a
          href={global.currentRetro?.joinUrl.substring(
            0,
            global.currentRetro?.joinUrl.indexOf('j')
          )}
          rel="noreferrer"
          target="_blank"
          style={{ color: '#159ADD' }}
        >
          {global.currentRetro?.joinUrl.substring(
            0,
            global.currentRetro?.joinUrl.indexOf('j')
          )}
        </a>
      </Box>
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="withCode"
      >
        with code
      </Box>
      {/* Human Id */}
      <Box
        sx={{ mt: 4 }}
        component="div"
        whiteSpace="normal"
        className="codeId"
      >
        {global?.currentRetro?.humanId}
      </Box>
      {/* Barcode */}
      <Box sx={{ mt: 4 }}>
        <QRCode value={global.currentRetro?.joinUrl || ''} className="qrCode" />
      </Box>
      {/* Join URL */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        component="div"
        whiteSpace="normal"
        className="productUrl"
      >
        <Link href={global.currentRetro?.joinUrl + ''} color="#676767;">
          {global?.currentRetro?.joinUrl}{' '}
        </Link>
        <Tooltip
          onClose={handleTooltipClose}
          open={iscopied}
          style={{ width: '20px', fontSize: '10px' }}
          enterNextDelay={1500}
          placement="top"
          title="Link Copied!"
        >
          <Icons.DocumentDuplicateOutline
            size={20}
            style={{
              marginLeft: '8px',
              cursor: 'pointer',
            }}
            onClick={onLinkCopied}
          />
        </Tooltip>
      </Box>
      {/* Email Sharing */}
      <Box sx={{ mt: 4 }}>
        <EmailShareButton
          url={global.currentRetro?.joinUrl + ''}
          style={{
            width: '200px',
            height: '36px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: '1px solid #159ADD',
            filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))',
            borderRadius: '24px',
            background: '#ffffff',
          }}
        >
          <Typography component="span" className="inviteText">
            <Icons.Mail
              size={20}
              style={{
                marginRight: '8px',
              }}
            />
            invite via email
          </Typography>
        </EmailShareButton>
      </Box>
    </Box>
  );
}
