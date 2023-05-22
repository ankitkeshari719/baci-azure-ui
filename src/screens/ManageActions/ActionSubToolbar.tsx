import { Box, Button, Menu, MenuItem } from '@mui/material';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ButtonWithIcon, TextButton } from '../../components';
import { BoardContext } from '../../contexts/BoardContext';
import { User } from '../../types';
import { UserCircle } from 'heroicons-react';

import './styles.scss';
const ActionSubToolbar = ({
  selectedActionCount,
  global,
}: {
  selectedActionCount: number;
  global: any;
}) => {
  const {
    state: { actionsData, ended, users },
    commitAction,
  } = React.useContext(BoardContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="actionSubToolbarContainer">
      {/* <Box display="flex" justifyContent="space-between"> */}
      {selectedActionCount}{' '}
      {selectedActionCount == 1 ? 'Action selected' : 'Actions selected'}
      <Box
        display="flex"
        sx={{ width: '220px', justifyContent: 'space-between' }}
      >
        <ButtonWithIcon
          disabled={selectedActionCount == 0 ? true : false}
          aria-controls={open ? 'basic-menu' : undefined}
          id="assign-button"
          label="ASSIGN"
          iconPath="/svgs/VectorAssign.svg"
          onClick={res => {
            handleClick(res);
          }}
        />

        <ButtonWithIcon
          disabled={false}
          id="remove"
          onClick={res => {}}
          label="REMOVE"
          iconPath="/svgs/Delete.svg"
        />
      </Box>
      <TextButton label="UNSELECT" id="unselect" onClick={res => {}} />
      <Menu
        MenuListProps={{
          'aria-labelledby': 'assign-button',
        }}
        id="basic-menu"
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
      >
        <MenuItem className="menu-item">
          <LazyLoadImage
            width="40px !important"
            height="40px !important"
            style={{
              borderRadius: '50%',
            }}
            src={'/svgs/DefaultUser.svg'}
          ></LazyLoadImage>
          <Box
            component="span"
            sx={{
              marginLeft: '8px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
            }}
          >
            Un-assign
          </Box>
        </MenuItem>

        <MenuItem className="menu-item">
          <LazyLoadImage
            width="40px !important"
            height="40px !important"
            style={{
              borderRadius: '50%',
            }}
            src={'/avatars/animals/' + global.user.avatar + '.svg'}
          ></LazyLoadImage>
          <Box
            component="span"
            sx={{
              marginLeft: '8px',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
            }}
          >
            You
          </Box>
        </MenuItem>
        {users.map(
          (user: any, index: number) =>
            global.user.id != user.userId && (
              <MenuItem className="menu-item" key={'basic-menu' + index}>
                <LazyLoadImage
                  width="40px !important"
                  height="40px !important"
                  style={{
                    borderRadius: '50%',
                  }}
                  src={'/avatars/animals/' + user.avatar + '.svg'}
                ></LazyLoadImage>
                <Box
                  component="span"
                  sx={{
                    marginLeft: '8px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                  }}
                >
                  {user.userNickname}
                </Box>
              </MenuItem>
            )
        )}
      </Menu>
    </Box>
  );
};

export default ActionSubToolbar;
