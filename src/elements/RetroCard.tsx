import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent, keyframes, ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography, useMediaQuery
} from '@mui/material';
import { MAX_CARD_TEXT_LENGTH, UNGROUPED } from '../constants';
import { BoardContext } from '../contexts/BoardContext';
import { BoardActionType } from '../statemachine/BoardStateMachine';
import { Card as RetroCardType, CardGroup } from '../types';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForever from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoveDownIcon from '@mui/icons-material/MoveDown';
import ThumbUpOffAlt from '@mui/icons-material/ThumbUpOffAlt';
import Color from 'color';
import React from 'react';
import shortid from 'shortid';
import { ConfirmContext } from '../contexts/ConfirmContext';
import { GlobalContext } from '../contexts/GlobalContext';
import theme from '../theme/theme';

const bumpAnimation = keyframes`
    0% {
      opacity: 0;
      transform: scale(100%);
    }
    50% {
        transform: scale(110%);
    }
    100% {
        opacity: 1;
        transform: scale(100%);
    }
`;

export function RetroCard({
  card,
  groups,
  currentGroupId,
  columnId,
  hideButtons,
  moveCard,
  animate,
}: {
  card: RetroCardType;
  currentGroupId: string;
  groups: CardGroup[];
  columnId: string;
  hideButtons: boolean;
  moveCard: (cardId: string, toGroup: string, toIndex: number) => void;
  animate: boolean;
}) {
  const [global, dispatch] = React.useContext(GlobalContext);
  const {
    state: { columns, ended },
    commitAction,
  } = React.useContext(BoardContext);

  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState(card.value);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const editFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editing) {
      const end = editFieldRef.current?.value.length || 0;
      editFieldRef.current?.setSelectionRange(end, end);
      editFieldRef.current?.focus();
    }
  }, [editing]);

  const handleClick = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.TouchEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMove = async (groupId?: string) => {
    if (groupId) {
      await moveCard(card.id, groupId, 0);
    } else {
      const id = shortid.generate();
      await createGroup(id);
      await moveCard(card.id, id, 0);
    }
    setAnchorEl(null);
  };

  React.useEffect(() => {
    setValue(card.value);
  }, [card.value]);

  const cardColour =
    columns.find(column => column.id === columnId)?.cardColour || '#A4C5E3';
  const cardColourHover =
    columns.find(column => column.id === columnId)?.cardColourHover ||
    '' + Color(cardColour).darken(0.1);

  const isXsUp = useMediaQuery(theme.breakpoints.only('xs'));
  const isSmUp = useMediaQuery(theme.breakpoints.only('sm'));

  const { setConfirmAction } = React.useContext(ConfirmContext);

  const saveAndProcessAction = async (
    actionName: BoardActionType,
    parameters: any
  ) => {
    await commitAction(actionName as BoardActionType, {
      parameters,
      userId: global.user.id,
    });
  };
  const createGroup = async (groupId: string) => {
    await saveAndProcessAction(BoardActionType.CREATE_GROUP, {
      groupId,
      columnId,
      order: 0,
    });
  };
  const deleteCard = async (cardId: string) => {
    setConfirmAction({
      action: 'Delete',
      title: 'Delete a card',
      text: 'Are you sure you want to delete a card?',
      onConfirm: () => {
        saveAndProcessAction(BoardActionType.DELETE_CARD, { cardId }).then(() => {
          setConfirmAction(undefined);
        });
      },
    });
  };
  const addReactToCard = async (cardId: string) => {
    await saveAndProcessAction(BoardActionType.ADD_REACT_TO_CARD, {
      cardId,
      react: '👍',
    });
  };
  const removeReactFromCard = async (cardId: string) => {
    await saveAndProcessAction(BoardActionType.REMOVE_REACT_FROM_CARD, {
      cardId,
      react: '👍',
    });
  };
  const submit = async (value: string) => {
    if (card.value !== value) {
      await saveAndProcessAction(BoardActionType.SET_CARD_VALUE, {
        cardId: card.id,
        value,
      });
      setEditing(false);
    } else {
      cancelEdit();
    }
  };
  const cancelEdit = (): void => {
    setEditing(false);
    setValue(card.value);
  };

  const cardGroup = groups.find(group =>
    group.cards.find(c => c.id === card.id)
  );

  const ungroupedGroupId = groups.find(group => group.name === UNGROUPED)?.id;

  const cardIsGrouped = cardGroup?.name !== UNGROUPED;

  const userReacted = !!(card.reacts || []).find(r => r.by === global.user.id);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          background: cardColour,
          border: '1px solid ' + Color(cardColour).darken(0.1),
          borderRadius: 0,
          boxShadow: '-2px 5px 9px -4px rgba(0,0,0,0.74)',
          minWidth: isXsUp ? '44vw' : isSmUp ? '20vw' : '12vw',
          maxWidth: isXsUp ? '44vw' : isSmUp ? '20vw' : '12vw',
          animation: animate ? `${bumpAnimation} 300ms ease` : 'none',
          '&:hover': { background: cardColourHover },
        }}
      >
        {/* Drag handle */}
        <span
          style={{
            position: 'initial',
            padding: 0,
            minWidth: 'calc(100% - 32px)',
            float: 'left',
          }}
          className="handle"
        >
          &nbsp;
        </span>
        {!hideButtons && !ended ? (
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            color="primary"
            sx={{
              position: 'initial',
              padding: 0,
              minWidth: '32px',
              float: 'right',
            }}
          >
            <KeyboardArrowDownIcon />
          </Button>
        ) : null}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          sx={{ border: '1px solid #9EA6AC', ul: { color: '#4D555A' } }}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {' '}
          {!editing && card.createdBy === global.user.id ? (
            <MenuItem
              onClick={() => {
                setEditing(true);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Edit card</ListItemText>
            </MenuItem>
          ) : null}
          <MenuItem>
            <ListItemIcon>
              <MoveDownIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Move card</ListItemText>
          </MenuItem>
          {cardIsGrouped ? (
            <MenuItem onClick={() => handleMove(ungroupedGroupId)}>
              <ListItemIcon></ListItemIcon>
              <ListItemText>out of Grouping</ListItemText>
            </MenuItem>
          ) : null}
          <MenuItem onClick={() => handleMove()}>
            <ListItemIcon></ListItemIcon>
            <ListItemText>to New Grouping</ListItemText>
          </MenuItem>
          {groups
            .filter(
              group => group.id !== currentGroupId && group.name !== UNGROUPED
            )
            .map((group, i) => (
              <MenuItem key={group.id} onClick={() => handleMove(group.id)}>
                <ListItemIcon />
                <ListItemText>
                  to {group.name || 'Unnamed group ' + (i + 1)}
                </ListItemText>
              </MenuItem>
            ))}
        </Menu>
        <CardContent sx={{ paddingBottom: editing ? '0' : 'initial' }}>
          {editing && !ended ? (
            <TextField
              multiline
              autoFocus
              fullWidth
              inputRef={editFieldRef}
              InputProps={{
                readOnly: ended,
              }}
              value={value}
              sx={{
                fieldset: { border: 'none' },
                padding: 0,
                textarea: { fontSize: '0.85rem' },
                div: { padding: 0, position: 'initial' },
                position: 'initial',
              }}
              onKeyDown={e => {
                if (e.key === 'Escape') {
                  cancelEdit();
                }
                if (e.keyCode === 13) {
                  submit(value);
                  (e.target as HTMLInputElement).blur();
                }
              }}
              onChange={e =>
                setValue(
                  e.currentTarget.value.substring(0, MAX_CARD_TEXT_LENGTH)
                )
              }
              onSubmit={() => submit(value)}
            ></TextField>
          ) : (
            <Typography
              color="black"
              style={{ fontSize: '0.85rem' }}
              onClick={e => {
                !ended &&
                  !editing &&
                  card.createdBy === global.user.id &&
                  setEditing(true);
                !hideButtons ? e.stopPropagation() : null;
              }}
              onTouchStart={e => {
                !ended &&
                  !editing &&
                  card.createdBy === global.user.id &&
                  setEditing(true);
                !hideButtons ? e.stopPropagation() : null;
              }}
              sx={{
                cursor:
                  card.createdBy === global.user.id && !ended && !hideButtons
                    ? 'text'
                    : '',
              }}
              className={
                card.createdBy === global.user.id && !ended && !hideButtons
                  ? ''
                  : 'handle'
              }
            >
              {card.value}
            </Typography>
          )}
          {!editing && card.editCount > 1 ? (
            <Typography
              color="#9DA6AB"
              style={{ fontSize: '0.85rem' }}
              className="handle"
            >
              (edited)
            </Typography>
          ) : null}
          {editing && value && value.length >= MAX_CARD_TEXT_LENGTH - 20 ? (
            <Typography
              style={{
                fontSize: '0.75rem',
                textAlign: 'left',
                margin: '10px 0',
              }}
            >
              Characters remaining: {MAX_CARD_TEXT_LENGTH - value.length}
            </Typography>
          ) : null}
          {editing ? (
            <Box
              sx={{ display: 'flex', justifyContent: 'flex-end', padding: 0 }}
            >
              <Button
                sx={{ minWidth: '0px', padding: 0, position: 'initial' }}
                onClick={e => {
                  cancelEdit();
                  e.stopPropagation();
                }}
              >
                <CloseIcon sx={{ height: '20px', color: 'black' }} />
              </Button>
              <Button
                sx={{ minWidth: '0px', padding: 0, position: 'initial' }}
                onClick={e => {
                  submit(value);
                  e.stopPropagation();
                }}
              >
                <CheckIcon sx={{ height: '20px', color: 'black' }} />
              </Button>
            </Box>
          ) : null}
        </CardContent>
        <CardActions style={{ justifyContent: 'space-around', padding: 0 }}>
          {card.createdBy === global.user.id && !hideButtons && !ended ? (
            <Button
              sx={{ minWidth: '0px', position: 'initial' }}
              onClick={e => {
                deleteCard(card.id);
                e.stopPropagation();
              }}
              onTouchStart={e => {
                deleteCard(card.id);
                e.stopPropagation();
              }}
            >
              <DeleteForever sx={{ height: '20px', color: '#9EA7AC' }} />
            </Button>
          ) : null}
          <div style={{ flexGrow: 2 }}>&nbsp;</div>
          {!hideButtons ? (
            <Button
              sx={{ minWidth: '0px', position: 'initial' }}
              disabled={ended}
              onClick={e => {
                !ended
                  ? userReacted
                    ? removeReactFromCard(card.id)
                    : addReactToCard(card.id)
                  : null;
                e.stopPropagation();
              }}
              onTouchStart={e => {
                !ended
                  ? userReacted
                    ? removeReactFromCard(card.id)
                    : addReactToCard(card.id)
                  : null;
                e.stopPropagation();
              }}
            >
              <ThumbUpOffAlt
                sx={{
                  height: '20px',
                  color: userReacted ? '#1D5C98' : '#9EA7AC',
                }}
              />
              <Typography color="black" style={{ fontSize: '0.85rem' }}>
                {card.reacts.length ? card.reacts.length : ''}
              </Typography>
            </Button>
          ) : null}
        </CardActions>
      </Card>
    </>
  );
}
