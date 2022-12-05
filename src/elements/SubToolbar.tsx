import { Box } from '@material-ui/core';
import {
  Autocomplete,
  Button,
  ListItemIcon,
  Popover,
  TextField,
  Tooltip,
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
import { ActionType, GlobalContext } from '../contexts/GlobalContext';
import commonStyles from './../style.module.scss';
// import Person from '@material-ui/icons/Person';

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

const SubToolbar = (props: any) => {
  const {
    state: { columns, users, retroName, lastStateUpdate, ended },
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  // const classes = React.useStyles();
  const [selected, setSelected] = React.useState([]);
  const [userSelected, setUserSelected] = React.useState<string[]>([]);
  const [userNameIdArray, setUserNameIdArray] = React.useState<any[]>([]);
  const isAllSelected =
    users.length > 0 && userSelected.length === users.length;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const [showSelect, setShowSelect] = React.useState(false);
  const id = open ? 'simple-popover' : undefined;
  const [openUserSelect, setOpenUserSelect] = React.useState<boolean>(false);
  const [outsideClick, setOutSideClick] = React.useState<boolean>(false);
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
    // console.log(value);

    if (value[value.length - 1] === 'all') {
      setUserSelected(
        userSelected.length === users.length ? [] : getValueForAll().split(',')
      );
      return;
    }
    setUserSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  useEffect(() => {
    setUserSelected(getValueForAll().split(','));
  }, [!openUserSelect && users]);
  useEffect(() => {
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
  useEffect(() => {
    dispatch({
      type: ActionType.SET_USER_SELECTED,
      payload: { usersSelected: userNameIdArray },
    });
  }, [userNameIdArray]);
  const getValueForAll = (): string => {
    var userVal: string = '';
    users?.forEach((user: any, index) => {
      if (userVal === '') userVal = user.userId + '@' + index;
      else userVal = userVal + ',' + user.userId + '@' + index;
    });
    return userVal;
  };
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '60px',
        paddingLeft: '56px',
        paddingRight: '56px',
        marginTop: '10px',
        width: 'calc(100%-112px)',
      }}
    >
      <Box sx={{ display: 'flex', marginRight: '15px', alignItems: 'center' }}>
        <Box
          sx={{
            color: '#808080',
            fontSize: '28px',
            fontWeight: '400',
            flexDirection: 'row',
            display: 'flex',
            marginRight: '10px',
            alignItems: 'center',
          }}
        >
          <Typography>
            {users?.length < 9 ? '0' + users?.length : users?.length}
          </Typography>
          <Typography
            sx={{ fontSize: '14px', fontWeight: '500', marginLeft: '4px' }}
          >
            PARTICIPANTS
          </Typography>
        </Box>
        <>
          {' '}
          {users?.map(
            (user, index) =>
              index < 4 && (
                <Avatar
                  key={user.userId}
                  avatar={user.avatar}
                  onClickAvatar={() => {}}
                  css={{
                    width: '40px',
                    height: '40px',
                    marginLeft: '0',
                    marginRight: '-8px',
                    border:
                      userSelected.indexOf(user.userId + '@' + index) > -1
                        ? `3px solid` + commonStyles.PrimaryMain
                        : '3px solid transparent',
                  }}
                />
              )
          )}
        </>
        {/* <Button
          style={{ marginLeft: '15px' }}
          onClick={(event: any) => {
            setShowSelect(!showSelect)
          }}
      
        >
          {' '}
          {global.user.id === global.currentRetro?.creatorId ? (
            <img src="/svgs/Subtract.svg"></img>
          ) : (
            <img src="/svgs/Down.svg"></img>
          )}
             </Button> */}
        <Select
          sx={{
            fieldset: {
              border: 'none',
              div: { padding: 0 },
              opacity: 1,
            },
            // padding: '1px!important',
            // width: '20px',
          }}
          inputProps={{ style: { width: '20px', padding: 0 } }}
          // open={showSelect}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          onClick={(event: any) => {
            // console.log('clicked');
            // setShowSelect(false);
            setOpenUserSelect(true);
          }}
          value={userSelected}
          onChange={event => {
            global.user.userType == 2 && handleChange(event);
          }}
          IconComponent={() => <></>}
          input={
            <OutlinedInput
              inputProps={{ padding: 0, width: '20px' }}
              label="Tag"
            />
          }
          renderValue={(selected: any) => {
            return (
              // <>
              //   {' '}
              //   {userNameIdArray &&
              //     userNameIdArray?.length > 0 &&
              //     userNameIdArray.map(user => (
              //       <Avatar
              //         key={user?.userId}
              //         avatar={user?.avatar}
              //         css={{
              //           width: '40px',
              //           marginLeft: '0',
              //           marginRight: '-8px',
              //           border: 'none',
              //         }}
              //       />
              //     ))}
              // </>
              <>
                {global.user.userType == 2 ? (
                  <img src="/svgs/Subtract.svg"></img>
                ) : (
                  <img src="/svgs/Down.svg"></img>
                )}
              </>
              // <img src="/svgs/Subtract.svg"></img>
            );
          }}
          MenuProps={MenuProps}
        >
          {global.user.userType == 2 && !ended && (
            <MenuItem
              value="all"

              // classes={{
              //   root: isAllSelected ? classes.selectedAll : '',
              // }}
            >
              {/* <ListItemIcon> */}
              <Checkbox
                // classes={{ indeterminate: classes.indeterminateColor }}
                checked={isAllSelected}
                indeterminate={
                  userSelected.length > 0 && userSelected.length < users.length
                }
              />
              {/* </ListItemIcon> */}
              <ListItemText
                // classes={{ primary: classes.selectAllText }}
                primary="Select All"
              />
            </MenuItem>
          )}

          {global.user.userType == 2 && !ended && (
            <hr
              style={{
                width: '100%',
                color: '#E3E3E3',
                border: '1px solid #E3E3E3',
              }}
            ></hr>
          )}

          {users.map((user, index) => (
            <MenuItem
              // disabled={global.user.userType != 2}
              // style={{ hover: 'none!important', cursor: 'text' }}
              sx={{
                hover: global.user.userType != 2 ? 'none!important':'',
                cursor: global.user.userType != 2 ? 'text':"",
                background: global.user.userType != 2 ? 'white!important':'',
              }}
              id="item"
              key={user.userId + index}
              value={user.userId + '@' + index}
            >
              {global.user.userType === 2 && !ended && (
                <Checkbox
                  checked={userSelected.indexOf(user.userId + '@' + index) > -1}
                />
              )}
              <Avatar
                avatar={user.avatar}
                onClickAvatar={() => {
                  null;
                }}
                css={{
                  width: '40px',
                  height: '40px',
                  marginLeft: '20px',
                  marginRight: '8px',
                }}
              />
              <Tooltip title={user.userNickname}>
              <ListItemText sx={{'&& .MuiListItemText-primary':{minWidth: '100px', overflow: 'hidden', textOverflow : 'ellipsis'}
                }} primary={user.userNickname} />
              </Tooltip>
            
            </MenuItem>
          ))}
        </Select>

        {global.user.userType == 2 && !ended && (
          <img style={{ marginLeft: '15px' }} src="/svgs/Line 13.svg"></img>
        )}
      </Box>

      {!ended && (
        <CountdownTimer color={'#2B9FDE'} bold={true}></CountdownTimer>
      )}
    </Box>
  );
};

export default SubToolbar;
