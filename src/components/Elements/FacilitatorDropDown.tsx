import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { ListItemIcon, Typography } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { UserType } from '../../types';
import * as Icons from 'heroicons-react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 302,
      background: '#FFFFFF',
      border: '1px solid #CCCCCC',
      boxShadow: '0px 1px 10px rgba(0, 0, 0, 0.15)',
      borderRadius: '10px',
    },
  },
};

type Props = {
  personName: any[];
  onClickOfUser: (val: any, user: any) => void;
};

const FacilitatorDropDown = ({ personName, onClickOfUser }: Props) => {
  const {
    state: { users },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [tempUsers, setTempUsers] = React.useState<UserType[]>([]);

  React.useEffect(() => {
    setTempUsers(users);
  });
  tempUsers.forEach(function (item, i) {
    if (item.userId === global.user.id) {
      tempUsers.splice(i, 1);
      tempUsers.unshift(item);
    }
  });
  return (
    <>
      <span
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '450px',
          minWidth: '300px',
          alignItems: 'center',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '14px',
        }}
      >
        {/* Info Icon */}
        <img src="/svgs/Line 13.svg" />
        {/* Facilitator Text */}
        <span
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            color: '#808080',
            marginLeft: '32px',
          }}
        >
          Facilitator
        </span>
        {/* Selector Input */}
        <FormControl sx={{ m: 1, width: '200px' }}>
          <Select
            sx={{
              fieldset: {
                border: 'none',
                opacity: 1,
                color: '#4E4E4E',
              },
            }}
            multiple
            value={personName}
            renderValue={selected => {
              var valueToBeDisplayed = '';
              let selectedUsers: UserType[] = [];
              users.forEach(user => {
                selected.forEach(select => {
                  if (user.userId == select) {
                    selectedUsers.push(user);
                  }
                });
              });
              selectedUsers.forEach(user => {
                if (user.userId === global.user.id) {
                  if (valueToBeDisplayed == '') {
                    valueToBeDisplayed = 'You';
                  } else {
                    valueToBeDisplayed = valueToBeDisplayed + ', ' + 'You';
                  }
                } else {
                  if (valueToBeDisplayed == '') {
                    valueToBeDisplayed = user.userNickname;
                  } else {
                    valueToBeDisplayed =
                      valueToBeDisplayed +
                      ', ' +
                      user.userNickname.split(' ')[0];
                  }
                }
              });
              return valueToBeDisplayed;
            }}
            IconComponent={props => (
              <Icons.ChevronDownOutline
                size={24}
                color="#4E4E4E"
                style={{
                  cursor: 'pointer',
                }}
                {...props}
              />
            )}
            MenuProps={MenuProps}
          >
            {tempUsers.map(user => {
              const imaSrc = '/avatars/animals/' + user.avatar + '.svg';
              return (
                <MenuItem
                  key={user.userId}
                  value={user.userId}
                  onClick={event => onClickOfUser(event, user.userId)}
                  disabled={
                    user.isMobile == true ||
                    user.userId == global.user.id ||
                    user.userId == global.currentRetro?.creatorId
                  }
                >
                  <Checkbox
                    checked={
                      user.isFacilitator ||
                      user.userId == global.currentRetro?.creatorId
                    }
                    disabled={
                      user.userId === global.user.id ||
                      user.userId == global.currentRetro?.creatorId
                    }
                  />
                  <ListItemIcon>
                    <LazyLoadImage
                      width='40px !important'
                      height='40px !important'
                      style={{

                        borderRadius: '50%',
                      }}
                      src={imaSrc}
                    ></LazyLoadImage>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      user.userId === global.user.id ? (
                        <Typography
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '20px',
                            letterSpacing: '0.6px',
                            color: '#343434',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '150px',
                            maxWidth: '150px',
                          }}
                        >
                          You
                        </Typography>
                      ) : (
                        <Typography
                          style={{
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '20px',
                            letterSpacing: '0.6px',
                            color: '#343434',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '150px',
                            maxWidth: '150px',
                          }}
                        >
                          {user.userNickname}
                        </Typography>
                      )
                    }
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </span>
    </>
  );
};

export default FacilitatorDropDown;
