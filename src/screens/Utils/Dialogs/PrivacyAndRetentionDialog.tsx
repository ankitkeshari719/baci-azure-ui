import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import * as React from 'react';
import '../../../global.scss';
import './styles.scss';

import { ContainedButton } from '../../../components';
import {
  BodyRegularTypography,
  H3RegularTypography,
} from '../../../components/CustomizedTypography';

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export function PrivacyAndRetentionDialog() {
  const [isMobile, setIsMobile] = React.useState<boolean>(
    window.innerWidth < 700
  );
  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = React.useState(false);

  // Privacy Dialog Close Handling
  React.useEffect(() => {
    const privacyDialogOpen_1 = sessionStorage.getItem('isPrivacyDialogOpen');
    const retroNameForPrivacyDialog_1 = sessionStorage.getItem(
      'retroNameForPrivacyDialog'
    );
    const privacyDialogOpen_2 =
      privacyDialogOpen_1 && JSON.parse(privacyDialogOpen_1);
    const retroNameForPrivacyDialog_2 =
      retroNameForPrivacyDialog_1 && JSON.parse(retroNameForPrivacyDialog_1);
    if (
      retroNameForPrivacyDialog_2 === undefined ||
      retroNameForPrivacyDialog_2 === null
    ) {
      setIsPrivacyDialogOpen(true);
      sessionStorage.setItem('isPrivacyDialogOpen', JSON.stringify(true));
    } else {
      if (privacyDialogOpen_2) {
        setIsPrivacyDialogOpen(true);
      } else {
        setIsPrivacyDialogOpen(false);
      }
    }
  }, []);

  // Function to handle the Privacy Dialog Close
  const handlePrivacyDialogClose = () => {
    sessionStorage.setItem('isPrivacyDialogOpen', JSON.stringify(false));
    sessionStorage.setItem('retroNameForPrivacyDialog', JSON.stringify(''));
    setIsPrivacyDialogOpen(false);
  };

  return (
    <>
      {isMobile ? (
        <Dialog
          open={isPrivacyDialogOpen}
          aria-labelledby="Privacy-and-Data-Retention-dialog"
          sx={{
            '& .MuiDialog-container': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
          PaperProps={{
            sx: {
              background: '#FFFFFF !important',
              borderRadius: '20px',
              boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
              padding: '8px 12px',
              margin: '0px',
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DialogContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
            >
              <H3RegularTypography
                label="Privacy & Data Retention"
                style={{ color: '#EE7538' }}
              />
              <BodyRegularTypography
                label="You are in control of your data. Data stored are encrypted for
                upto 90 days to retrieve your retro reports."
                style={{ color: '#4E4E4E', marginTop: '24px' }}
              />
              <Box style={{ marginTop: '48px' }}>
                <ContainedButton
                  name="OK"
                  size={'medium'}
                  onClick={handlePrivacyDialogClose}
                  style={{ minWidth: '150px', minHeight: '40px' }}
                />
              </Box>
            </DialogContent>
          </Box>
        </Dialog>
      ) : (
        <Dialog
          open={isPrivacyDialogOpen}
          aria-labelledby="Privacy-and-Data-Retention-dialog"
          sx={{
            '& .MuiDialog-container': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            },
          }}
          PaperProps={{
            sx: {
              background: '#FFFFFF !important',
              borderRadius: '20px',
              boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
              padding: '8px 12px',
            },
          }}
        >
          <Box
            sx={{
              width: '512px',
              height: '278px',
              minWidth: '512px',
              minHeight: '278px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DialogContent
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
            >
              <H3RegularTypography
                label="Privacy & Data Retention"
                style={{ color: '#EE7538' }}
              />
              <BodyRegularTypography
                label="You are in control of your data. Data stored are encrypted for
                upto 90 days to retrieve your retro reports."
                style={{ color: '#4E4E4E', marginTop: '24px' }}
              />
              <Box style={{ marginTop: '48px' }}>
                <ContainedButton
                  name="OK"
                  onClick={handlePrivacyDialogClose}
                  size={'medium'}
                  style={{ minWidth: '150px', minHeight: '40px' }}
                />
              </Box>
            </DialogContent>
          </Box>
        </Dialog>
      )}
    </>
  );
}
