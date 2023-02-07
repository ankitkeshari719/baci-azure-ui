import {
  DialogContent,
  Typography,
  DialogActions,
  DialogTitle,
  IconButton,
} from '@mui/material';
import * as React from 'react';
import { Button } from 'react-bootstrap';
import * as Icons from 'heroicons-react';

type Props = {
  handleViewParticipantsDialogClose: () => void;
};

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <Icons.LockClosed
            size={20}
            color="#159ADD"
            style={{
              cursor: 'pointer',
              marginLeft: '20px',
            }}
            onClick={() => {
              console.log('Here');
            }}
          />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export function ViewParticipants({ handleViewParticipantsDialogClose }: Props) {
  return (
    <>
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleViewParticipantsDialogClose}
      >
        VIEW PARTICIPANTS
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </Typography>
        <Typography gutterBottom>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </Typography>
        <Typography gutterBottom>
          Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
          ullamcorper nulla non metus auctor fringilla.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleViewParticipantsDialogClose}>
          Save changes
        </Button>
      </DialogActions>
    </>
  );
}
