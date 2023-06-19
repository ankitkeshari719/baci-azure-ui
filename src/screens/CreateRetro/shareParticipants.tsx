import * as React from 'react';
import { Box, Link, Tooltip, Typography } from '@mui/material';
import { GlobalContext } from '../../contexts/GlobalContext';
import { EmailShareButton } from 'react-share';
import * as Icons from 'heroicons-react';
import QRCode from 'qrcode.react';
import './styles.scss';
import {
  H1SemiBoldTypography,
  H3RegularTypography,
} from '../../components/CustomizedTypography';
import { TextButton } from '../../components';

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
      {/* Share with participants */}
      <Box component="div" whiteSpace="normal" className="createRetroText">
        Share with participants
      </Box>
      {/* Retro Name */}
      <Box sx={{ mt: 4 }} component="div" whiteSpace="normal">
        {/* Name Text */}
        <H3RegularTypography
          label={global.currentRetro?.name}
          style={{ color: '#4E4E4E', textAlign: 'center', marginTop: '12px' }}
        />
      </Box>
      {/* Retro URL */}
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
      {/* With code Text*/}
      <TextButton
        id={'with_code'}
        label={'WITH CODE'}
        size={'medium'}
        onClick={() => null}
        style={{ marginTop: '32px' }}
      />
      {/* Human Id */}
      <H1SemiBoldTypography
        label={global?.currentRetro?.humanId}
        style={{ color: '#2C69A1', textAlign: 'center', marginTop: '16px' }}
      />
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
            padding: '12px 16px',
            gap: '16px',
            border: '1px solid #159ADD',
            borderRadius: '24px',
            background: '#ffffff',
          }}
        >
          <Typography
            component="span"
            sx={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: ' 500',
              fontSize: '16px',
              lineHeight: '120%',
              leadingTrim: 'both',
              textEdge: 'cap',
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: '#159add',
            }}
          >
            <Icons.Mail
              size={20}
              style={{
                marginRight: '8px',
                color: '#159add',
              }}
            />
            invite via email
          </Typography>
        </EmailShareButton>
      </Box>
    </Box>
  );
}
