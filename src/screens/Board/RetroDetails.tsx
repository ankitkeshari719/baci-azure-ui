import * as React from 'react';
import { Box, Grid, Tooltip, Typography, Link } from '@mui/material';
import commonStyles from './../../style.module.scss';

import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import QRCode from 'qrcode.react';
import { EmailShareButton } from 'react-share';
import * as Icons from 'heroicons-react';
import {
  H1SemiBoldTypography,
  H3RegularTypography,
} from '../../components/CustomizedTypography';
import { TextButton } from '../../components';

const styles = {
  link: {
    color: commonStyles.PrimaryMain,
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '125%',
    letterSpacing: '0.006em',
    marginTop: '16px',
  },
};

export function RetroDetails(props: any) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const [iscopied, setIsCopied] = React.useState(false);

  const {
    state: { retroName },
  } = React.useContext(BoardContext);

  const onLinkCopied = () => {
    navigator.clipboard.writeText(global?.currentRetro?.joinUrl!);
    setIsCopied(true);
  };

  const handleTooltipClose = () => {
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  return (
    <Grid
      container
      spacing={0}
      sx={{
        width: '640px',
        boxShadow: ' 0px 1px 10px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Grid item lg={12}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '32px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
            }}
          >
            <Icons.X
              size={20}
              style={{
                cursor: 'pointer',
              }}
              onClick={props.close}
            />
          </Box>
          {/* Name Text */}
          <H3RegularTypography
            label={retroName}
            style={{ color: '#4E4E4E', textAlign: 'center', marginTop: '12px' }}
          />
          {/* Baci URL */}
          <TextButton
            id={'participant_join'}
            label={'Participants can join at'}
            size={'medium'}
            onClick={() => null}
            style={{ marginTop: '32px' }}
          />
          <a
            href="https://baci.app/"
            rel="noreferrer"
            target="_blank"
            style={styles.link}
          >
            https://baci.app
          </a>
          {/* With Code Text */}
          <TextButton
            id={'with_code'}
            size={'medium'}
            label={'WITH CODE'}
            onClick={() => null}
            style={{ marginTop: '32px' }}
          />
          {/* Human Code */}
          <H1SemiBoldTypography
            label={global?.currentRetro?.humanId}
            style={{ color: '#2C69A1', textAlign: 'center', marginTop: '16px' }}
          />
          {/* Barcode */}
          <Box sx={{ marginTop: '64px' }}>
            <QRCode
              value={global.currentRetro?.joinUrl || ''}
              className="qrCode"
            />
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
      </Grid>
    </Grid>
  );
}
