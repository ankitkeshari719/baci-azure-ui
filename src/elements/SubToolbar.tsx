import { Box } from '@material-ui/core';
import {
  Autocomplete,
  Button,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import { BoardContext } from '../contexts/BoardContext';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Avatar from './Avatar';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { CountdownTimer } from './CountdownTimer';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SubToolbar = () => {
  const {
    state: { columns, users, retroName, lastStateUpdate },
  } = React.useContext(BoardContext);

  const [userSelected, setUserSelected] = React.useState<string[]>([]);
  const [userNameIdArray, setUserNameIdArray] = React.useState<any[]>([]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: SelectChangeEvent<typeof userSelected>) => {
    const {
      target: { value },
    } = event;

    setUserSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  useEffect(() => {
    console.log(userSelected, 'userSelected');
    if (userSelected.length === 0) {
      setUserNameIdArray([]);
    } else {
      const selectedUsers: any = [];
      userSelected.forEach(id => {
        const index = id.split('@');

        selectedUsers.push(users[+index[1]]);
      });
      setUserNameIdArray(value => selectedUsers);
    }
  }, [userSelected]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '60px',
      }}
    >
      <Typography
        sx={{
          color: '#808080',
          fontSize: '28px',
          fontWeight: '400',
          flexDirection: 'row',
          display: 'flex',
          marginRight: '10px',
        }}
      >
        <Typography>{users?.length}</Typography>
        <Typography
          sx={{ fontSize: '14px', fontWeight: '500', marginLeft: '4px' }}
        >
          PARTICIPANTS
        </Typography>
      </Typography>

      <Select
        sx={{
          fieldset: {
            border: 'none',
            div: { padding: 0, position: 'initial' },
          },
          padding: '0px!important',
          minWidth: '300px',
        }}
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={userSelected}
        onChange={handleChange}
        input={<OutlinedInput inputProps={{ padding: 0 }} label="Tag" />}
        renderValue={(selected: any) => {
          return (
            <>
              {userNameIdArray.length > 0 &&
                userNameIdArray.map(user => (
                  <Avatar
                    key={user.avatar}
                    avatar={user.avatar}
                    css={{
                      width: '40px',
                      marginLeft: '0',
                      marginRight: '-8px',
                      border: 'none',
                    }}
                  />
                ))}
            </>
          );
        }}
        MenuProps={MenuProps}
      >
        {users.map((user, index) => (
          <MenuItem key={user.userNickname} value={user.userId + '@' + index}>
            <Checkbox
              checked={userSelected.indexOf(user.userId + '@' + index) > -1}
            />
            <Avatar
              avatar={user.avatar}
              onClickAvatar={() => {
                <></>;
              }}
              css={{
                width: '40px',
                marginLeft: '20px',
                marginRight: '8px',
              }}
            />
            <ListItemText primary={user.userNickname} />
          </MenuItem>
        ))}
      </Select>

      
      <CountdownTimer color={'#2B9FDE'} bold={true}></CountdownTimer>
    </Box>
  );
};

export default SubToolbar;
