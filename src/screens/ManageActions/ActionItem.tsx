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
  Typography,
} from '@mui/material';
import Avatar from '../../elements/Avatar';
import { BoardActionType } from '../../statemachine/BoardStateMachine';
import { BoardContext } from '../../contexts/BoardContext';
import { ActionType, GlobalContext } from '../../contexts/GlobalContext';
import { MAX_CARD_TEXT_LENGTH } from '../../constants';

type Props = {
  action: ActionInterface;
  handleToggleAction: (actionId: string) => void;
  addReactToAction: (actionId: string, actionBy: string) => void;
  removeReactFromAction: (actionId: string) => void;
  isFeedbackSubmitted: boolean;
};

export default function ActionItem({
  action,
  handleToggleAction,
  addReactToAction,
  isFeedbackSubmitted,
  removeReactFromAction,
}: Props) {
  const {
    state: { ended },
    commitAction,
  } = React.useContext(BoardContext);
  const [global, dispatch] = React.useContext(GlobalContext);
  const labelId = `action-label-${action.id}`;

  const [isMouseHover, setIsMouseHover] = React.useState<boolean>(false);
  const [isEditActionClick, setIsEditActionClick] =
    React.useState<boolean>(false);
  const [selectedAction, setSelectedAction] = React.useState<ActionInterface>();
  const [editActionValue, setEditActionValue] = React.useState<
    string | undefined
  >(selectedAction?.value);

  const userReacted = !!(action.reacts || []).find(
    r => r.by === global.user.id
  );

  // Handle Mover Enter on List Item to show the edit pencil
  const handleMouseEnter = () => {
    setIsMouseHover(true);
  };

  // Handle Mover Leave on List Item to show the edit pencil
  const handleMouseLeave = () => {
    setIsMouseHover(false);
  };

  // function to handle the click of edit icon
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

  // function to call API on saving the existing action
  const saveEditAction = async (editActionValue: string | undefined) => {
    dispatch({
      type: ActionType.SET_LOADING,
      payload: { loadingFlag: true },
    });
    await saveAndProcessAction(BoardActionType.UPDATE_ACTION, {
      id: selectedAction?.id,
      value: editActionValue,
    }).then(
      res => {
        setIsEditActionClick(false);
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      },
      err => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: { loadingFlag: false },
        });
      }
    );
  };

  // function to discard the edit data
  const cancelEditedData = () => {
    setEditActionValue(action.value);
    setIsEditActionClick(false);
  };

  return (
    <ListItem key={labelId} style={{ padding: '8px 12px' }}>
      {/* Checkbox */}
      <ListItemIcon
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          minWidth: '40px',
        }}
        onClick={() => handleToggleAction(action.id)}
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
      {/* Action Description and Edit Text Field */}
      {!isEditActionClick ? (
        <ListItemButton
          role={undefined}
          dense
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
          {!ended &&
            isMouseHover &&
            (global.user.userType == 2 ||
              (global.user.id === action.createdBy &&
                !isFeedbackSubmitted)) && (
              <Icons.PencilAltOutline
                style={{
                  color: '#CCCCCC',
                  width: '20px',
                  height: '20px',
                  minWidth: '20px',
                  minHeight: '20px',
                  cursor: 'pointer',
                }}
                onClick={() => openEditActionOption(action)}
              />
            )}
        </ListItemButton>
      ) : (
        // Edit TextField
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
                  saveEditAction(editActionValue);
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
            {/* Limitation */}
            {editActionValue &&
            editActionValue.length >= MAX_CARD_TEXT_LENGTH - 20 ? (
              <Typography
                style={{
                  fontSize: '0.75rem',
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                  color: '#808080',
                }}
              >
                Characters remaining:{' '}
                {MAX_CARD_TEXT_LENGTH - editActionValue.length}
              </Typography>
            ) : null}
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
                onClick={() => saveEditAction(editActionValue)}
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Button
          sx={{ minWidth: '0px', position: 'initial' }}
          disabled={ended || global.leaveRetro}
          onClick={e => {
            !ended && userReacted
              ? removeReactFromAction(action.id)
              : addReactToAction(action.id, global.user.id);
            e.stopPropagation();
          }}
        >
          {userReacted ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                fill="#FBBC05"
                stroke="#FBBC05"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.48073 1.4987C9.67288 1.03673 10.3273 1.03673 10.5195 1.4987L12.6454 6.61016C12.7264 6.80492 12.9096 6.93799 13.1199 6.95484L18.6381 7.39724C19.1369 7.43722 19.3391 8.05964 18.9591 8.38514L14.7548 11.9866C14.5946 12.1238 14.5246 12.3391 14.5736 12.5443L15.858 17.9292C15.9741 18.4159 15.4447 18.8005 15.0177 18.5397L10.2933 15.6541C10.1133 15.5441 9.8869 15.5441 9.7069 15.6541L4.98251 18.5397C4.55551 18.8005 4.02606 18.4159 4.14215 17.9292L5.42664 12.5443C5.47558 12.3391 5.40562 12.1238 5.24543 11.9866L1.04111 8.38514C0.661119 8.05964 0.863352 7.43722 1.36209 7.39724L6.88034 6.95484C7.0906 6.93799 7.27375 6.80492 7.35476 6.61016L9.48073 1.4987Z"
                fill="#FFFFF"
                stroke="#FBBC05"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <Typography
            color="black"
            style={{
              fontWeight: 400,
              fontSize: '14px',
              color: '#FBBC05',
              marginLeft: '6px',
            }}
          >
            {action.reacts.length ? action.reacts.length : ''}
          </Typography>
        </Button>
      </Box>
      {/* Avatar */}
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
