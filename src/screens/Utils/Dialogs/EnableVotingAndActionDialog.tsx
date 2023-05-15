import * as React from 'react';
import '../../../global.scss';
import './styles.scss';
import * as Icons from 'heroicons-react';
import {
  Dialog,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';

type Props = {
  isEnableDialogOpen: boolean;
  handleOpenEnableDialog: () => void;
};

export function EnableVotingAndActionDialog({
  isEnableDialogOpen,
  handleOpenEnableDialog,
}: Props) {
  return (
    <Dialog
      open={isEnableDialogOpen}
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
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton key="enable_voting">
            <ListItemAvatar>
              <Icons.StarOutline size={24} color="#676767" />
            </ListItemAvatar>
            <ListItemText primary="Enable Voting" />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton key="enable_action">
            <ListItemAvatar>
              <Icons.UsersOutline size={24} color="#676767" />
            </ListItemAvatar>
            <ListItemText primary="Participants Can Add Actions" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}
