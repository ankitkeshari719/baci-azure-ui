import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function ConfirmDialog({
  title,
  text,
  action,
  show,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  action: string;
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={show}
      keepMounted
      onClose={onCancel}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} onTouchStart={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm} onTouchStart={onConfirm}>
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
