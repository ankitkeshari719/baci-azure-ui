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

const FacilitatorDropDown = () => {
  const {
    state: { users },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const [personName, setPersonName] = React.useState<any[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    console.log('value', value);

    // setPersonName(
    //   // On autofill we get a stringified value.
    //   typeof value === 'string' ? value.split(',') : value
    // );
  };
  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };
  const assignFacilitatorsRights = async (userId: string) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(BoardActionType.SET_FACILITATOR, {
      userIdFac: userId,
    }).then(
      res => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      error => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
    );
  };
  useEffect(() => {
    let valueToBeDisplayed: any[] = [];
    users.forEach(user => {
      if (user.isFacilitator) {
        valueToBeDisplayed.push(user.userId);
      }
      if (
        user.isFacilitator &&
        user.userId == global.user.id &&
        user.userId != global.currentRetro?.creatorId
      ) {
        dispatch({
          type: ActionType.SET_USER,
          payload: {
            user: {
              id: global.user.id,
              name: global.user.name,
              avatar: global.user.avatar,
              userType: 2,
            },
          },
        });
      } else if (
        !user.isFacilitator &&
        user.userId == global.user.id &&
        user.userId != global.currentRetro?.creatorId
      ) {
        dispatch({
          type: ActionType.SET_USER,
          payload: {
            user: {
              id: global.user.id,
              name: global.user.name,
              avatar: global.user.avatar,
              userType: 1,
            },
          },
        });
      }
    });
    setPersonName(valueToBeDisplayed);
  }, [users]);
  const onClickOfUser = (val: any, user: any) => {
    console.log(val, user);
    assignFacilitatorsRights(user);
  };
  return (
    <>
      {global.user.id == global.currentRetro?.creatorId ? (
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">Facilitator</InputLabel>
          <Select
            sx={{
              fieldset: {
                border: 'none',
                div: { padding: 0 },
                opacity: 1,
              },
            }}
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={personName}
            //   onChange={handleChange}
            //   input={<OutlinedInput label="Tag" />}
            renderValue={selected => {
              var valueToBeDisplayed = '';
              console.log(selected, 'selected');
              // selected.forEach((id, index) => {
              users.forEach(element => {
                if (element.userId == global.user.id && element.isFacilitator) {
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
                      valueToBeDisplayed + ', ' + element.userNickname;
                  }
                }
              });
              // });

              return valueToBeDisplayed;
              // selected.join(', ');
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
                  name.userId == global.currentRetro?.creatorId
                }
              >
                <Checkbox checked={name.isFacilitator} />
                <ListItemText
                  primary={
                    name.userId === global.user.id ? 'You' : name.userNickname
                  }
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
    </>
  );
};

export default FacilitatorDropDown;
