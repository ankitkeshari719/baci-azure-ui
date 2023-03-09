import React, { useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { ActionType, GlobalContext } from '../contexts/GlobalContext';

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
  personName: any[];
  onClickOfUser: (val: any, user: any) => void;
};

const FacilitatorDropDown = ({ personName, onClickOfUser }: Props) => {
  const {
    state: { users },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);

  return (
    <>
      <span
        style={{
          display:'flex',
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
        <img src="/svgs/Line 13.svg"></img>
        <span
          style={{
            lineHeight: '20px',
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            color: '#808080',
            marginLeft: '10px',
          }}
        >
          Facilitator
        </span>
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
            IconComponent={() => <img src="/svgs/Down.svg"></img>}
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
              // });

              return valueToBeDisplayed;
            }}
            MenuProps={MenuProps}
          >
            {users.map(name => (
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
                />
                <ListItemText
                  primary={
                    name.userId === global.user.id ? 'You' : name.userNickname
                  }
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </span>
    </>
  );
};

export default FacilitatorDropDown;
