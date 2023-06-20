import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import {
  CaptionRegularTypography,
  H3RegularTypography,
} from '../CustomizedTypography';
import { ContainedButton } from '../CustomizedButton/ContainedButton';
import { OutlinedButton } from '../CustomizedButton/OutlinedButton';
import * as Icons from 'heroicons-react';

const LeaveRetroDialog = (props: any) => {
  const { onClose, open } = props;
  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        sx: {
          width: '700px',
          maxHeight: '600px',
          padding: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      }}
      sx={{ '&& .MuiDialog-paper': { overflowX: 'hidden' } }}
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
          onClick={handleClose}
        />
      </Box>
      <H3RegularTypography
        label={'Are you done with the retro?'}
        style={{ color: '#ee7538' }}
      />
      <DialogContent
        sx={{ marginTop: '30px', marginBottom: '30px', textAlign: 'center' }}
      >
        <CaptionRegularTypography
          label={
            'In case of any doubts, please confirm with facilitator before leaving'
          }
          style={{ color: '#ee7538' }}
        />
      </DialogContent>
      <DialogActions
        sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
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

export default LeaveRetroDialog;
