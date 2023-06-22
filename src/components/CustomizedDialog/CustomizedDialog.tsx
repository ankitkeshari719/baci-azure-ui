import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
} from '@mui/material';
import * as Icons from 'heroicons-react';

import { ContainedButton } from '../CustomizedButton/ContainedButton';
import { OutlinedButton } from '../CustomizedButton/OutlinedButton';
import {
  CaptionRegularTypography,
  H5SemiBoldTypography,
} from '../CustomizedTypography';

type Props = {
  type: string;
  title: string;
  subTitle?: string;
  iconPath?: string;
  open: boolean;
  onClose: (...param: any) => void;
};

const CustomizedDialog = ({
  type,
  title,
  subTitle,
  iconPath,
  open,
  onClose,
}: Props) => {
  const handleClose = () => {
    onClose(false);
  };

  let icon: any;

  switch (type) {
    case 'error':
      icon = (
        <Icons.ExclamationCircleOutline
          size={24}
          style={{
            color: '#EA4335',
          }}
        />
      );
      break;
    case 'alert':
      icon = (
        <Icons.ShieldExclamationOutline
          size={24}
          style={{
            color: '#FBBC05',
          }}
        />
      );
      break;
    case 'info':
      icon = (
        <Icons.InformationCircleOutline
          size={24}
          style={{
            color: '#4285F4',
          }}
        />
      );
      break;
    case 'success':
      icon = (
        <Icons.CheckCircleOutline
          size={24}
          style={{
            color: '#34A853',
          }}
        />
      );
      break;

    default:
      break;
  }

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          width: '410px',
          maxHeight: '600px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      }}
      sx={{ '&& .MuiDialog-paper': { overflowX: 'hidden' } }}
    >
      <DialogContent sx={{ padding: '0px !important' }}>
        <Grid container>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {/* Icon */}
            <Grid
              item
              xs={1}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              {icon}
            </Grid>
            {/* Title */}
            <Grid
              item
              xs={10}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
              p-0
            >
              <H5SemiBoldTypography
                label={title}
                style={{ color: '#343434' }}
              />
            </Grid>
            {/* Close Icon */}
            <Grid
              item
              xs={1}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
              p-0
            >
              <Icons.X
                size={20}
                style={{
                  cursor: 'pointer',
                  color: '#4E4E4E',
                }}
                onClick={handleClose}
              />
            </Grid>
          </Box>
          {/* Divider */}
          <Grid item xs={12} sx={{ marginTop: '24px' }}>
            <Divider
              sx={{ width: '100%', border: '1px solid #ee7538 !important' }}
            />
          </Grid>
          {/* Sub Title */}
          <Grid item xs={12} p-0 sx={{ marginTop: '24px' }}>
            <CaptionRegularTypography
              label={subTitle}
              style={{ color: '#343434' }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'end',
          marginTop: '48px',
          padding: '0px !important',
        }}
      >
        <ContainedButton
          id="LEAVE_RETRO"
          name="LEAVE RETRO"
          onClick={() => onClose(true)}
          size={'medium'}
        />
        <OutlinedButton
          id="BACK_TO_BOARD"
          label="BACK TO BOARD"
          size={'medium'}
          onClick={() => handleClose()}
          style={{
            minWidth: '172px !important',
            width: '172px !important',
            height: '40px !important',
          }}
        />
      </DialogActions>
    </Dialog>
  );
};

export default CustomizedDialog;
