import './styles.scss';

import { ActionInterface } from '../../types';
import { ListItemIcon, ListItemText } from '@material-ui/core';
import {
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';
import Avatar from '../../elements/Avatar';

type Props = {
  action: ActionInterface;
};

export default function ActionItem({ action }: Props) {
  const labelId = `action-label-${action.id}`;

  const handleToggle = () => {};

  return (
    <ListItem key={labelId}>
      <ListItemButton role={undefined} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            // checked={action.checked}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </ListItemIcon>
        <ListItemText id={labelId} primary={action.value} />
      </ListItemButton>
      <ListItemAvatar>
        <Avatar
          avatar={action?.avatar}
          onClickAvatar={() => {}}
          css={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
          }}
        ></Avatar>
      </ListItemAvatar>
    </ListItem>
  );
}
