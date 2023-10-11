import * as React from 'react';
import {
  Paper,
  Box,
  FormControl,
  FormHelperText,
  TextField,
} from '@mui/material';

import { ContainedButton } from '../../../components';

import {
  BodyRegularTypography,
  BodySemiBoldTypography,
  H2SemiBoldTypography,
  H3SemiBoldTypography,
  TinyTextTypography,
} from '../../CustomizedTypography';
import commonStyles from '../../../style.module.scss';

const styles = {
  accessCodeTextField: {
    '& .MuiFilledInput-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
      borderRadius: '0px !important',
    },
  },
  messageTextField: {
    '& .MuiOutlinedInput-root': {
      color: 'rgba(0, 0, 0, 0.6)',
      fontSize: '14px',
      borderRadius: '0px !important',
      height: '300px',
    },
  },
};

export default function Help() {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [codeEmailError, setEmailCodeError] = React.useState('');
  const [codeMessageError, setMessageCodeError] = React.useState('');

  const submitHelp = () => {
    if (email === '') {
      setEmailCodeError('Please enter email');
    } else {
      setEmailCodeError('');
    }

    if (message === '') {
      setMessageCodeError('Please enter message');
    } else {
      setMessageCodeError('');
    }

    if (email === '' || message === '') {
      return;
    }

    if (email != '' || message != '') {
      // Call API
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          background: '#F9FBFC',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <BodySemiBoldTypography label="Help" style={{ marginBottom: '10px' }} />
        <H2SemiBoldTypography
          label="Help"
          style={{ color: commonStyles.PrimaryDark }}
        />
        <Paper
          sx={{
            width: '100%',
            height: '100%',
            background: 'rgb(249 251 252)',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            overflowY: 'auto',
            marginTop: '24px',
          }}
        >
          <H3SemiBoldTypography label="Ask BACI" style={{ color: '#159ADD' }} />
          <Box display="flex" flexDirection="row" sx={{ marginTop: '24px' }}>
            <BodyRegularTypography
              label="Feel Free to drop us a mail on "
              style={{ color: '#4E4E4E' }}
            />

            <BodyRegularTypography
              label="&nbsp;help@baciapp.com"
              style={{ color: '#159ADD', cursor: 'pointer' }}
            />
          </Box>
          {/* <Box
            sx={{
              height: '100%',
              width: '100%',
            }}
          > */}

          {/* <BodyRegularTypography
              label="Got a question about BACI? We’re here to help."
              style={{ color: '#4E4E4E', marginTop: '16px' }}
            /> */}
          {/* Email */}
          {/* <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '46px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="Email"
                  autoFocus
                  variant="outlined"
                  error={!!codeEmailError}
                  sx={{
                    width: '100%',
                    ...styles.accessCodeTextField,
                  }}
                  value={email}
                 onChange={(e : any) => {
                    setEmail(e.currentTarget.value);
                    setEmailCodeError('');
                  }}
                />
              </Box>
              {codeEmailError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeEmailError}
                </FormHelperText>
              )}
            </FormControl> */}
          {/* Message */}
          {/* <FormControl
              style={{
                display: 'flex',
                width: '600px',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: '16px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <TextField
                  label="Message"
                  maxRows={8}
                  autoFocus
                  variant="outlined"
                  error={!!codeMessageError}
                  sx={{
                    width: '100%',
                    ...styles.messageTextField,
                  }}
                  value={message}
                 onChange={(e : any) => {
                    setMessage(e.currentTarget.value);
                    setMessageCodeError('');
                  }}
                />
              </Box>
              {codeMessageError !== '' && (
                <FormHelperText style={{ color: '#d32f2f', marginLeft: '5px' }}>
                  {codeMessageError}
                </FormHelperText>
              )}
            </FormControl> */}
          {/* <ContainedButton
              id={'submit_help'}
              name={'Send Message'}
              onClick={() => submitHelp()}
              style={{
                marginTop: '24px',
                padding: '10px 18px',
                gap: '8px',
              }}
              size={'medium'}
            />
            <BodyRegularTypography
              label="Or"
              style={{ color: '#4E4E4E', marginTop: '24px' }}
            /> */}

          {/* </Box> */}
        </Paper>
      </Box>
    </>
  );
}
