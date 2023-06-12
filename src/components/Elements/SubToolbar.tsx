import { Box } from '@material-ui/core';
import { Grid, Tooltip, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { BoardContext } from '../../contexts/BoardContext';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Avatar from './Avatar';
import { CountdownTimer } from './CountdownTimer';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import commonStyles from './../../style.module.scss';
import { OutlinedButton } from '..';
import ReactToPrint from 'react-to-print';

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

type Props = {
  componentRef: any;
};

const SubToolbar = ({ componentRef }: Props) => {
  const {
    state: { users, ended },
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [openUserSelector, setOpenUserSelector] =
    React.useState<boolean>(false);
  const [userSelected, setUserSelected] = React.useState<string[]>([]);
  const isAllSelected =
    users.length > 0 && userSelected.length === users.length;

  const [userNameIdArray, setUserNameIdArray] = React.useState<any[]>([]);

  const getValueForAll = (): string => {
    let userVal: string = '';
    users?.forEach((user: any, index) => {
      if (userVal === '') userVal = user.userId;
      else userVal = userVal + ',' + user.userId;
    });
    return userVal;
  };

  // Update the userSelected after changing of users
  useEffect(() => {
    setUserSelected(getValueForAll().split(','));
  }, [users]);

  // Update the userSelected after changing of user userType
  useEffect(() => {
    setUserSelected(getValueForAll().split(','));
  }, [users, global.user.userType]);

  // Update the userNameIdArray after changing of user Selected
  useEffect(() => {
    if (userSelected.length === 0) {
      setUserNameIdArray([]);
    } else {
      const selectedUsers: any = [];
      userSelected.forEach(id => {
        const selectedUser = users.filter(user => user.userId === id);
        selectedUser && selectedUsers.push(selectedUser[0]);
      });
      setUserNameIdArray(() => selectedUsers);
    }
  }, [userSelected]);

  // Call Action if User selected changes
  useEffect(() => {
    dispatch({
      type: ActionType.SET_USER_SELECTED,
      payload: { usersSelected: userNameIdArray },
    });
  }, [userNameIdArray]);

  const handleChange = (event: SelectChangeEvent<typeof userSelected>) => {
    const {
      target: { value },
    } = event;
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

  return (
    <>
      <Grid
        container
        item
        xs={12}
        md={12}
        lg={12}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: '60px',
          paddingLeft: '56px',
          paddingRight: '56px',
          marginTop: '10px',
        }}
      >
        <Grid
          item
          lg={8}
          xs={6}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          {/* PARTICIPANTS text */}
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
          {/* Users Avatar */}
          {users?.map(
            (user, index) =>
              index < 4 && (
                <Avatar
                  key={user.userId}
                  avatar={user.avatar}
                  css={{
                    width: '40px',
                    height: '40px',
                    marginLeft: '0',
                    marginRight: '-8px',
                    border:
                      userSelected.indexOf(user.userId) > -1
                        ? `3px solid` + commonStyles.PrimaryMain
                        : '3px solid transparent',
                  }}
                />
              )
          )}
          {/* User Selector */}
          {global.user.userType == 2 && !ended ? (
            // Facilitator View User Selector Panel
            <>
              <Select
                sx={{
                  fieldset: {
                    border: 'none',
                    div: { padding: 0 },
                    opacity: 1,
                  },
                }}
                inputProps={{ style: { width: '20px', padding: 0 } }}
                labelId="Facilitator-label"
                id="Facilitator-checkbox"
                multiple
                onClick={() => {
                  setOpenUserSelector(true);
                }}
                value={userSelected}
                onChange={event => {
                  handleChange(event);
                }}
                IconComponent={() => <></>}
                input={
                  <OutlinedInput
                    inputProps={{ padding: 0, width: '20px' }}
                    label="Tag"
                  />
                }
                renderValue={() => {
                  return <img src="/svgs/Subtract.svg"></img>;
                }}
                MenuProps={MenuProps}
              >
                <MenuItem value="all">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={
                      userSelected.length > 0 &&
                      userSelected.length < users.length
                    }
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>
                {/* Horizontal Line */}
                <hr
                  style={{
                    width: '100%',
                    color: '#E3E3E3',
                    border: '1px solid #E3E3E3',
                  }}
                ></hr>
                {users.map((user, index) => {
                  return (
                    <MenuItem
                      sx={{
                        hover: '',
                        cursor: '',
                        background: '',
                      }}
                      id="item"
                      key={user.userId + index}
                      value={user.userId}
                    >
                      <Checkbox
                        checked={userSelected.indexOf(user.userId) > -1}
                      />
                      <Avatar
                        avatar={user.avatar}
                        css={{
                          width: '40px',
                          height: '40px',
                          marginLeft: '20px',
                          marginRight: '8px',
                          border: 'none',
                        }}
                      />
                      <Tooltip title={user.userNickname}>
                        <ListItemText
                          sx={{
                            '&& .MuiListItemText-primary': {
                              minWidth: '100px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            },
                          }}
                          primary={user.userNickname}
                        />
                      </Tooltip>
                    </MenuItem>
                  );
                })}
              </Select>
              <img style={{ marginLeft: '15px' }} src="/svgs/Line 13.svg"></img>
            </>
          ) : (
            // Participant View User Selector Panel
            <Select
              sx={{
                fieldset: {
                  border: 'none',
                  div: { padding: 0 },
                  opacity: 1,
                },
              }}
              inputProps={{ style: { width: '20px', padding: 0 } }}
              labelId="participant-user-panel"
              id="participant-user-panel"
              multiple
              onClick={() => {
                setOpenUserSelector(true);
              }}
              value={userSelected}
              IconComponent={() => <></>}
              input={
                <OutlinedInput
                  inputProps={{ padding: 0, width: '20px' }}
                  label="Tag"
                />
              }
              renderValue={() => {
                return <img src="/svgs/Down.svg"></img>;
              }}
              MenuProps={MenuProps}
            >
              {users.map((user, index) => (
                <MenuItem
                  id="item"
                  sx={{
                    hover: 'none!important',
                    cursor: 'text',
                    background: 'white!important',
                  }}
                  key={user.userId + index + 'participant'}
                  value={user.userId}
                >
                  <Avatar
                    avatar={user.avatar}
                    css={{
                      width: '40px',
                      height: '40px',
                      marginLeft: '20px',
                      marginRight: '8px',
                      border: 'none',
                    }}
                  />
                  <Tooltip title={user.userNickname}>
                    <ListItemText
                      sx={{
                        '&& .MuiListItemText-primary': {
                          minWidth: '100px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                      }}
                      primary={user.userNickname}
                    />
                  </Tooltip>
                </MenuItem>
              ))}
            </Select>
          )}
          {/* Count Down Timer */}
          {!ended && (
            <CountdownTimer color={'#2B9FDE'} bold={true}></CountdownTimer>
          )}
        </Grid>
        {/* Download PDF Button */}
        {global.user.userType == 2 && ended &&  (
          <Grid
            item
            lg={4}
            xs={6}
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <ReactToPrint
              trigger={() => (
                <OutlinedButton
                  id="downloadBoardPdf"
                  label="Download Pdf"
                  onClick={() => {}}
                  style={{
                    minWidth: '172px !important',
                    width: '172px !important',
                    height: '40px !important',
                  }}
                  textStyle={{ color: '#159ADD' }}
                />
              )}
              content={() => componentRef.current}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default SubToolbar;
