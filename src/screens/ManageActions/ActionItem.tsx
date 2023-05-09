import * as React from 'react';
import './styles.scss';
import * as Icons from 'heroicons-react';

import { ActionInterface } from '../../types';
import { ListItemIcon, ListItemText } from '@material-ui/core';
import {
  Box,
  Button,
  Checkbox,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  TextField,
} from '@mui/material';
import Avatar from '../../elements/Avatar';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { BoardContext } from '../../contexts/BoardContext';
import { GlobalContext } from '../../contexts/GlobalContext';
import { MAX_CARD_TEXT_LENGTH } from '../../constants';

type Props = {
  action: ActionInterface;
};

export default function ActionItem({ action }: Props) {
  const {
    state: {},
    commitAction,
  } = React.useContext(BoardContext);
  const [global] = React.useContext(GlobalContext);
  const labelId = `action-label-${action.id}`;

  const [isMouseHover, setIsMouseHover] = React.useState<boolean>(false);
  const [isEditActionClick, setIsEditActionClick] =
    React.useState<boolean>(false);

  const [selectedAction, setSelectedAction] = React.useState<ActionInterface>();
  const [editActionValue, setEditActionValue] = React.useState<
    string | undefined
  >(selectedAction?.value);

  const handleMouseEnter = () => {
    setIsMouseHover(true);
  };

  const handleMouseLeave = () => {
    setIsMouseHover(false);
  };

  const openEditActionOption = (action: ActionInterface) => {
    setIsEditActionClick(true);
    setSelectedAction(action);
    setEditActionValue(action.value);
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

  const saveEditData = async (editActionValue: string | undefined) => {
    await saveAndProcessAction(BoardActionType.UPDATE_ACTION, {
      id: selectedAction?.id,
      value: editActionValue,
    }).then(
      res => {
        setIsEditActionClick(false);
      },
      err => {}
    );
  };

  const cancelEditedData = () => {
    setEditActionValue(action.value);
    setIsEditActionClick(false);
  };

  return (
    <ListItem key={labelId} style={{ padding: '8px 12px' }}>
      {/* <Box className="reorderIconContainer"></Box> */}
      <ListItemIcon
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          minWidth: '40px',
        }}
      >
        <Checkbox
          edge="start"
          // checked={action.checked}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': labelId }}
          icon={
            <img
              src="/svgs/CircleUnchecked.svg"
              alt="Logo"
              style={{ width: '24px', height: '24px' }}
            />
          }
          checkedIcon={
            <Icons.CheckCircle
              size={24}
              color="#159ADD"
              style={{
                cursor: 'pointer',
              }}
            />
          }
        />
      </ListItemIcon>
      {!isEditActionClick ? (
        <ListItemButton
          role={undefined}
          dense
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ maxWidth: '350px' }}
        >
          <ListItemText
            id={labelId}
            primary={action.value}
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '22px',
              letterSpacing: '0.2px',
              color: '#343434',
              wordWrap: 'break-word',
            }}
          />
          {isMouseHover && (
            <Icons.PencilAltOutline
              style={{
                color: '#CCCCCC',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
              onClick={() => openEditActionOption(action)}
            />
          )}
        </ListItemButton>
      ) : (
        <ListItemButton
          sx={{
            border: '1px solid #159ADD',
            ':hover': { background: '#ffffff' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: '0px',
            }}
          >
            <TextField
              fullWidth
              multiline
              value={editActionValue}
              onChange={e => setEditActionValue(e.currentTarget.value)}
              onKeyDown={e => {
                const tempValue = editActionValue;
                const removedEnter =
                  tempValue && tempValue.replace(/[\r\n]/gm, '');
                setEditActionValue(removedEnter);
                const removedSpaces =
                  removedEnter && removedEnter.replace(/ /g, '');
                if (
                  e.keyCode === 13 &&
                  removedSpaces &&
                  removedSpaces.length !== 0
                ) {
                  saveEditData(editActionValue);
                  (e.target as HTMLInputElement).blur();
                }
              }}
              inputProps={{
                maxLength: MAX_CARD_TEXT_LENGTH,
                style: {
                  padding: 0,
                },
              }}
              sx={{
                '& fieldset': { border: 'none' },
                textarea: {
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  color: '#343434',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22px',
                  letterSpacing: '0.2px',
                },
              }}
            />
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'end',
              }}
            >
              <Button
                onClick={cancelEditedData}
                sx={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  color: '#EA4335',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                  paddingRight: '0',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => saveEditData(editActionValue)}
                sx={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  color: '#159ADD',
                  fontSize: '14px',
                  lineHeight: '20px',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </ListItemButton>
      )}

      <ListItemAvatar>
        {action?.assigneeAvatar === '' ||
        action.assigneeAvatar === undefined ? (
          <Icons.UserCircle
            style={{ color: '#CCCCCC', width: '32px', height: '32px' }}
          />
        ) : (
          <Avatar
            avatar={action?.assigneeAvatar}
            onClickAvatar={() => {}}
            css={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
            }}
          ></Avatar>
        )}
      </ListItemAvatar>
    </ListItem>
  );
}
