import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

const LeaveRetroDialog = (props: any) => {
  const { onClose, open } = props;
  const handleClose = () => {};

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
    >
      <img
        onClick={handleClose}
        style={{
          position: 'absolute',
          right: '20px',
          top: '10px',
          cursor: 'pointer',
        }}
        src="/svgs/CloseDialog.svg"
      ></img>
      <Typography
        sx={{ fontSize: '24px', fontWeight: '500', color: '#EE7538' }}
      >
        Are you done with the retro?
      </Typography>

      <DialogContent sx={{ marginTop: '50px', marginBottom: '30px' }}>
        <Typography sx={{ fontSize: '20px' }}>
          In case of any doubts, please confirm with facilitator before leaving
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          sx={{
            padding: '10px 20px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '24px',
          }}
          onClick={() => handleClose()}
        >
          LEAVE RETRO
        </Button>
        <Button
          variant="outlined"
          sx={{
            padding: '10px 20px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '24px',
          }}
          onClick={() => handleClose()}
        >
          BACK TO BOARD
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveRetroDialog;
