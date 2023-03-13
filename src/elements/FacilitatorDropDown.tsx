import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { BoardContext } from '../contexts/BoardContext';
import { GlobalContext } from '../contexts/GlobalContext';
import { ListItemIcon, Typography } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { UserType } from '../types';
import { withStyles } from '@material-ui/core/styles';

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

const iconStyles = {
  selectIcon: {
    color: 'green',
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
              users.forEach(element => {
                if (element.userId == global.user.id) {
                  if (valueToBeDisplayed == '') {
                    valueToBeDisplayed = 'You';
                  } else {
                    valueToBeDisplayed = valueToBeDisplayed + ', ' + 'You';
                  }
                } else if (element.isFacilitator) {
                  if (valueToBeDisplayed == '') {
                    valueToBeDisplayed = element.userNickname;
                  } else {
                    valueToBeDisplayed =
                      valueToBeDisplayed +
                      ', ' +
                      element.userNickname.split(' ')[0];
                  }
                }
              });
              return valueToBeDisplayed;
            }}
            IconComponent={() => <img src="/svgs/Down.svg" />}
            MenuProps={MenuProps}
          >
            {tempUsers.map(name => {
              const imaSrc = '/avatars/animals/' + name.avatar + '.svg';
              return (
                <MenuItem
                  key={name.userId}
                  value={name.userId}
                  onClick={event => onClickOfUser(event, name.userId)}
                  disabled={
                    name.isMobile == true ||
                    name.userId == global.user.id ||
                    name.userId == global.currentRetro?.creatorId
                  }
                >
                  <Checkbox
                    checked={
                      name.isFacilitator ||
                      name.userId == global.currentRetro?.creatorId
                    }
                    disabled={name.userId === global.user.id}
                  />
                  <ListItemIcon>
                    <LazyLoadImage
                      style={{
                        width: '40px !important',
                        height: '40px !important',
                        borderRadius: '50%',
                      }}
                      src={imaSrc}
                    ></LazyLoadImage>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      name.userId === global.user.id ? (
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
                          {name.userNickname}
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
