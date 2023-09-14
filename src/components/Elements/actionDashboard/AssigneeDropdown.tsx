import * as React from 'react';
import { users } from '../../../constants/DemoConst';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import Avatar from '../Avatar';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function AssigneeDropdown({ id,outAssigneeSelected }: { id: string,outAssigneeSelected:(value:any)=>void }) {
  const [assigneeId, setAssigneeId] = React.useState<string>(id);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);



  const returnUser = (id: string) => {
    const user = users.find(user => user.id == id);
    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        <Avatar
          avatar={user?.avatar}
          css={{
            width: '32px',
            height: '32px',
            border: 'none',
            marginRight: '5px',
          }}
        />
        {user?.name}
      </Box>
    );
  };
  React.useEffect(() => {
    setAssigneeId(id);
  }, [id]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box display="flex" flexDirection="row">
      <Box width="130px">
        {returnUser(assigneeId)}</Box>

      <Button
        aria-controls={open ? 'basic-menu' : undefined}
        id="basic-button"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <ChevronDownIcon fontSize="24px" width="16px" color="gray" />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        style={{ maxHeight: '300px' }}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {users.map(
          user =>
            user.id !== assigneeId && (
              <MenuItem
                key={user.id}
                value={user.id}
                onClick={() => {
                  handleClose();
                  outAssigneeSelected(user)
                  setAssigneeId(user.id);
                }}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  <Avatar
                    avatar={user?.avatar}
                    css={{
                      width: '32px',
                      height: '32px',
                      border: 'none',
                      marginRight: '5px',
                    }}
                  />
                  {user?.name}
                </Box>
              </MenuItem>
            )
        )}
      </Menu>
    </Box>
  );
}
