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
    <Dialog
      open={isPrivacyDialogOpen}
      onClose={handlePrivacyDialogClose}
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
          <Typography className="privacyDialogTitle">
            Privacy & Data Retention
          </Typography>
          <Typography
            className="privacyDialogDescription"
            style={{ marginTop: '24px' }}
          >
            You are in control of your data. Data stored are encrypted for upto
            90 days to retrieve your retro reports.
          </Typography>
          <Box style={{ marginTop: '48px' }}>
            <ContainedButton
              name="OK"
              onClick={handlePrivacyDialogClose}
              style={{
                minWidth: '225px !important',
                height: '44px !important',
                textTransform: 'uppercase !important',
                marginLeft: '50px !important',
              }}
            />
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
